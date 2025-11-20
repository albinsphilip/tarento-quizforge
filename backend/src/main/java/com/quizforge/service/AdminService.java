package com.quizforge.service;

import com.quizforge.dto.*;
import com.quizforge.exception.ResourceNotFoundException;
import com.quizforge.model.*;
import com.quizforge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizAttemptRepository attemptRepository;

    public List<QuizSummaryResponse> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    public QuizResponse getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", id));
        return toDetailedResponse(quiz);
    }

    @Transactional
    public QuizResponse createQuiz(QuizRequest request, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", adminEmail));

        Quiz quiz = new Quiz();
        quiz.setTitle(request.title());
        quiz.setDescription(request.description());
        quiz.setDuration(request.duration());
        quiz.setIsActive(request.isActive() != null ? request.isActive() : true);
        quiz.setCreatedBy(admin);

        if (request.questions() != null) {
            for (QuestionRequest qReq : request.questions()) {
                Question question = new Question();
                question.setQuestionText(qReq.questionText());
                question.setType(Question.QuestionType.valueOf(qReq.type()));
                question.setPoints(qReq.points() != null ? qReq.points() : 1);
                question.setQuiz(quiz);

                if (qReq.options() != null) {
                    for (OptionRequest oReq : qReq.options()) {
                        Option option = new Option();
                        option.setOptionText(oReq.optionText());
                        option.setIsCorrect(oReq.isCorrect());
                        option.setQuestion(question);
                        question.getOptions().add(option);
                    }
                }
                quiz.getQuestions().add(question);
            }
        }

        quiz = quizRepository.save(quiz);
        return toDetailedResponse(quiz);
    }

    @Transactional
    public QuizResponse updateQuiz(Long id, QuizRequest request) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", id));

        // Check if quiz has any attempts
        List<QuizAttempt> attempts = attemptRepository.findByQuizId(id);
        boolean hasAttempts = !attempts.isEmpty();

        // Always allow updating metadata (title, description, duration, active status)
        quiz.setTitle(request.title());
        quiz.setDescription(request.description());
        quiz.setDuration(request.duration());
        if (request.isActive() != null) {
            quiz.setIsActive(request.isActive());
        }

        // Check if questions structure is being modified
        boolean questionsModified = false;
        if (request.questions() != null) {
            // Check if number of questions changed
            if (request.questions().size() != quiz.getQuestions().size()) {
                questionsModified = true;
            } else {
                // Check if any question content changed
                for (QuestionRequest qReq : request.questions()) {
                    if (qReq.id() == null) {
                        questionsModified = true; // New question
                        break;
                    }
                    Question existingQ = quiz.getQuestions().stream()
                            .filter(q -> q.getId().equals(qReq.id()))
                            .findFirst()
                            .orElse(null);
                    
                    if (existingQ == null) {
                        questionsModified = true;
                        break;
                    }
                    
                    // Check if question details changed
                    if (!existingQ.getQuestionText().equals(qReq.questionText()) ||
                        !existingQ.getType().name().equals(qReq.type()) ||
                        !existingQ.getPoints().equals(qReq.points())) {
                        questionsModified = true;
                        break;
                    }
                    
                    // Check if options changed
                    if (qReq.options() != null) {
                        if (qReq.options().size() != existingQ.getOptions().size()) {
                            questionsModified = true;
                            break;
                        }
                        // Check option content changes
                        for (OptionRequest oReq : qReq.options()) {
                            if (oReq.id() == null) {
                                questionsModified = true;
                                break;
                            }
                            Option existingO = existingQ.getOptions().stream()
                                    .filter(o -> o.getId().equals(oReq.id()))
                                    .findFirst()
                                    .orElse(null);
                            
                            if (existingO == null ||
                                !existingO.getOptionText().equals(oReq.optionText()) ||
                                !existingO.getIsCorrect().equals(oReq.isCorrect())) {
                                questionsModified = true;
                                break;
                            }
                        }
                        if (questionsModified) break;
                    }
                }
            }
        }

        // If quiz has attempts and questions are being modified, reject
        if (hasAttempts && questionsModified) {
            throw new IllegalStateException(
                "Cannot modify quiz structure - quiz has already been attempted by " + attempts.size() + 
                " candidate(s). You can only update the title, description, duration, or active status."
            );
        }

        // If questions were modified and no attempts, allow full update
        if (questionsModified) {
            // Clear existing questions and add new ones
            quiz.getQuestions().clear();
            
            if (request.questions() != null) {
                for (QuestionRequest qReq : request.questions()) {
                    Question question = new Question();
                    question.setQuestionText(qReq.questionText());
                    question.setType(Question.QuestionType.valueOf(qReq.type()));
                    question.setPoints(qReq.points() != null ? qReq.points() : 1);
                    question.setQuiz(quiz);

                    if (qReq.options() != null) {
                        for (OptionRequest oReq : qReq.options()) {
                            Option option = new Option();
                            option.setOptionText(oReq.optionText());
                            option.setIsCorrect(oReq.isCorrect());
                            option.setQuestion(question);
                            question.getOptions().add(option);
                        }
                    }
                    quiz.getQuestions().add(question);
                }
            }
        }
        // else: questions not modified, just save metadata changes

        quiz = quizRepository.save(quiz);
        return toDetailedResponse(quiz);
    }

    @Transactional
    public DeleteResponse deleteQuiz(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", id));
        
        // Check if quiz has any attempts - prevent deletion if it does
        List<QuizAttempt> attempts = attemptRepository.findByQuizId(id);
        if (!attempts.isEmpty()) {
            throw new IllegalStateException(
                "Cannot delete quiz - it has " + attempts.size() + 
                " attempt(s) by candidates. Deactivate the quiz instead by setting isActive=false."
            );
        }
        
        // Safe to delete - no attempts exist
        quizRepository.delete(quiz);
        
        return new DeleteResponse("Quiz with id " + id + " deleted successfully", id);
    }

    public QuizAnalyticsResponse getQuizAnalytics(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", quizId));

        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId).stream()
                .filter(a -> a.getStatus() == QuizAttempt.AttemptStatus.EVALUATED)
                .collect(Collectors.toList());

        if (attempts.isEmpty()) {
            return new QuizAnalyticsResponse(quizId, quiz.getTitle(), 0, 0.0, 0, 0);
        }

        int totalAttempts = attempts.size();
        double averageScore = attempts.stream()
                .mapToInt(QuizAttempt::getScore)
                .average()
                .orElse(0.0);
        int highestScore = attempts.stream()
                .mapToInt(QuizAttempt::getScore)
                .max()
                .orElse(0);
        int lowestScore = attempts.stream()
                .mapToInt(QuizAttempt::getScore)
                .min()
                .orElse(0);

        return new QuizAnalyticsResponse(quizId, quiz.getTitle(), totalAttempts, 
                averageScore, highestScore, lowestScore);
    }

    public List<AdminAttemptResponse> getAllAttempts() {
        return attemptRepository.findAll().stream()
                .filter(a -> a.getStatus() == QuizAttempt.AttemptStatus.EVALUATED)
                .map(this::toAdminAttemptResponse)
                .collect(Collectors.toList());
    }

    public boolean isQuizEditable(Long quizId) {
        // Check if quiz exists
        quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", quizId));
        // Check if quiz has any attempts
        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId);
        return attempts.isEmpty();
    }

    public boolean isQuizDeletable(Long quizId) {
        // Check if quiz exists
        quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", quizId));
        // Quiz can only be deleted if it has no attempts
        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId);
        return attempts.isEmpty();
    }

    private AdminAttemptResponse toAdminAttemptResponse(QuizAttempt attempt) {
        return new AdminAttemptResponse(
                attempt.getId(),
                attempt.getQuiz().getId(),
                attempt.getQuiz().getTitle(),
                attempt.getUser().getName(),
                attempt.getUser().getEmail(),
                attempt.getStartedAt(),
                attempt.getSubmittedAt(),
                attempt.getScore(),
                attempt.getTotalPoints(),
                attempt.getStatus().name(),
                attempt.getTimeTakenMinutes(),
                attempt.getExceededTimeLimit()
        );
    }

    private QuizSummaryResponse toSummaryResponse(Quiz quiz) {
        return new QuizSummaryResponse(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getDuration(),
                quiz.getIsActive(),
                quiz.getCreatedBy().getName(),
                quiz.getCreatedAt(),
                quiz.getQuestions().size()
        );
    }

    private QuizResponse toDetailedResponse(Quiz quiz) {
        List<QuestionResponse> questions = quiz.getQuestions().stream()
                .map(q -> new QuestionResponse(
                        q.getId(),
                        q.getQuestionText(),
                        q.getType().name(),
                        q.getPoints(),
                        q.getOptions().stream()
                                .map(o -> new OptionResponse(o.getId(), o.getOptionText(), o.getIsCorrect()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());

        return new QuizResponse(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getDuration(),
                quiz.getIsActive(),
                quiz.getCreatedBy().getName(),
                quiz.getCreatedAt(),
                quiz.getUpdatedAt(),
                questions
        );
    }
}

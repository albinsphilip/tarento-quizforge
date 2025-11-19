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
    private QuestionRepository questionRepository;

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

        quiz.setTitle(request.title());
        quiz.setDescription(request.description());
        quiz.setDuration(request.duration());
        if (request.isActive() != null) {
            quiz.setIsActive(request.isActive());
        }

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

        quiz = quizRepository.save(quiz);
        return toDetailedResponse(quiz);
    }

    @Transactional
    public DeleteResponse deleteQuiz(Long id) {
        // Check if quiz exists before deleting
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", id));
        
        // Delete the quiz (cascade will handle related entities)
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
                attempt.getStatus().name()
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

package com.quizforge.service;

import com.quizforge.dto.*;
import com.quizforge.exception.ResourceNotFoundException;
import com.quizforge.model.*;
import com.quizforge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository attemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    public List<QuizSummaryResponse> getAvailableQuizzes() {
        return quizRepository.findByIsActiveTrue().stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttemptResponse startQuiz(Long quizId, String candidateEmail) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", quizId));

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", candidateEmail));

        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setUser(candidate);
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setStatus(QuizAttempt.AttemptStatus.IN_PROGRESS);
        attempt.setTotalPoints(quiz.getQuestions().stream()
                .mapToInt(Question::getPoints)
                .sum());

        attempt = attemptRepository.save(attempt);
        return toAttemptResponse(attempt);
    }

    public QuizResponse getQuizForAttempt(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", quizId));
        return toQuizResponseForCandidate(quiz);
    }

    @Transactional
    public AttemptResponse submitQuiz(SubmitQuizRequest request, String candidateEmail) {
        QuizAttempt attempt = attemptRepository.findById(request.attemptId())
                .orElseThrow(() -> new ResourceNotFoundException("QuizAttempt", request.attemptId()));

        if (!attempt.getUser().getEmail().equals(candidateEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        if (attempt.getStatus() != QuizAttempt.AttemptStatus.IN_PROGRESS) {
            throw new RuntimeException("Quiz already submitted");
        }

        // Calculate time taken and validate time limit
        Quiz quiz = attempt.getQuiz();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = attempt.getStartedAt();
        
        // Handle case where startedAt might be null (legacy data)
        if (startTime == null) {
            startTime = now.minusMinutes(quiz.getDuration());
            attempt.setStartedAt(startTime);
        }
        
        long elapsedMinutes = java.time.Duration.between(startTime, now).toMinutes();
        
        attempt.setTimeTakenMinutes(elapsedMinutes);
        
        if (elapsedMinutes > quiz.getDuration()) {
            attempt.setExceededTimeLimit(true);
            System.out.println("Warning: Quiz submitted after time limit. Elapsed: " + elapsedMinutes + " minutes, Allowed: " + quiz.getDuration() + " minutes");
        } else {
            attempt.setExceededTimeLimit(false);
        }

        int totalScore = 0;

        for (AnswerRequest ansReq : request.answers()) {
            Question question = questionRepository.findById(ansReq.questionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Question", ansReq.questionId()));

            Answer answer = new Answer();
            answer.setAttempt(attempt);
            answer.setQuestion(question);

            if (ansReq.selectedOptionId() != null) {
                Option selectedOption = question.getOptions().stream()
                        .filter(o -> o.getId().equals(ansReq.selectedOptionId()))
                        .findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Option", ansReq.selectedOptionId()));

                answer.setSelectedOption(selectedOption);
                answer.setIsCorrect(selectedOption.getIsCorrect());
                if (selectedOption.getIsCorrect()) {
                    answer.setPointsEarned(question.getPoints());
                    totalScore += question.getPoints();
                }
            }

            if (ansReq.textAnswer() != null) {
                answer.setTextAnswer(ansReq.textAnswer());
                // For short answer questions, manual grading would be needed
                // For now, we'll just store the answer
            }

            attempt.getAnswers().add(answer);
            answerRepository.save(answer);
        }

        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setScore(totalScore);
        attempt.setStatus(QuizAttempt.AttemptStatus.EVALUATED);

        attempt = attemptRepository.save(attempt);
        return toAttemptResponse(attempt);
    }

    public List<AttemptResponse> getMyAttempts(String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", candidateEmail));

        return attemptRepository.findByUserId(candidate.getId()).stream()
                .map(this::toAttemptResponse)
                .collect(Collectors.toList());
    }

    public AttemptResponse getAttemptResult(Long attemptId, String candidateEmail) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("QuizAttempt", attemptId));

        if (!attempt.getUser().getEmail().equals(candidateEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        return toAttemptResponse(attempt);
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

    private QuizResponse toQuizResponseForCandidate(Quiz quiz) {
        // Don't send correct answers to candidates
        List<QuestionResponse> questions = quiz.getQuestions().stream()
                .map(q -> new QuestionResponse(
                        q.getId(),
                        q.getQuestionText(),
                        q.getType().name(),
                        q.getPoints(),
                        q.getOptions().stream()
                                .map(o -> new OptionResponse(o.getId(), o.getOptionText(), null))
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

    private AttemptResponse toAttemptResponse(QuizAttempt attempt) {
        return new AttemptResponse(
                attempt.getId(),
                attempt.getQuiz().getId(),
                attempt.getQuiz().getTitle(),
                attempt.getStartedAt(),
                attempt.getSubmittedAt(),
                attempt.getScore(),
                attempt.getTotalPoints(),
                attempt.getStatus().name(),
                attempt.getTimeTakenMinutes(),
                attempt.getExceededTimeLimit()
        );
    }
}

package com.quizforge.dto;

import java.time.LocalDateTime;
import java.util.List;

public record DetailedAttemptResponse(
    Long id,
    Long quizId,
    String quizTitle,
    LocalDateTime startedAt,
    LocalDateTime submittedAt,
    Integer score,
    Integer totalPoints,
    String status,
    Long timeTakenMinutes,
    Boolean exceededTimeLimit,
    QuizResponse quiz,
    List<CandidateAnswerResponse> candidateAnswers
) {}

package com.quizforge.dto;

import java.time.LocalDateTime;

public record AdminAttemptResponse(
    Long id,
    Long quizId,
    String quizTitle,
    String candidateName,
    String candidateEmail,
    LocalDateTime startedAt,
    LocalDateTime submittedAt,
    Integer score,
    Integer totalPoints,
    String status
) {}

package com.quizforge.dto;

import java.time.LocalDateTime;

public record AttemptResponse(
    Long id,
    Long quizId,
    String quizTitle,
    LocalDateTime startedAt,
    LocalDateTime submittedAt,
    Integer score,
    Integer totalPoints,
    String status,
    Long timeTakenMinutes,
    Boolean exceededTimeLimit
) {}

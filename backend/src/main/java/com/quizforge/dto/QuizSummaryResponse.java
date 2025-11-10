package com.quizforge.dto;

import java.time.LocalDateTime;

public record QuizSummaryResponse(
    Long id,
    String title,
    String description,
    Integer duration,
    Boolean isActive,
    String createdBy,
    LocalDateTime createdAt,
    Integer totalQuestions
) {}

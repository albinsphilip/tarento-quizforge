package com.quizforge.dto;

import java.time.LocalDateTime;
import java.util.List;

public record QuizResponse(
    Long id,
    String title,
    String description,
    Integer duration,
    Boolean isActive,
    String createdBy,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<QuestionResponse> questions
) {}

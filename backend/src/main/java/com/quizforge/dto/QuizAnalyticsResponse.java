package com.quizforge.dto;

public record QuizAnalyticsResponse(
    Long quizId,
    String quizTitle,
    Integer totalAttempts,
    Double averageScore,
    Integer highestScore,
    Integer lowestScore
) {}

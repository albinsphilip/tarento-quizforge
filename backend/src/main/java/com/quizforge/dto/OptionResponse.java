package com.quizforge.dto;

public record OptionResponse(
    Long id,
    String optionText,
    Boolean isCorrect // Only sent to admin, not to candidates during quiz
) {}

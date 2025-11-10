package com.quizforge.dto;

public record AnswerRequest(
    Long questionId,
    Long selectedOptionId,
    String textAnswer
) {}

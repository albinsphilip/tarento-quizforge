package com.quizforge.dto;

public record CandidateAnswerResponse(
    Long id,
    QuestionResponse question,
    OptionResponse selectedOption,
    String textAnswer,
    Boolean correct,
    Integer pointsEarned
) {}

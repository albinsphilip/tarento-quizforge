package com.quizforge.dto;

import java.util.List;

public record QuestionResponse(
    Long id,
    String questionText,
    String type,
    Integer points,
    List<OptionResponse> options
) {}

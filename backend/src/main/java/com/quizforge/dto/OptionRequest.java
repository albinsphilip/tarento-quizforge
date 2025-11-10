package com.quizforge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OptionRequest(
    @NotBlank(message = "Option text is required")
    String optionText,
    
    @NotNull(message = "isCorrect flag is required")
    Boolean isCorrect
) {}

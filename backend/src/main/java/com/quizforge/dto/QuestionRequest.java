package com.quizforge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record QuestionRequest(
    @NotBlank(message = "Question text is required")
    String questionText,
    
    @NotNull(message = "Question type is required")
    String type,
    
    Integer points,
    
    List<OptionRequest> options
) {}

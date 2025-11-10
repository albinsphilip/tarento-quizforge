package com.quizforge.dto;

import java.util.List;

public record SubmitQuizRequest(
    Long attemptId,
    List<AnswerRequest> answers
) {}

package com.quizforge.dto;

public record DeleteResponse(
    String message,
    Long deletedId
) {
}

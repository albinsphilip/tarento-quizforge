package com.quizforge.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private String error;

    // Success response with data
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data, LocalDateTime.now(), null);
    }

    // Success response with custom message and data
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now(), null);
    }

    // Success response with only message (no data)
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, LocalDateTime.now(), null);
    }

    // Error response with message
    public static <T> ApiResponse<T> error(String error) {
        return new ApiResponse<>(false, null, null, LocalDateTime.now(), error);
    }

    // Error response with custom message and error
    public static <T> ApiResponse<T> error(String message, String error) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now(), error);
    }
}

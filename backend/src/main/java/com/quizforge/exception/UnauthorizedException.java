package com.quizforge.exception;

/**
 * Exception thrown when user authentication fails
 * Example: Invalid credentials, expired token
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
}

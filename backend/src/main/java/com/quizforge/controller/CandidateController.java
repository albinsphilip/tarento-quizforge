package com.quizforge.controller;

import com.quizforge.dto.AttemptResponse;
import com.quizforge.dto.QuizResponse;
import com.quizforge.dto.QuizSummaryResponse;
import com.quizforge.dto.SubmitQuizRequest;
import com.quizforge.service.CandidateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate/quizzes")
@Tag(name = "Candidate - Quiz Taking", description = "CANDIDATE role: View quizzes, start quiz, submit answers, view results")
@SecurityRequirement(name = "bearerAuth")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping
    @Operation(summary = "Get available quizzes", description = "View all active quizzes available for taking")
    public ResponseEntity<List<QuizSummaryResponse>> getAvailableQuizzes() {
        return ResponseEntity.ok(candidateService.getAvailableQuizzes());
    }

    @PostMapping("/{quizId}/start")
    @Operation(summary = "Start a quiz", description = "Begin a new quiz attempt")
    public ResponseEntity<AttemptResponse> startQuiz(
            @PathVariable Long quizId,
            Authentication authentication) {
        String candidateEmail = authentication.getName();
        return ResponseEntity.ok(candidateService.startQuiz(quizId, candidateEmail));
    }

    @GetMapping("/{quizId}")
    @Operation(summary = "Get quiz questions", description = "Retrieve quiz questions for answering (correct answers hidden)")
    public ResponseEntity<QuizResponse> getQuizForAttempt(@PathVariable Long quizId) {
        return ResponseEntity.ok(candidateService.getQuizForAttempt(quizId));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit quiz answers", description = "Submit all answers and get evaluated results")
    public ResponseEntity<AttemptResponse> submitQuiz(
            @Valid @RequestBody SubmitQuizRequest request,
            Authentication authentication) {
        String candidateEmail = authentication.getName();
        return ResponseEntity.ok(candidateService.submitQuiz(request, candidateEmail));
    }

    @GetMapping("/my-attempts")
    @Operation(summary = "Get my quiz attempts", description = "View all your quiz attempts and scores")
    public ResponseEntity<List<AttemptResponse>> getMyAttempts(Authentication authentication) {
        String candidateEmail = authentication.getName();
        return ResponseEntity.ok(candidateService.getMyAttempts(candidateEmail));
    }

    @GetMapping("/attempts/{attemptId}")
    @Operation(summary = "Get attempt result", description = "View detailed results of a specific attempt")
    public ResponseEntity<AttemptResponse> getAttemptResult(
            @PathVariable Long attemptId,
            Authentication authentication) {
        String candidateEmail = authentication.getName();
        return ResponseEntity.ok(candidateService.getAttemptResult(attemptId, candidateEmail));
    }
}

package com.quizforge.controller;

import com.quizforge.dto.*;
import com.quizforge.dto.DetailedAttemptResponse;
import com.quizforge.dto.CandidateAnswerResponse;
import com.quizforge.service.AdminService;
import com.quizforge.service.CandidateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@Tag(name = "Quiz Management", description = "Unified quiz endpoints for both ADMIN and CANDIDATE roles")
@SecurityRequirement(name = "bearerAuth")
public class QuizController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CandidateService candidateService;

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
    }

    @GetMapping
    @Operation(summary = "Get quizzes", description = "ADMIN: Get all quizzes, CANDIDATE: Get active quizzes only")
    public ResponseEntity<ApiResponse<List<QuizSummaryResponse>>> getQuizzes(Authentication authentication) {
        List<QuizSummaryResponse> quizzes;
        if (isAdmin(authentication)) {
            quizzes = adminService.getAllQuizzes();
        } else {
            quizzes = candidateService.getAvailableQuizzes();
        }
        return ResponseEntity.ok(ApiResponse.success(quizzes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quiz by ID", description = "ADMIN: Get with correct answers, CANDIDATE: Get without correct answers")
    public ResponseEntity<ApiResponse<QuizResponse>> getQuizById(
            @PathVariable Long id,
            Authentication authentication) {
        QuizResponse quiz;
        if (isAdmin(authentication)) {
            quiz = adminService.getQuizById(id);
        } else {
            quiz = candidateService.getQuizForAttempt(id);
        }
        return ResponseEntity.ok(ApiResponse.success(quiz));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @Operation(summary = "Create new quiz", description = "ADMIN only: Create a new quiz with questions and options")
    public ResponseEntity<ApiResponse<QuizResponse>> createQuiz(
            @Valid @RequestBody QuizRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        QuizResponse response = adminService.createQuiz(request, email);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Quiz created successfully", response));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    @Operation(summary = "Update quiz", description = "ADMIN only: Update existing quiz with new data")
    public ResponseEntity<ApiResponse<QuizResponse>> updateQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizRequest request) {
        QuizResponse response = adminService.updateQuiz(id, request);
        return ResponseEntity.ok(ApiResponse.success("Quiz updated successfully", response));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete quiz", description = "ADMIN only: Permanently delete a quiz")
    public ResponseEntity<ApiResponse<DeleteResponse>> deleteQuiz(@PathVariable Long id) {
        DeleteResponse response = adminService.deleteQuiz(id);
        return ResponseEntity.ok(ApiResponse.success("Quiz deleted successfully", response));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/analytics")
    @Operation(summary = "Get quiz analytics", description = "ADMIN only: View statistics for a quiz")
    public ResponseEntity<ApiResponse<QuizAnalyticsResponse>> getQuizAnalytics(@PathVariable Long id) {
        QuizAnalyticsResponse analytics = adminService.getQuizAnalytics(id);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/editable")
    @Operation(summary = "Check if quiz is editable", description = "ADMIN only: Check if quiz structure can be modified (no attempts)")
    public ResponseEntity<ApiResponse<Boolean>> isQuizEditable(@PathVariable Long id) {
        boolean editable = adminService.isQuizEditable(id);
        return ResponseEntity.ok(ApiResponse.success(editable));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/deletable")
    @Operation(summary = "Check if quiz is deletable", description = "ADMIN only: Check if quiz can be permanently deleted (no attempts)")
    public ResponseEntity<ApiResponse<Boolean>> isQuizDeletable(@PathVariable Long id) {
        boolean deletable = adminService.isQuizDeletable(id);
        return ResponseEntity.ok(ApiResponse.success(deletable));
    }

    @PostMapping("/{quizId}/start")
    @Operation(summary = "Start a quiz", description = "CANDIDATE: Begin a new quiz attempt")
    public ResponseEntity<ApiResponse<AttemptResponse>> startQuiz(
            @PathVariable Long quizId,
            Authentication authentication) {
        String email = authentication.getName();
        AttemptResponse response = candidateService.startQuiz(quizId, email);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Quiz attempt started", response));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit quiz answers", description = "CANDIDATE: Submit all answers and get evaluated results")
    public ResponseEntity<ApiResponse<AttemptResponse>> submitQuiz(
            @Valid @RequestBody SubmitQuizRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        AttemptResponse response = candidateService.submitQuiz(request, email);
        return ResponseEntity.ok(ApiResponse.success("Quiz submitted successfully", response));
    }

    @GetMapping("/attempts")
    @Operation(summary = "Get quiz attempts", description = "ADMIN: Get all attempts, CANDIDATE: Get my attempts only")
    public ResponseEntity<ApiResponse<List<?>>> getAttempts(Authentication authentication) {
        if (isAdmin(authentication)) {
            List<com.quizforge.dto.AdminAttemptResponse> attempts = adminService.getAllAttempts();
            return ResponseEntity.ok(ApiResponse.success(attempts));
        } else {
            String email = authentication.getName();
            List<AttemptResponse> attempts = candidateService.getMyAttempts(email);
            return ResponseEntity.ok(ApiResponse.success(attempts));
        }
    }

    @GetMapping("/attempts/{attemptId}")
    @Operation(summary = "Get attempt result", description = "View detailed results of a specific attempt")
    public ResponseEntity<ApiResponse<DetailedAttemptResponse>> getAttemptResult(
            @PathVariable Long attemptId,
            Authentication authentication) {
        String email = authentication.getName();
        DetailedAttemptResponse response = candidateService.getAttemptResult(attemptId, email);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

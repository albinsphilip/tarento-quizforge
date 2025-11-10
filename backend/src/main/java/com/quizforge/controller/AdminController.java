package com.quizforge.controller;

import com.quizforge.dto.QuizAnalyticsResponse;
import com.quizforge.dto.QuizRequest;
import com.quizforge.dto.QuizResponse;
import com.quizforge.dto.QuizSummaryResponse;
import com.quizforge.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/quizzes")
@Tag(name = "Admin - Quiz Management", description = "ADMIN role: Create, edit, delete quizzes and view analytics")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    @Operation(summary = "Get all quizzes", description = "Retrieve list of all quizzes")
    public ResponseEntity<List<QuizSummaryResponse>> getAllQuizzes() {
        return ResponseEntity.ok(adminService.getAllQuizzes());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quiz by ID", description = "Retrieve detailed quiz information including questions and correct answers")
    public ResponseEntity<QuizResponse> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getQuizById(id));
    }

    @PostMapping
    @Operation(summary = "Create new quiz", description = "Create a new quiz with questions and options")
    public ResponseEntity<QuizResponse> createQuiz(
            @Valid @RequestBody QuizRequest request,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        QuizResponse response = adminService.createQuiz(request, adminEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update quiz", description = "Update existing quiz with new data")
    public ResponseEntity<QuizResponse> updateQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizRequest request) {
        return ResponseEntity.ok(adminService.updateQuiz(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete quiz", description = "Permanently delete a quiz")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        adminService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/analytics")
    @Operation(summary = "Get quiz analytics", description = "View statistics for a quiz including attempts, scores, etc.")
    public ResponseEntity<QuizAnalyticsResponse> getQuizAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getQuizAnalytics(id));
    }
}

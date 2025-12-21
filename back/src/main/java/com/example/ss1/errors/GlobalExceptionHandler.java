package com.example.ss1.errors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<String> handleUsuarioCreationException(ApiException ex) {
        return ResponseEntity
                .status(ex.getCode())
                .body(ex.getMessage());
    }

}
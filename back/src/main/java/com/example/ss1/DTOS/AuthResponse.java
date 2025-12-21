package com.example.ss1.DTOS;

public record AuthResponse(
    String accessToken,
    String tokenType,
    long expiresIn,
    UserDto user,
    String mensaje
) {}
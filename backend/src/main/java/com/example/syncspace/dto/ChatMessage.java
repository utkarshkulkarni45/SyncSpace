package com.example.syncspace.dto;

public record ChatMessage(
        String roomId,
        String userId,
        String username,
        String message,
        String color,
        Long timestamp
) {}


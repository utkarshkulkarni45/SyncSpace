package com.example.syncspace.dto;

public record CursorMessage(
        String roomId,
        String userId,
        String username,
        String color,
        int lineNumber,
        int column
) {}


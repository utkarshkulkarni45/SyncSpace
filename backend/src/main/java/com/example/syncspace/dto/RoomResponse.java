package com.example.syncspace.dto;

import java.time.LocalDateTime;

public record RoomResponse(
        String id,
        String name,
        String language,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}

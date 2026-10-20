package com.example.syncspace.dto;

public record TextEditMessage(
        String roomId,
        String userId,
        String username,
        String content,
        Long version,
        Long timestamp
) {}

package com.example.syncspace.dto;

public record UserPresenceMessage(
        String roomId,
        String userId,
        String username,
        String color,
        Type type // JOIN, LEAVE, PING
) {
    public enum Type {
        JOIN,
        LEAVE,
        PING
    }
}

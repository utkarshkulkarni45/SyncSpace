package com.example.syncspace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRoomRequest(
        @NotBlank(message = "Room name cannot be empty")
        @Size(max = 100, message = "Room name cannot exceed 100 characters")
        String name,

        String language,

        String initialContent
) {}


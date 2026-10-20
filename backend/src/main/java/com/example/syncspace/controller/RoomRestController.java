package com.example.syncspace.controller;

import com.example.syncspace.dto.CreateRoomRequest;
import com.example.syncspace.dto.RoomResponse;
import com.example.syncspace.model.DocumentSnapshot;
import com.example.syncspace.service.PresenceService;
import com.example.syncspace.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/rooms")
public class RoomRestController {

    private final RoomService roomService;
    private final PresenceService presenceService;

    public RoomRestController(RoomService roomService, PresenceService presenceService) {
        this.roomService = roomService;
        this.presenceService = presenceService;
    }

    /**
     * Health check endpoint used by Render and cloud load balancers.
     */
    @GetMapping
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "SyncSpace Backend"));
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        RoomResponse created = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponse> getRoom(@PathVariable String roomId) {
        return ResponseEntity.ok(roomService.getRoom(roomId));
    }

    @GetMapping("/{roomId}/users")
    public ResponseEntity<Set<Map<String, String>>> getActiveUsers(@PathVariable String roomId) {
        return ResponseEntity.ok(presenceService.getActiveUsers(roomId));
    }

    @PostMapping("/{roomId}/snapshots")
    public ResponseEntity<DocumentSnapshot> createSnapshot(
            @PathVariable String roomId,
            @RequestBody Map<String, String> payload
    ) {
        String content = payload.getOrDefault("content", "");
        String savedBy = payload.getOrDefault("savedBy", "Anonymous");
        DocumentSnapshot snapshot = roomService.saveSnapshot(roomId, content, savedBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(snapshot);
    }

    @GetMapping("/{roomId}/snapshots")
    public ResponseEntity<List<DocumentSnapshot>> getSnapshots(@PathVariable String roomId) {
        return ResponseEntity.ok(roomService.getSnapshots(roomId));
    }
}

package com.example.syncspace.service;

import com.example.syncspace.dto.CreateRoomRequest;
import com.example.syncspace.dto.RoomResponse;
import com.example.syncspace.model.DocumentSnapshot;
import com.example.syncspace.model.Room;
import com.example.syncspace.repository.DocumentSnapshotRepository;
import com.example.syncspace.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RoomService {

    private static final Logger log = LoggerFactory.getLogger(RoomService.class);

    private final RoomRepository roomRepository;
    private final DocumentSnapshotRepository snapshotRepository;

    public RoomService(RoomRepository roomRepository, DocumentSnapshotRepository snapshotRepository) {
        this.roomRepository = roomRepository;
        this.snapshotRepository = snapshotRepository;
    }

    @Transactional
    public RoomResponse createRoom(CreateRoomRequest request) {
        String roomId = UUID.randomUUID().toString().substring(0, 8);
        String language = request.language() != null && !request.language().isBlank() ? request.language() : "javascript";
        String initialContent = request.initialContent() != null ? request.initialContent() : getDefaultContent(language);

        Room room = new Room(roomId, request.name(), language, initialContent);
        Room saved = roomRepository.save(room);
        log.info("Created room with ID: {}", saved.getId());
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoom(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with ID: " + roomId));
        return toDto(room);
    }

    @Transactional
    public RoomResponse updateContent(String roomId, String content) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));
        room.setContent(content);
        Room updated = roomRepository.save(room);
        return toDto(updated);
    }

    @Transactional
    public DocumentSnapshot saveSnapshot(String roomId, String content, String savedBy) {
        DocumentSnapshot snapshot = new DocumentSnapshot(roomId, content, savedBy);
        return snapshotRepository.save(snapshot);
    }

    @Transactional(readOnly = true)
    public List<DocumentSnapshot> getSnapshots(String roomId) {
        return snapshotRepository.findByRoomIdOrderBySavedAtDesc(roomId);
    }

    private RoomResponse toDto(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getName(),
                room.getLanguage(),
                room.getContent(),
                room.getCreatedAt(),
                room.getUpdatedAt()
        );
    }

    private String getDefaultContent(String lang) {
        return switch (lang.toLowerCase()) {
            case "markdown" -> "# Welcome to SyncSpace 🚀\n\nReal-time collaborative markdown & code workspace.\n\n- ✨ Live cursor position\n- ⚡ Multi-user synchronization\n- 💬 Instant team chat\n";
            case "python" -> "# Welcome to SyncSpace Python Playground\ndef main():\n    print(\"Hello from SyncSpace!\")\n\nif __name__ == \"__main__\":\n    main()\n";
            case "java" -> "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello from SyncSpace!\");\n    }\n}\n";
            default -> "// Welcome to SyncSpace Collaborative Editor\nfunction greet(name) {\n    return `Hello, ${name}! Welcome to real-time coding.`;\n}\n\nconsole.log(greet('Developer'));\n";
        };
    }
}

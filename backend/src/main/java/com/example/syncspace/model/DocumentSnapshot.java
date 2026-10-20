package com.example.syncspace.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "document_snapshots")
public class DocumentSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String roomId;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 100)
    private String savedBy;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime savedAt;

    public DocumentSnapshot() {
    }

    public DocumentSnapshot(String roomId, String content, String savedBy) {
        this.roomId = roomId;
        this.content = content;
        this.savedBy = savedBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSavedBy() {
        return savedBy;
    }

    public void setSavedBy(String savedBy) {
        this.savedBy = savedBy;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }
}


package com.example.syncspace.repository;

import com.example.syncspace.model.DocumentSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentSnapshotRepository extends JpaRepository<DocumentSnapshot, Long> {
    List<DocumentSnapshot> findByRoomIdOrderBySavedAtDesc(String roomId);
}


package com.example.syncspace.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Manages active room presence and participants.
 * Automatically utilizes Redis if available, with graceful in-memory fallback.
 */
@Service
public class PresenceService {

    private static final Logger log = LoggerFactory.getLogger(PresenceService.class);

    private final StringRedisTemplate redisTemplate;

    // Resilient in-memory fallback store: roomId -> (userId -> username#color)
    private final Map<String, Map<String, String>> localRoomPresence = new ConcurrentHashMap<>();

    private static final String ROOM_USERS_PREFIX = "syncspace:room:";

    @Autowired
    public PresenceService(@Autowired(required = false) StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void userJoined(String roomId, String userId, String username, String color) {
        String userMeta = username + ":" + color;
        try {
            if (redisTemplate != null && redisTemplate.getConnectionFactory() != null) {
                redisTemplate.opsForHash().put(ROOM_USERS_PREFIX + roomId, userId, userMeta);
            }
        } catch (Exception e) {
            log.warn("Redis unavailable for presence userJoined, falling back to in-memory: {}", e.getMessage());
        }

        localRoomPresence.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>()).put(userId, userMeta);
        log.info("User {} ({}) joined room {}", username, userId, roomId);
    }

    public void userLeft(String roomId, String userId) {
        try {
            if (redisTemplate != null && redisTemplate.getConnectionFactory() != null) {
                redisTemplate.opsForHash().delete(ROOM_USERS_PREFIX + roomId, userId);
            }
        } catch (Exception e) {
            log.warn("Redis unavailable for presence userLeft: {}", e.getMessage());
        }

        Map<String, String> members = localRoomPresence.get(roomId);
        if (members != null) {
            members.remove(userId);
            if (members.isEmpty()) {
                localRoomPresence.remove(roomId);
            }
        }
        log.info("User {} left room {}", userId, roomId);
    }

    public Set<Map<String, String>> getActiveUsers(String roomId) {
        try {
            if (redisTemplate != null && redisTemplate.getConnectionFactory() != null) {
                Map<Object, Object> entries = redisTemplate.opsForHash().entries(ROOM_USERS_PREFIX + roomId);
                if (entries != null && !entries.isEmpty()) {
                    return entries.entrySet().stream().map(e -> {
                        String uid = e.getKey().toString();
                        String meta = e.getValue().toString();
                        String[] parts = meta.split(":", 2);
                        String name = parts.length > 0 ? parts[0] : uid;
                        String color = parts.length > 1 ? parts[1] : "#3b82f6";
                        return Map.of("userId", uid, "username", name, "color", color);
                    }).collect(Collectors.toSet());
                }
            }
        } catch (Exception e) {
            log.warn("Redis query failed for active users, reading in-memory store: {}", e.getMessage());
        }

        Map<String, String> local = localRoomPresence.get(roomId);
        if (local == null || local.isEmpty()) {
            return Collections.emptySet();
        }

        return local.entrySet().stream().map(e -> {
            String uid = e.getKey();
            String meta = e.getValue();
            String[] parts = meta.split(":", 2);
            String name = parts.length > 0 ? parts[0] : uid;
            String color = parts.length > 1 ? parts[1] : "#3b82f6";
            return Map.of("userId", uid, "username", name, "color", color);
        }).collect(Collectors.toSet());
    }
}


package com.example.syncspace.websocket;

import com.example.syncspace.dto.UserPresenceMessage;
import com.example.syncspace.service.PresenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Component
public class WebSocketEventListener {

    private static final Logger log = LoggerFactory.getLogger(WebSocketEventListener.class);

    private final PresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(PresenceService presenceService, SimpMessagingTemplate messagingTemplate) {
        this.presenceService = presenceService;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();

        if (sessionAttributes != null) {
            String roomId = (String) sessionAttributes.get("roomId");
            String userId = (String) sessionAttributes.get("userId");
            String username = (String) sessionAttributes.get("username");

            if (roomId != null && userId != null) {
                log.info("User disconnected: {} from room: {}", username, roomId);
                presenceService.userLeft(roomId, userId);

                // Notify room subscribers about the disconnect
                UserPresenceMessage leaveMessage = new UserPresenceMessage(
                        roomId,
                        userId,
                        username,
                        "#94a3b8",
                        UserPresenceMessage.Type.LEAVE
                );
                messagingTemplate.convertAndSend("/topic/room/" + roomId + "/presence", leaveMessage);
                messagingTemplate.convertAndSend("/topic/room/" + roomId + "/users", presenceService.getActiveUsers(roomId));
            }
        }
    }
}

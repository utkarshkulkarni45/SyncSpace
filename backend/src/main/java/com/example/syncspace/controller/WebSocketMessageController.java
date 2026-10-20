package com.example.syncspace.controller;

import com.example.syncspace.dto.ChatMessage;
import com.example.syncspace.dto.CursorMessage;
import com.example.syncspace.dto.TextEditMessage;
import com.example.syncspace.dto.UserPresenceMessage;
import com.example.syncspace.service.PresenceService;
import com.example.syncspace.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Objects;

@Controller
public class WebSocketMessageController {

    private static final Logger log = LoggerFactory.getLogger(WebSocketMessageController.class);

    private final RoomService roomService;
    private final PresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketMessageController(
            RoomService roomService,
            PresenceService presenceService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.roomService = roomService;
        this.presenceService = presenceService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Real-time collaborative document editing broadcast.
     */
    @MessageMapping("/room/{roomId}/edit")
    @SendTo("/topic/room/{roomId}/edit")
    public TextEditMessage handleDocumentEdit(
            @DestinationVariable String roomId,
            @Payload TextEditMessage editMessage
    ) {
        log.debug("Received edit for room {} from user {}", roomId, editMessage.userId());
        if (editMessage.content() != null) {
            roomService.updateContent(roomId, editMessage.content());
        }
        return editMessage;
    }

    /**
     * Real-time cursor coordinates and selection broadcast.
     */
    @MessageMapping("/room/{roomId}/cursor")
    @SendTo("/topic/room/{roomId}/cursor")
    public CursorMessage handleCursorMovement(
            @DestinationVariable String roomId,
            @Payload CursorMessage cursorMessage
    ) {
        return cursorMessage;
    }

    /**
     * User presence notifications (Join, Leave, Heartbeat)
     */
    @MessageMapping("/room/{roomId}/presence")
    public void handlePresence(
            @DestinationVariable String roomId,
            @Payload UserPresenceMessage presence,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        if (headerAccessor.getSessionAttributes() != null) {
            headerAccessor.getSessionAttributes().put("roomId", roomId);
            headerAccessor.getSessionAttributes().put("userId", presence.userId());
            headerAccessor.getSessionAttributes().put("username", presence.username());
        }

        if (presence.type() == UserPresenceMessage.Type.JOIN) {
            presenceService.userJoined(roomId, presence.userId(), presence.username(), presence.color());
        } else if (presence.type() == UserPresenceMessage.Type.LEAVE) {
            presenceService.userLeft(roomId, presence.userId());
        }

        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/presence", presence);
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/users", presenceService.getActiveUsers(roomId));
    }

    /**
     * Real-time room chat.
     */
    @MessageMapping("/room/{roomId}/chat")
    @SendTo("/topic/room/{roomId}/chat")
    public ChatMessage handleChatMessage(
            @DestinationVariable String roomId,
            @Payload ChatMessage chatMessage
    ) {
        return chatMessage;
    }
}


package com.example.syncspace.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Simple in-memory STOMP broker for /topic and /queue destinations
        config.enableSimpleBroker("/topic", "/queue");
        // Application destination prefix for client-to-server messages
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register /ws endpoint, allowing Cross-Origin requests and SockJS fallback
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Also register pure WebSocket endpoint without SockJS
        registry.addEndpoint("/ws-raw")
                .setAllowedOriginPatterns("*");
    }
}

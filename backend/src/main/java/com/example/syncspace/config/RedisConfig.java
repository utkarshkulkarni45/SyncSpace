package com.example.syncspace.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

@Configuration
public class RedisConfig {

    private static final Logger log = LoggerFactory.getLogger(RedisConfig.class);

    @Value("${SPRING_REDIS_HOST:}")
    private String redisHost;

    @Value("${SPRING_REDIS_PORT:6379}")
    private int redisPort;

    @Value("${SPRING_REDIS_PASSWORD:}")
    private String redisPassword;

    @Bean
    public StringRedisTemplate stringRedisTemplate() {
        if (redisHost == null || redisHost.trim().isEmpty() || "localhost".equalsIgnoreCase(redisHost.trim())) {
            log.info("Redis host not specified or running without dedicated remote cluster. PresenceService will use resilient concurrent in-memory store.");
            return null;
        }

        try {
            RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(redisHost.trim(), redisPort);
            if (redisPassword != null && !redisPassword.isBlank()) {
                config.setPassword(redisPassword.trim());
            }
            LettuceConnectionFactory connectionFactory = new LettuceConnectionFactory(config);
            connectionFactory.afterPropertiesSet();
            log.info("Configured remote Redis Lettuce connection factory for {}:{}", redisHost, redisPort);
            return new StringRedisTemplate(connectionFactory);
        } catch (Exception e) {
            log.warn("Could not initialize Redis connection factory: {}. Falling back to in-memory store.", e.getMessage());
            return null;
        }
    }
}

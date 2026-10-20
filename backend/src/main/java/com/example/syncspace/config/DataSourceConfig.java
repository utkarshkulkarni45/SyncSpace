package com.example.syncspace.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${SPRING_DATASOURCE_URL:${DATABASE_URL:}}")
    private String databaseUrl;

    @Value("${SPRING_DATASOURCE_USERNAME:${DATABASE_USERNAME:}}")
    private String username;

    @Value("${SPRING_DATASOURCE_PASSWORD:${DATABASE_PASSWORD:}}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        if (databaseUrl != null && !databaseUrl.isBlank()) {
            String rawUrl = databaseUrl.trim();
            log.info("Configuring datasource with URL scheme: {}", rawUrl.contains("://") ? rawUrl.substring(0, rawUrl.indexOf("://")) : "jdbc");

            // Handle standard Render / Railway / Heroku postgres:// or postgresql:// URLs
            if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
                try {
                    // Normalize protocol to postgresql:// for URI parser
                    String uriString = rawUrl.replaceFirst("^postgres://", "postgresql://");
                    URI uri = new URI(uriString);

                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath(); // e.g. /syncspacedb
                    String dbName = (path != null && path.length() > 1) ? path.substring(1) : "syncspacedb";

                    // Extract credentials from user info if not separately provided
                    if ((username == null || username.isBlank()) && uri.getUserInfo() != null) {
                        String[] userInfo = uri.getUserInfo().split(":", 2);
                        config.setUsername(userInfo[0]);
                        if (userInfo.length > 1) {
                            config.setPassword(userInfo[1]);
                        }
                    } else {
                        config.setUsername(username);
                        config.setPassword(password);
                    }

                    String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName);
                    config.setJdbcUrl(jdbcUrl);
                    config.setDriverClassName("org.postgresql.Driver");
                    log.info("Constructed PostgreSQL JDBC URL: jdbc:postgresql://{}:{}/{}", host, port, dbName);
                } catch (Exception e) {
                    log.error("Failed to parse postgres URL {}, falling back to raw JDBC prepend", rawUrl, e);
                    config.setJdbcUrl("jdbc:" + rawUrl);
                    config.setUsername(username);
                    config.setPassword(password);
                }
            } else if (rawUrl.startsWith("jdbc:")) {
                config.setJdbcUrl(rawUrl);
                config.setUsername(username);
                config.setPassword(password);
            } else {
                config.setJdbcUrl("jdbc:" + rawUrl);
                config.setUsername(username);
                config.setPassword(password);
            }
        } else {
            // Default local fallback: in-memory H2 database
            log.info("No cloud database URL detected, initializing embedded H2 database");
            config.setJdbcUrl("jdbc:h2:mem:syncspacedb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE");
            config.setUsername("sa");
            config.setPassword("");
            config.setDriverClassName("org.h2.Driver");
        }

        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000);
        return new HikariDataSource(config);
    }
}


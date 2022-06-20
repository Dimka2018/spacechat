package com.dimka.spacechat.config;

import com.dimka.spacechat.handler.WebSocketHandler;
import com.dimka.spacechat.interceptor.UserHandshakeInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@EnableWebSocket
@RequiredArgsConstructor
@Configuration
public class WebsocketConfig implements WebSocketConfigurer {

    private final UserHandshakeInterceptor userHandshakeInterceptor;
    private final WebSocketHandler handler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/api/chat")
                .setAllowedOrigins("*")
                .addInterceptors(userHandshakeInterceptor);
    }
}

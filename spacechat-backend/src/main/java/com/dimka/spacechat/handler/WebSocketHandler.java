package com.dimka.spacechat.handler;

import com.dimka.spacechat.dto.Request;
import com.dimka.spacechat.entity.User;
import com.dimka.spacechat.entity.UserSession;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final Map<String, UserSession> sessions = new ConcurrentHashMap<>();
    private final List<MessageHandler> handlerList;

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @SneakyThrows
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        Request request = mapper.readValue(message.getPayload(), Request.class);
        UserSession userSession = sessions.get(session.getId());
        sessions.values()
                .stream()
                .filter(s -> s.getUser().getId().equals(request.getTo()))
                .filter(s -> s.getWebSocketSession().isOpen())
                .findFirst()
                .ifPresent(targetUserSession -> handlerList.stream()
                        .filter(handler -> handler.canHandle(request.getType()))
                        .findFirst()
                        .ifPresent(handler -> handler.handle(message.getPayload(), userSession, targetUserSession)));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        User user = (User) session.getAttributes().get("user");
        sessions.put(session.getId(), new UserSession()
                .setWebSocketSession(session)
                .setUser(user));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());
    }

}

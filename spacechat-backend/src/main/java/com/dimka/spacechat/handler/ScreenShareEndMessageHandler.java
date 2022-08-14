package com.dimka.spacechat.handler;

import com.dimka.spacechat.dto.*;
import com.dimka.spacechat.entity.UserSession;
import com.dimka.spacechat.holder.CallHolder;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Component
@RequiredArgsConstructor
public class ScreenShareEndMessageHandler implements MessageHandler{

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @Override
    public boolean canHandle(Type messageType) {
        return messageType == Type.SCREEN_SHARE_END;
    }

    @SneakyThrows
    @Override
    public void handle(String data, UserSession senderSession, UserSession receiverSession) {
        ScreenShareEndMessageRequest request = mapper.readValue(data, ScreenShareEndMessageRequest.class);
        ScreenShareEndMessageResponse response = new ScreenShareEndMessageResponse();
        String responseJson = mapper.writeValueAsString(response);
        CallHolder.getCallParticipants(request.getCallId()).stream()
                .filter(session -> !session.getUser().getId().equals(senderSession.getUser().getId()))
                .forEach(session -> sendMessage(responseJson, session.getWebSocketSession()));
    }

    @SneakyThrows
    private void sendMessage(String data, WebSocketSession session) {
        session.sendMessage(new TextMessage(data));
    }
}

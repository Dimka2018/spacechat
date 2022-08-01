package com.dimka.spacechat.handler;

import com.dimka.spacechat.dto.CallEndMessageRequest;
import com.dimka.spacechat.dto.CallEndMessageResponse;
import com.dimka.spacechat.dto.CallStartMessageRequest;
import com.dimka.spacechat.dto.Type;
import com.dimka.spacechat.entity.UserSession;
import com.dimka.spacechat.holder.CallHolder;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Collection;

@RequiredArgsConstructor
@Component
public class CallEndMessageHandler implements MessageHandler {

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @Override
    public boolean canHandle(Type messageType) {
        return messageType == Type.CALL_END;
    }

    @SneakyThrows
    @Override
    public void handle(String data, UserSession senderSession, UserSession receiverSession) {
        CallEndMessageRequest request = mapper.readValue(data, CallEndMessageRequest.class);
        Collection<UserSession> participants = CallHolder.getCallParticipants(request.getCallId());
        CallHolder.endCall(request.getCallId(), senderSession.getUser().getId());
        CallEndMessageResponse response = new CallEndMessageResponse()
                .setFromId(request.getCallId());
        String responseJson = mapper.writeValueAsString(response);
        participants.stream()
                .filter(session -> !session.getUser().getId().equals(senderSession.getUser().getId()))
                .forEach(session -> sendMessage(responseJson, session.getWebSocketSession()));
    }

    @SneakyThrows
    private void sendMessage(String data, WebSocketSession session) {
        session.sendMessage(new TextMessage(data));
    }
}

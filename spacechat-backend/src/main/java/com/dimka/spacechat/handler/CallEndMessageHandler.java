package com.dimka.spacechat.handler;

import com.dimka.spacechat.dto.MessageResponse;
import com.dimka.spacechat.dto.Type;
import com.dimka.spacechat.entity.UserSession;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;

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
        MessageResponse response = new MessageResponse()
                .setType(Type.CALL_END)
                .setDirection("input")
                .setFromId(senderSession.getUser().getId());
        String responseJson = mapper.writeValueAsString(response);
        receiverSession.getWebSocketSession().sendMessage(new TextMessage(responseJson));
    }
}

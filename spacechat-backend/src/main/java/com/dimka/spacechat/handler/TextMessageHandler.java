package com.dimka.spacechat.handler;

import com.dimka.spacechat.dto.TextMessageRequest;
import com.dimka.spacechat.dto.TextMessageResponse;
import com.dimka.spacechat.dto.Type;
import com.dimka.spacechat.entity.UserSession;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TextMessageHandler implements MessageHandler {

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @Override
    public boolean canHandle(Type messageType) {
        return messageType == Type.TEXT;
    }

    @SneakyThrows
    @Override
    public void handle(String data, UserSession senderSession, UserSession receiverSession) {
        TextMessageRequest message = mapper.readValue(data, TextMessageRequest.class);
        TextMessageResponse response = new TextMessageResponse()
                .setFromId(senderSession.getUser().getId())
                .setFromName(senderSession.getUser().getLogin())
                .setText(message.getText());
        String responseJson = mapper.writeValueAsString(response);
        receiverSession.getWebSocketSession().sendMessage(new org.springframework.web.socket.TextMessage(responseJson));
    }
}

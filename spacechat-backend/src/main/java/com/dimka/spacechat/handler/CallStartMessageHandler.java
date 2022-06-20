package com.dimka.spacechat.handler;

import com.dimka.spacechat.dto.CallStartMessageRequest;
import com.dimka.spacechat.dto.CallStartMessageResponse;
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
public class CallStartMessageHandler implements MessageHandler{

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @Override
    public boolean canHandle(Type messageType) {
        return messageType == Type.CALL_START;
    }

    @SneakyThrows
    @Override
    public void handle(String data, UserSession senderSession, UserSession receiverSession) {
        CallStartMessageRequest request = mapper.readValue(data, CallStartMessageRequest.class);
        CallStartMessageResponse response = new CallStartMessageResponse()
                .setOffer(request.getOffer())
                .setFromId(senderSession.getUser().getId())
                .setFromName(senderSession.getUser().getLogin());
        String responseJson = mapper.writeValueAsString(response);
        receiverSession.getWebSocketSession().sendMessage(new TextMessage(responseJson));
    }
}

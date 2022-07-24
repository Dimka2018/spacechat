package com.dimka.spacechat.handler;

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
        CallStartMessageRequest request = mapper.readValue(data, CallStartMessageRequest.class);
        CallHolder.endCall(request.getCallId(), senderSession.getUser().getId());
        CallEndMessageResponse response = new CallEndMessageResponse()
                .setFromId(request.getCallId());
        String responseJson = mapper.writeValueAsString(response);
        receiverSession.getWebSocketSession().sendMessage(new TextMessage(responseJson));
    }
}

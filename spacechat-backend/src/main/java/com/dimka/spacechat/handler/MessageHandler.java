package com.dimka.spacechat.handler;

import com.dimka.spacechat.dto.Type;
import com.dimka.spacechat.entity.UserSession;

import java.util.Collection;

public interface MessageHandler {

    boolean canHandle(Type messageType);

    void handle(String data, UserSession senderSession, UserSession receiverSession);
}

package com.dimka.spacechat.entity;

import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.web.socket.WebSocketSession;

@Accessors(chain = true)
@Data
public class UserSession {

    private WebSocketSession webSocketSession;
    private User user;
}

package com.dimka.spacechat.dto;

import lombok.Data;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Data
public class MessageResponse {

    private Type type;
    private String direction;
    private Long fromId;
    private String fromName;
    private String text;
}

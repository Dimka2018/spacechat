package com.dimka.spacechat.dto;

import lombok.Data;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Data
public class TextMessageResponse {

    private Type type = Type.TEXT;
    private String text;
    private Long fromId;
    private String fromName;
}

package com.dimka.spacechat.dto;

import lombok.Data;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Data
public class MessageRequest {

    private Type type;
    private Long to;

}

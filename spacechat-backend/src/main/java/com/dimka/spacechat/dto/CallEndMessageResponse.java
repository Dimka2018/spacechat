package com.dimka.spacechat.dto;

import lombok.Data;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Data
public class CallEndMessageResponse {

    private Type type = Type.CALL_END;
    private String fromId;
}

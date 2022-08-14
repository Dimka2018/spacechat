package com.dimka.spacechat.dto;

import lombok.Data;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Data
public class ScreenShareStartMessageResponse {


    private Type type = Type.SCREEN_SHARE_START;
    private String screenOwnerName;
    private Long screenOwnerId;
}

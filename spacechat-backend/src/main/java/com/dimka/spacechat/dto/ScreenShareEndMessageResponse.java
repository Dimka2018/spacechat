package com.dimka.spacechat.dto;

import lombok.Data;

@Data
public class ScreenShareEndMessageResponse {

    private Type type = Type.SCREEN_SHARE_END;
}

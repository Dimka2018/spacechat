package com.dimka.spacechat.entity;

import lombok.Data;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Data
public class WebRtcOffer {

    private String sdp;
    private String type;
}

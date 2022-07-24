package com.dimka.spacechat.dto;

import com.dimka.spacechat.entity.WebRtcOffer;
import lombok.Data;

@Data
public class CallStartMessageRequest {

    private Long toId;
    private String callId;
    private WebRtcOffer offer;
}

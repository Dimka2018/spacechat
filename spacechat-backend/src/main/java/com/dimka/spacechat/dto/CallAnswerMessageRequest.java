package com.dimka.spacechat.dto;

import com.dimka.spacechat.entity.WebRtcOffer;
import lombok.Data;

@Data
public class CallAnswerMessageRequest {

    private String callId;
    private WebRtcOffer answer;
}

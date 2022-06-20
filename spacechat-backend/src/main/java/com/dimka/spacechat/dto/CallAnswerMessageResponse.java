package com.dimka.spacechat.dto;

import com.dimka.spacechat.entity.WebRtcOffer;
import lombok.Data;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Data
public class CallAnswerMessageResponse {

    private Type type = Type.CALL_ANSWER;
    private WebRtcOffer answer;
}

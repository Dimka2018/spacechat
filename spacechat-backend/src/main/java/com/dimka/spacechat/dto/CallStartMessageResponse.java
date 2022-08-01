package com.dimka.spacechat.dto;

import com.dimka.spacechat.entity.WebRtcOffer;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Accessors(chain = true)
@Data
public class CallStartMessageResponse {

    private Type type = Type.CALL_START;
    private WebRtcOffer offer;
    private Long fromId;
    private String fromName;
    private String callId;
    private List<String> participantNames;
    private String callName;
}

package com.dimka.spacechat.holder;

import lombok.experimental.UtilityClass;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@UtilityClass
public class CallHolder {

    private final Map<String, List<Long>> activeCalls = new ConcurrentHashMap<>();

    public static void endCall(String chatId, Long participantId) {
        List<Long> participants = activeCalls.get(chatId);
        if (participants.contains(participantId)) {
            activeCalls.remove(chatId);
        }
    }

    public static void startCall(String chatId, Long... participants) {
        activeCalls.putIfAbsent(chatId, List.of(participants));
    }
}

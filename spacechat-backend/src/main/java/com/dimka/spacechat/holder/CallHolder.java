package com.dimka.spacechat.holder;

import com.dimka.spacechat.entity.Call;
import com.dimka.spacechat.entity.UserSession;
import lombok.experimental.UtilityClass;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@UtilityClass
public class CallHolder {

    private final Map<String, Call> activeCalls = new ConcurrentHashMap<>();

    public static void endCall(String chatId, Long participantId) {
        Call call = activeCalls.get(chatId);
        call.getParticipants().remove(participantId);
        if (call.getParticipants().size() <= 1) {
            activeCalls.remove(chatId);
        }
    }

    public static void startCall(String callId, UserSession... participants) {
        Call call = new Call()
                .setId(callId);
        Arrays.stream(participants)
                .map(participant -> new AbstractMap.SimpleEntry<>(participant.getUser().getId(), participant))
                .forEach(entry -> call.getParticipants().put(entry.getKey(), entry.getValue()));
        activeCalls.put(callId, call);
    }

    public static void addParticipant(String chatId, UserSession participant) {
        activeCalls.get(chatId).getParticipants().put(participant.getUser().getId(), participant);
    }

    public static Collection<UserSession> getCallParticipants(String callId) {
        return activeCalls.get(callId).getParticipants().values();
    }
}

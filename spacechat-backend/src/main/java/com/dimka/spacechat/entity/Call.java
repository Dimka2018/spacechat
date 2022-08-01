package com.dimka.spacechat.entity;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.HashMap;
import java.util.Map;

@Accessors(chain = true)
@Data
public class Call {

    private String id;
    private String name;
    private Map<Long, UserSession> participants = new HashMap<>();
}

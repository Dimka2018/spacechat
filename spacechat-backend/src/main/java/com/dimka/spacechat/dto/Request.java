package com.dimka.spacechat.dto;

import lombok.Data;

@Data
public class Request {

    private Type type;
    private Long toId;
}

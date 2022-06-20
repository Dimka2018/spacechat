package com.dimka.spacechat.dto;

import lombok.Data;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Data
public class Response {

    private boolean success;
    private String message;
}

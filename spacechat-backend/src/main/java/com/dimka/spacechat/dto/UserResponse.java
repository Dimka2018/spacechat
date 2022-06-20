package com.dimka.spacechat.dto;

import lombok.Data;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Data
public class UserResponse {

    private Long id;
    private String login;
}

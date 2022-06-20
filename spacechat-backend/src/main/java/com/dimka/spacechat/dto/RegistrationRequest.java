package com.dimka.spacechat.dto;

import lombok.Data;

@Data
public class RegistrationRequest {

    private String login;
    private String password;
    private String confirm;
}

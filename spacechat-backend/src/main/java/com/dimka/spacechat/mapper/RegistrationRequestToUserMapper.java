package com.dimka.spacechat.mapper;

import com.dimka.spacechat.dto.RegistrationRequest;
import com.dimka.spacechat.entity.User;
import org.springframework.stereotype.Component;

@Component
public class RegistrationRequestToUserMapper {

    public User convert(RegistrationRequest request) {
        return new User()
                .setLogin(request.getLogin())
                .setPassword(request.getPassword());
    }
}

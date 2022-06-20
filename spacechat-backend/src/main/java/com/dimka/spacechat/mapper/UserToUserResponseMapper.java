package com.dimka.spacechat.mapper;

import com.dimka.spacechat.dto.UserResponse;
import com.dimka.spacechat.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserToUserResponseMapper {

    public UserResponse convert(User user) {
        return new UserResponse()
                .setId(user.getId())
                .setLogin(user.getLogin());
    }
}

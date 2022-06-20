package com.dimka.spacechat.service.api;

import com.dimka.spacechat.dto.RegistrationRequest;
import com.dimka.spacechat.dto.Response;
import com.dimka.spacechat.dto.UserResponse;
import com.dimka.spacechat.entity.User;
import com.dimka.spacechat.mapper.RegistrationRequestToUserMapper;
import com.dimka.spacechat.mapper.UserToUserResponseMapper;
import com.dimka.spacechat.service.UserService;
import com.dimka.spacechat.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserApiService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    private final RegistrationRequestToUserMapper createUserRequestToUserMapper;
    private final UserToUserResponseMapper userToUserResponseMapper;

    public List<UserResponse> findUsers(String name) {
        User user = SecurityUtils.getUserPrincipal().getUser();
        return userService.findByNamePrefix(name).stream()
                .filter(u -> !u.getLogin().equals(user.getLogin()))
                .map(userToUserResponseMapper::convert)
                .collect(Collectors.toList());
    }

    public Response createUser(RegistrationRequest request) {
        if (!request.getPassword().equals(request.getConfirm())) {
            throw new RuntimeException("Invalid confirmation");
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(encodedPassword);
        User user = createUserRequestToUserMapper.convert(request);
        Response response = new Response()
                .setSuccess(true);
        try {
            userService.save(user);
        } catch (Exception e) {
            log.info("Can't create user {}", user, e);
            response.setSuccess(false);
            response.setMessage("User already exists");
        }
        return response;
    }
}
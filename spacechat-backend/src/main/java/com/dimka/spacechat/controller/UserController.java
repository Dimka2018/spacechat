package com.dimka.spacechat.controller;

import com.dimka.spacechat.dto.RegistrationRequest;
import com.dimka.spacechat.dto.Response;
import com.dimka.spacechat.dto.UserResponse;
import com.dimka.spacechat.entity.User;
import com.dimka.spacechat.service.api.UserApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserApiService userApiService;

    @PostMapping("/api/user")
    public Response registerUser(@RequestBody RegistrationRequest user) {
        return userApiService.createUser(user);
    }

    @GetMapping("/api/users")
    public List<UserResponse> findUsers(@RequestParam String name) {
        return userApiService.findUsers(name);
    }

    @GetMapping("/api/user")
    public User getUser() {
        return userApiService.getCurrentUser();
    }
}

package com.dimka.spacechat.service;

import com.dimka.spacechat.entity.User;
import com.dimka.spacechat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    public void save(User user) {
        userRepository.save(user);
    }

    public List<User> findByNamePrefix(String name) {
        return userRepository.findAllByLoginContains(name);
    }
}
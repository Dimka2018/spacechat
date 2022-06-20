package com.dimka.spacechat.repository;

import com.dimka.spacechat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByLoginContains(String login);

    Optional<User> findByLogin(String login);
}

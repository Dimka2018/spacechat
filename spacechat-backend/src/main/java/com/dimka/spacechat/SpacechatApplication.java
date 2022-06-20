package com.dimka.spacechat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {
		SecurityAutoConfiguration.class})
public class SpacechatApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpacechatApplication.class, args);
	}

}

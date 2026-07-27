package com.reggs.afrilumina;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AfriluminaApplication {

    public static void main(String[] args) {
        SpringApplication.run(AfriluminaApplication.class, args);
    }
}

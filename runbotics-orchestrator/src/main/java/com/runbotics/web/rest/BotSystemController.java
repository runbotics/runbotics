package com.runbotics.web.rest;

import com.runbotics.domain.BotSystem;
import com.runbotics.repository.BotSystemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bot-systems")
public class BotSystemController {

    private final Logger log = LoggerFactory.getLogger(BotSystemController.class);
    private final BotSystemRepository botSystemRepository;

    public BotSystemController(BotSystemRepository botSystemRepository) {
        this.botSystemRepository = botSystemRepository;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<BotSystem> getAll() {
        log.info("=> Getting all bot systems");
        var botSystems = botSystemRepository.findAll();
        log.info("<= Success: getting all bot systems");
        return botSystems;
    }
}

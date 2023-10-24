package com.runbotics.web.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller to check if orchestrator is still running.
 */
@RestController
@RequestMapping("/api")
public class HealthcheckResource {
    @GetMapping("/healthcheck")
    public String healthcheck() {
        return "Orchestrator is running";
    }
}

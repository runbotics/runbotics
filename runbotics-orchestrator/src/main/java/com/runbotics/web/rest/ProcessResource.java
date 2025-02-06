package com.runbotics.web.rest;

import com.runbotics.repository.ProcessRepository;
import com.runbotics.service.ProcessQueryService;
import com.runbotics.service.UserService;
import com.runbotics.service.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing {@link com.runbotics.domain.Process}.
 */
@RestController
@RequestMapping("/api")
public class ProcessResource {

    private static final String ENTITY_NAME = "process";
    private final Logger log = LoggerFactory.getLogger(ProcessResource.class);
    private final ProcessRepository processRepository;
    private final ProcessQueryService processQueryService;
    private final UserService userService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public ProcessResource(
        ProcessRepository processRepository,
        ProcessQueryService processQueryService,
        UserService userService
    ) {
        this.processRepository = processRepository;
        this.processQueryService = processQueryService;
        this.userService = userService;
    }

}

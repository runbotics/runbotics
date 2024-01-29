package com.runbotics.web.rest;

import com.runbotics.domain.BotSystem;
import com.runbotics.domain.ProcessOutput;
import com.runbotics.repository.ProcessOutputRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProcessOutputResource {

    private final Logger log = LoggerFactory.getLogger(BotSystemController.class);

    private final ProcessOutputRepository processOutputRepository;

    public ProcessOutputResource(ProcessOutputRepository processOutputRepository) {
        this.processOutputRepository = processOutputRepository;
    }

    @GetMapping("/process-outputs")
    public List<ProcessOutput> getAll() {
        log.info("=> Getting all process output types");
        List<ProcessOutput> processOutputs = processOutputRepository.findAll();
        log.info("<= Success: getting all process output types");
        return processOutputs;
    }
}

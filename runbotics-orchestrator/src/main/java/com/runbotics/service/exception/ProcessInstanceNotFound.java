package com.runbotics.service.exception;

import java.util.UUID;

public class ProcessInstanceNotFound extends RuntimeException {

    public ProcessInstanceNotFound(String message) {
        super(message);
    }

    public ProcessInstanceNotFound(UUID processInstanceId) {
        super("Process instance " + processInstanceId + " does not exist");
    }
}

package com.runbotics.service.exception;

import com.runbotics.web.rest.errors.ErrorConstants;
import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class ProcessNotFoundException extends AbstractThrowableProblem {
    private static final long serialVersionUID = 1L;

    public ProcessNotFoundException() {
        super(ErrorConstants.PROCESS_NOT_FOUND_TYPE, "Process not found", Status.NOT_FOUND);
    }

    public ProcessNotFoundException(Long processId) {
        super(ErrorConstants.PROCESS_NOT_FOUND_TYPE, "Process " + processId + " not found", Status.NOT_FOUND);
    }
}

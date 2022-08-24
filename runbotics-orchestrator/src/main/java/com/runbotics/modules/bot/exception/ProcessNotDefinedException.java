package com.runbotics.modules.bot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ProcessNotDefinedException extends RuntimeException {
    public ProcessNotDefinedException() {
        super("No process information attached");
    }
}

package com.runbotics.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class CollectionAccessDenied extends RuntimeException{

    public CollectionAccessDenied(String message) {
        super(message);
    }
    public CollectionAccessDenied() {
        super("You don't have access to this Collection");
    }
}

package com.runbotics.service.exception;

public class CollectionAccessDenied extends RuntimeException{

    public CollectionAccessDenied(String message) {
        super(message);
    }
    public CollectionAccessDenied() {
        super("You don't have access to this Collection");
    }
}

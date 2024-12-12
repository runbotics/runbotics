package com.runbotics.web.rest.errors;

import com.runbotics.security.UserNotActivatedException;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class AuthCustomException {

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(value = UserNotActivatedException.class)
    public ResponseEntity<ForbiddenAlertException> handleAuthenticationExceptions(
        UserNotActivatedException ex,
        HttpServletResponse response
    ) {
        ForbiddenAlertException exception = new ForbiddenAlertException(ex.getMessage(), null, "403");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception);
    }
}

package com.runbotics.web.rest.errors;

import com.runbotics.security.TenantNotActivatedException;
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
        ForbiddenAlertException exception = new ForbiddenAlertException(ex.getMessage(), null, "user_not_activated");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception);
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(value = TenantNotActivatedException.class)
    public ResponseEntity<ForbiddenAlertException> handleTenantExceptions(
        TenantNotActivatedException ex,
        HttpServletResponse response
    ) {
        ForbiddenAlertException exception = new ForbiddenAlertException(ex.getMessage(), null, "tenant_not_activated");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception);
    }
}

package com.runbotics.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final Logger log = LoggerFactory.getLogger(CustomAccessDeniedHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {

        Map<String, Object> body = new HashMap<>();

        if (accessDeniedException.getCause() instanceof TooManyRequestsException) {
            TooManyRequestsException ex = (TooManyRequestsException) accessDeniedException.getCause();
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            body.put("type", "about:blank");
            body.put("title", "Too Many Requests");
            body.put("status", HttpStatus.TOO_MANY_REQUESTS.value());
            body.put("detail", ex.getReason());
            body.put("message", "error.tooManyRequests");
        } else {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            body.put("type", "about:blank");
            body.put("title", "Forbidden");
            body.put("status", HttpStatus.FORBIDDEN.value());
            body.put("detail", "Access is denied");
            body.put("message", "error.accessDenied");
        }

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}

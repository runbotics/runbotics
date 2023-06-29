package com.runbotics.web.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.runbotics.domain.User;
import com.runbotics.security.jwt.JWTFilter;
import com.runbotics.security.jwt.TokenProvider;
import com.runbotics.service.GuestService;
import com.runbotics.web.rest.errors.GuestLimitAccessDeniedException;
import com.runbotics.web.rest.vm.GuestVM;
import com.runbotics.web.rest.vm.LoginVM;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    private final TokenProvider tokenProvider;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    private final GuestService guestService;

    public UserJWTController(
        TokenProvider tokenProvider,
        AuthenticationManagerBuilder authenticationManagerBuilder,
        GuestService guestService
    ) {
        this.tokenProvider = tokenProvider;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.guestService = guestService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            loginVM.getUsername(),
            loginVM.getPassword()
        );

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.createToken(authentication, loginVM.isRememberMe());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/authenticate/guest")
    public ResponseEntity<JWTToken> authenticateGuest(@Valid @RequestBody GuestVM guestVM, HttpServletRequest request) {
        String remoteAddress = request.getHeader("X-Forwarded-For");
        if (remoteAddress == null || remoteAddress.isEmpty()) {
            remoteAddress = request.getRemoteAddr();
        } else {
            var addresses = remoteAddress.split(",");
            remoteAddress = addresses.length > 0 ? addresses[addresses.length - 1] : remoteAddress;
        }
        if (!guestService.verifyGuestLimit(remoteAddress)) {
            throw new GuestLimitAccessDeniedException();
        }
        User guestUser = guestService.generateGuestAccount(remoteAddress, guestVM.getLangKey());
        String jwt = tokenProvider.createGuestToken(guestUser);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}

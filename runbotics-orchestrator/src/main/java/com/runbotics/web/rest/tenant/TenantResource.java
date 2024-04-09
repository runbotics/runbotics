package com.runbotics.web.rest.tenant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tenant/tenants")
public class TenantResource {

    @GetMapping
    public ResponseEntity<Void> getUserTenant() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping
    public ResponseEntity<Void> updateUserTenant() {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

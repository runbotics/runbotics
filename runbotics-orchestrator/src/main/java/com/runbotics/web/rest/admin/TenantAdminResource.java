package com.runbotics.web.rest.admin;

import com.runbotics.security.FeatureKeyConstants;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tenants")
@PreAuthorize("@securityService.checkFeatureKey('" + FeatureKeyConstants.TENANT_ALL_ACCESS + "')")
public class TenantAdminResource {

    @GetMapping("/all")
    public ResponseEntity<Void> getAllTenants() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Void> getTenantById() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Void> createTenant() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping
    public ResponseEntity<Void> updateTenant() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteTenant() {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

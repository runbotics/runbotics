package com.runbotics.web.rest.tenant;

import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.TenantService;
import com.runbotics.service.dto.TenantDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.ResponseUtil;

import java.util.Optional;

@RestController
@RequestMapping("/api/tenant/tenants")
public class TenantResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "tenant";

    private static final Logger log = LoggerFactory.getLogger(TenantResource.class);

    private final TenantService tenantService;

    public TenantResource(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.TENANT_READ + "')")
    public ResponseEntity<TenantDTO> getUserTenant() {
        log.debug("REST request to get tenant by requester");
        Optional<TenantDTO> tenant = tenantService.getByRequester();

        return ResponseUtil.wrapOrNotFound(tenant);
    }

//    Endpoint allows tenant admin to edit his organization - disabled feature for now
//    @PatchMapping
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.TENANT_EDIT + "')")
//    public ResponseEntity<TenantDTO> updateUserTenant(@Valid @RequestBody TenantDTO tenantDTO) {
//        log.debug("REST request to partial update tenant by requester");
//        Optional<TenantDTO> updatedTenant = tenantService.partialUpdate(tenantDTO);
//
//        return ResponseUtil.wrapOrNotFound(
//            updatedTenant,
//            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tenantDTO.getId().toString())
//        );
//    }
}

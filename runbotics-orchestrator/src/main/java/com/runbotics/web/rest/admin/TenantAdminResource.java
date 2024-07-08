package com.runbotics.web.rest.admin;

import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.TenantService;
import com.runbotics.service.criteria.TenantCriteria;
import com.runbotics.service.dto.TenantDTO;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api/admin/tenants")
@PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.TENANT_ALL_ACCESS + "')")
public class TenantAdminResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "tenant";

    private static final Logger log = LoggerFactory.getLogger(TenantAdminResource.class);

    private final TenantService tenantService;

    public TenantAdminResource(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping("/all-page")
    public ResponseEntity<Page<TenantDTO>> getAllTenantsByPage(Pageable pageable, TenantCriteria tenantCriteria) {
        log.debug("REST request to get all tenants by page");
        Page<TenantDTO> page = tenantService.getAllByPage(pageable, tenantCriteria);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page, headers, HttpStatus.OK);
    }

    /**
     * {@code DELETE /:id} : delete tenant by id.
     *
     * @param id of tenant.
     * @return the {@link ResponseEntity} with status {@code 204 (NO CONTENT)} and updated tenant in body.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTenant(@PathVariable(value = "id") final UUID id) {
        log.debug("REST request to delete tenant by id: {}", id);
        tenantService.delete(id);

        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

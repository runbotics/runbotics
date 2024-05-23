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

    /**
     * {@code GET  /all} : get all tenants.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tenants in body.
     */
    @GetMapping("/all")
    public ResponseEntity<List<TenantDTO>> getAllTenants() {
        log.debug("REST request to get all tenants");
        List<TenantDTO> tenants = tenantService.getAll();

        return ResponseEntity.ok().body(tenants);
    }

    @GetMapping("/all-page")
    public ResponseEntity<Page<TenantDTO>> getAllTenantsByPage(Pageable pageable, TenantCriteria tenantCriteria) {
        log.debug("REST request to get all tenants by page");
        Page<TenantDTO> page = tenantService.getAllByPage(pageable, tenantCriteria);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page, headers, HttpStatus.OK);
    }

    /**
     * {@code GET  /:id} : get tenant by id.
     *
     * @param id of tenant.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and tenant in body.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TenantDTO> getTenantById(@PathVariable("id") final UUID id) {
        log.debug("REST request to get tenant by id: {}", id);
        Optional<TenantDTO> tenant = tenantService.getById(id);

        return ResponseUtil.wrapOrNotFound(tenant);
    }

    /**
     * {@code POST /} : create tenant.
     *
     * @param tenantDTO the tenantDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (CREATED)} and created tenant in body.
     */
    @PostMapping
    public ResponseEntity<TenantDTO> createTenant(@Valid @RequestBody TenantDTO tenantDTO) throws URISyntaxException {
        log.debug("REST request to create tenant with body: {}", tenantDTO);
        TenantDTO tenant = tenantService.save(tenantDTO);

        return ResponseEntity
            .created(new URI("/api/admin/tenants" + tenant.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, tenant.getId().toString()))
            .body(tenant);
    }

    /**
     * {@code PATCH /:id} : partial update tenant.
     *
     * @param tenantDTO the tenantDTO to update.
     * @param id of tenant.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and updated tenant in body.
     */
    @PatchMapping("/{id}")
    public ResponseEntity<TenantDTO> updateTenant(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody TenantDTO tenantDTO
    ) {
        log.debug("REST request to partial update tenant by id: {}", id);
        if (!Objects.equals(id, tenantDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "InvalidId");
        }

        Optional<TenantDTO> tenant = tenantService.partialUpdate(tenantDTO);

        return ResponseUtil.wrapOrNotFound(
            tenant,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tenantDTO.getId().toString())
        );
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

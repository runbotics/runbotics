package com.runbotics.web.rest;

import com.runbotics.config.Constants;
import com.runbotics.security.AuthoritiesConstants;
import com.runbotics.service.GuestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;

import javax.validation.constraints.Pattern;

@RestController
@RequestMapping("/api/guests")
public class GuestResource {

    private final Logger log = LoggerFactory.getLogger(GuestResource.class);

    private GuestService guestService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    public GuestResource(GuestService guestService) {
        this.guestService = guestService;
    }

    /**
     * {@code DELETE /api/guest/all} : delete all guest accounts.
     *
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/all")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteUser() {
        log.debug("REST request to delete All Guest Accounts");
        guestService.deleteAllGuestAccounts();
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createAlert(applicationName, "guestManagement.deleted","All"))
            .build();
    }

}

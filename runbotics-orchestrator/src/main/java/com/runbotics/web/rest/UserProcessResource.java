package com.runbotics.web.rest;

import com.runbotics.domain.UserProcess;
import com.runbotics.repository.UserProcessRepository;
import com.runbotics.service.UserProcessService;
import com.runbotics.service.dto.UserProcessDTO;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserProcessResource {

    private static final String ENTITY_NAME = "jhi_user_process";
    private final Logger log = LoggerFactory.getLogger(UserProcessResource.class);
    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    private final UserProcessService userProcessService;
    private final UserProcessRepository userProcessRepository;

    public UserProcessResource(
        UserProcessService userProcessService,
        UserProcessRepository userProcessRepository) {
        this.userProcessService = userProcessService;
        this.userProcessRepository = userProcessRepository;
    }

    /**
     * {@code POST /process-notifications} : creates a new subscription for process notification.
     *
     * @param userProcessDTO the subscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subscription.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the userId or processId was not provided.
     */
    @PostMapping("/process-notifications")
    public ResponseEntity<UserProcessDTO> createProcessSubscription(@Valid @RequestBody UserProcessDTO userProcessDTO) {
        log.debug("REST request to create subscription for process notification: {}", userProcessDTO);

        if (userProcessDTO.getUserId() == null) {
            throw new BadRequestAlertException("To create new process subscription userId must be provided", ENTITY_NAME, "idNotExists");
        }

        if (userProcessDTO.getProcessId() == null) {
            throw new BadRequestAlertException("To create new process subscription processId must be provided", ENTITY_NAME, "idNotExists");
        }

        UserProcessDTO result = userProcessService.save(userProcessDTO);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.toString()))
            .body(result);
    }

    /**
     * {@code DELETE /process-notifications} : deletes a subscription for process notification.
     *
     * @param userId    id of the user related to the subscription to delete.
     * @param processId id of the process related to the subscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/process-notifications")
    public ResponseEntity<Void> deleteProcessSubscription(
        @RequestParam(value = "userId", required = true) Long userId,
        @RequestParam(value = "processId", required = true) Long processId
    ) {
        log.debug("REST request to create subscription for process notification with userId and processId: {} {}", userId, processId);

        UserProcess userProcess = userProcessRepository
            .findByIdUserIdAndIdProcessId(userId, processId)
            .orElse(null);

        if (userProcess == null) {
            throw new BadRequestAlertException("Subscription with this userId and processIs not exist", ENTITY_NAME, "idNotExist");
        }

        userProcessService.delete(userProcess);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, userProcess.toString()))
            .build();
    }
}

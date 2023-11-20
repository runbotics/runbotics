package com.runbotics.web.rest;

import com.runbotics.domain.NotificationProcess;
import com.runbotics.repository.NotificationProcessRepository;
import com.runbotics.service.NotificationProcessService;
import com.runbotics.service.dto.NotificationProcessDTO;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NotificationProcessResource {

    private static final String ENTITY_NAME = "notification_process";
    private final Logger log = LoggerFactory.getLogger(NotificationProcessResource.class);
    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    private final NotificationProcessService notificationProcessService;
    private final NotificationProcessRepository notificationProcessRepository;

    public NotificationProcessResource(
        NotificationProcessService notificationProcessService,
        NotificationProcessRepository notificationProcessRepository) {
        this.notificationProcessService = notificationProcessService;
        this.notificationProcessRepository = notificationProcessRepository;
    }

    /**
     * {@code GET /process-notifications/{processId}} : gets all subscriptions for processId.
     *
     * @param processId process id to get all filtered subscriptions.
     * @return the {@link ResponseEntity} with status {@code 200 (Ok)} and with body the subscriptions.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the processId was not provided.
     */
    @GetMapping("/process-notifications/{processId}")
    public ResponseEntity<List<NotificationProcessDTO>> getAllProcessSubscriptions(@PathVariable Long processId) {
        log.debug("REST request to get all subscriptions for process notification with id: {}", processId);

        if (processId == null) {
            throw new BadRequestAlertException("To get all process subscriptions processId must be provided", ENTITY_NAME, "idNotExists");
        }

        List<NotificationProcessDTO> result = notificationProcessService.getAllSubscriptionsByProcessId(processId);

        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code POST /process-notifications} : creates a new subscription for process notification.
     *
     * @param notificationProcessDTO the subscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subscription.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the userId or processId was not provided.
     */
    @PostMapping("/process-notifications")
    public ResponseEntity<NotificationProcessDTO> createProcessSubscription(@RequestBody NotificationProcessDTO notificationProcessDTO) {
        log.debug("REST request to create subscription for process notification: {}", notificationProcessDTO);

        if (notificationProcessDTO.getUser() == null) {
            throw new BadRequestAlertException("To create new process subscription user must be provided", ENTITY_NAME, "userNotExists");
        }

        if (notificationProcessDTO.getProcess() == null) {
            throw new BadRequestAlertException("To create new process subscription process must be provided", ENTITY_NAME, "processNotExists");
        }

        NotificationProcessDTO result = notificationProcessService.save(notificationProcessDTO);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.toString()))
            .body(result);
    }

    /**
     * {@code DELETE /process-notifications} : deletes a subscription for process notification.
     *
     * @param id id of the subscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/process-notifications/{id}")
    public ResponseEntity<Void> deleteProcessSubscription(@PathVariable Long id) {
        log.debug("REST request to delete subscription for process notification with id: {}", id);

        NotificationProcess notificationProcess = notificationProcessRepository
            .findById(id)
            .orElse(null);

        if (notificationProcess == null) {
            throw new BadRequestAlertException("Subscription with provided id not exist", ENTITY_NAME, "idNotExist");
        }

        notificationProcessService.delete(notificationProcess);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, notificationProcess.toString()))
            .build();
    }
}

package com.runbotics.web.rest;

import com.runbotics.domain.NotificationBot;
import com.runbotics.repository.NotificationBotRepository;
import com.runbotics.service.NotificationBotService;
import com.runbotics.service.dto.NotificationBotCreateDTO;
import com.runbotics.service.dto.NotificationBotDTO;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

import javax.swing.text.html.Option;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class NotificationBotResource {

    private static final String ENTITY_NAME = "notification_bot";
    private final Logger log = LoggerFactory.getLogger(NotificationBotResource.class);
    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    private final NotificationBotService notificationBotService;
    private final NotificationBotRepository notificationBotRepository;

    public NotificationBotResource(NotificationBotService notificationBotService, NotificationBotRepository notificationBotRepository) {
        this.notificationBotService = notificationBotService;
        this.notificationBotRepository = notificationBotRepository;
    }

    /**
     * {@code GET /bots/{botId}/notifications} : gets all subscriptions for botId.
     *
     * @param botId bot id to get all filtered subscriptions.
     * @return the {@link ResponseEntity} with status {@code 200 (Ok)} and with body the subscriptions.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the botId was not provided.
     */
    @GetMapping("/bots/{botId}/notifications")
    public ResponseEntity<List<NotificationBotDTO>> getAllBotSubscriptions(@PathVariable Long botId) {
        log.debug("REST request to get all subscriptions for bot notification with id: {}", botId);

        if (botId == null) {
            throw new BadRequestAlertException("To get all bot subscriptions botId must be provided", ENTITY_NAME, "idNotExists");
        }

        List<NotificationBotDTO> result = notificationBotService.getAllSubscriptionsByBotId(botId);

        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET /bot-notifications} : gets subscription for botId and userId.
     *
     * @param botId id to get subscription by processId
     * @param userId id to get subscription by userId
     * @return the {@link ResponseEntity} with status {@code 200 (Ok)} and with body the subscriptions.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the botId was not provided.
     */
    @GetMapping("/bot-notifications")
    public ResponseEntity<Optional<NotificationBotDTO>> getSubscriptionByBotIdAndUserId(
        @RequestParam Long botId,
        @RequestParam Long userId
    ) {
        log.debug("REST request to get subscription for bot notification with botId and userId: {} {}", botId, userId);

        if (botId == null) {
            throw new BadRequestAlertException("To get bot subscription botId must be provided", ENTITY_NAME, "idNotExists");
        }

        if (userId == null) {
            throw new BadRequestAlertException("To get bot subscription userId must be provided", ENTITY_NAME, "idNotExists");
        }

        return ResponseEntity.ok()
            .body(notificationBotService.getSubscriptionByBotIdAndUserId(botId, userId));
    }

    /**
     * {@code POST /bot-notifications} : creates a new subscription for bot notification.
     *
     * @param notificationBotCreateDTO the subscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subscription.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the userId or botId was not provided.
     */
    @PostMapping("/bot-notifications")
    public ResponseEntity<NotificationBotDTO> createBotSubscription(
            @NotNull @RequestBody @Valid NotificationBotCreateDTO notificationBotCreateDTO
    ) {
        log.debug("REST request to create subscription for bot notification: {}", notificationBotCreateDTO);

        NotificationBotDTO result = notificationBotService.save(notificationBotCreateDTO);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.toString()))
            .body(result);
    }

    /**
     * {@code DELETE /bot-notifications} : deletes a subscription for bot notification.
     *
     * @param id id of the user related to the subscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bot-notifications/{id}")
    public ResponseEntity<Void> deleteProcessSubscription(@PathVariable Long id) {
        log.debug("REST request to delete subscription for bot notification with id: {}", id);

        NotificationBot notificationBot = notificationBotRepository
            .findById(id)
            .orElseThrow(
                () -> new BadRequestAlertException("Subscription with provided id not exist", ENTITY_NAME, "idNotExist")
            );

        notificationBotService.delete(notificationBot);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, notificationBot.toString()))
            .build();
    }
}

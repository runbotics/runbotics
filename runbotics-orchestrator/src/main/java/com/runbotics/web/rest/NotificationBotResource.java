package com.runbotics.web.rest;

import com.runbotics.domain.NotificationBot;
import com.runbotics.repository.NotificationBotRepository;
import com.runbotics.service.NotificationBotService;
import com.runbotics.service.dto.NotificationBotDTO;
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
     * {@code GET /bot-notifications/{botId}} : gets all subscriptions for botId.
     *
     * @param botId bot id to get all filtered subscriptions.
     * @return the {@link ResponseEntity} with status {@code 200 (Ok)} and with body the subscriptions.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the botId was not provided.
     */
    @GetMapping("/bot-notifications/{botId}")
    public ResponseEntity<List<NotificationBotDTO>> getAllBotSubscriptions(@PathVariable Long botId) {
        log.debug("REST request to get all subscriptions for bot notification with id: {}", botId);

        if (botId == null) {
            throw new BadRequestAlertException("To get all bot subscriptions botId must be provided", ENTITY_NAME, "idNotExists");
        }

        List<NotificationBotDTO> result = notificationBotService.getAllSubscriptionsByBotId(botId);

        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code POST /bot-notifications} : creates a new subscription for bot notification.
     *
     * @param notificationBotDTO the subscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subscription.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the userId or botId was not provided.
     */
    @PostMapping("/bot-notifications")
    public ResponseEntity<NotificationBotDTO> createBotSubscription(@RequestBody NotificationBotDTO notificationBotDTO) {
        log.debug("REST request to create subscription for bot notification: {}", notificationBotDTO);

        if (notificationBotDTO.getUserId() == null) {
            throw new BadRequestAlertException("To create new bot subscription userId must be provided", ENTITY_NAME, "idNotExists");
        }

        if (notificationBotDTO.getBotId() == null) {
            throw new BadRequestAlertException("To create new bot subscription botId must be provided", ENTITY_NAME, "idNotExists");
        }

        NotificationBotDTO result = notificationBotService.save(notificationBotDTO);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.toString()))
            .body(result);
    }

    /**
     * {@code DELETE /bot-notifications} : deletes a subscription for bot notification.
     *
     * @param userId id of the user related to the subscription to delete.
     * @param botId  id of the bot related to the subscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bot-notifications")
    public ResponseEntity<Void> deleteProcessSubscription(
        @RequestParam(value = "userId", required = true) Long userId,
        @RequestParam(value = "botId", required = true) Long botId
    ) {
        log.debug("REST request to create subscription for bot notification with userId and botId: {} {}", userId, botId);

        NotificationBot notificationBot = notificationBotRepository
            .findByUserIdAndBotId(userId, botId)
            .orElse(null);

        if (notificationBot == null) {
            throw new BadRequestAlertException("Subscription with this userId and processIs not exist", ENTITY_NAME, "idNotExist");
        }

        notificationBotService.delete(notificationBot);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, notificationBot.toString()))
            .build();
    }
}

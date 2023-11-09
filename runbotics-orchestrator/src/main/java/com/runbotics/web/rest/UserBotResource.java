package com.runbotics.web.rest;

import com.runbotics.domain.UserBot;
import com.runbotics.repository.UserBotRepository;
import com.runbotics.service.UserBotService;
import com.runbotics.service.dto.UserBotDTO;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserBotResource {

    private static final String ENTITY_NAME = "jhi_user_bot";
    private final Logger log = LoggerFactory.getLogger(UserBotResource.class);
    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    private final UserBotService userBotService;
    private final UserBotRepository userBotRepository;

    public UserBotResource(UserBotService userBotService, UserBotRepository userBotRepository) {
        this.userBotService = userBotService;
        this.userBotRepository = userBotRepository;
    }

    /**
     * {@code GET /bot-notifications/{botId}} : gets all subscriptions for botId.
     *
     * @param botId bot id to get all filtered subscriptions.
     * @return the {@link ResponseEntity} with status {@code 200 (Ok)} and with body the subscriptions.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the botId was not provided.
     */
    @GetMapping("/bot-notifications/{botId}")
    public ResponseEntity<List<UserBotDTO>> getAllBotSubscriptions(@Valid @PathVariable Long botId) {
        log.debug("REST request to get all subscriptions for bot notification with id: {}", botId);

        if (botId == null) {
            throw new BadRequestAlertException("To get all bot subscriptions botId must be provided", ENTITY_NAME, "idNotExists");
        }

        List<UserBotDTO> result = userBotService.getAllSubscriptionsByBotId(botId);

        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code POST /bot-notifications} : creates a new subscription for bot notification.
     *
     * @param userBotDTO the subscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subscription.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the userId or botId was not provided.
     */
    @PostMapping("/bot-notifications")
    public ResponseEntity<UserBotDTO> createBotSubscription(@Valid @RequestBody UserBotDTO userBotDTO) {
        log.debug("REST request to create subscription for bot notification: {}", userBotDTO);

        if (userBotDTO.getUserId() == null) {
            throw new BadRequestAlertException("To create new bot subscription userId must be provided", ENTITY_NAME, "idNotExists");
        }

        if (userBotDTO.getBotId() == null) {
            throw new BadRequestAlertException("To create new bot subscription botId must be provided", ENTITY_NAME, "idNotExists");
        }

        UserBotDTO result = userBotService.save(userBotDTO);
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

        UserBot userBot = userBotRepository
            .findByIdUserIdAndIdBotId(userId, botId)
            .orElse(null);

        if (userBot == null) {
            throw new BadRequestAlertException("Subscription with this userId and processIs not exist", ENTITY_NAME, "idNotExist");
        }

        userBotService.delete(userBot);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, userBot.toString()))
            .build();
    }
}

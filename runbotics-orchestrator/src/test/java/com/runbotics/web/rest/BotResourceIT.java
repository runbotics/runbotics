package com.runbotics.web.rest;

import static com.runbotics.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.runbotics.IntegrationTest;
import com.runbotics.domain.Bot;
import com.runbotics.domain.User;
import com.runbotics.repository.BotRepository;
import com.runbotics.service.criteria.BotCriteria;
import com.runbotics.service.dto.BotDTO;
import com.runbotics.service.mapper.BotMapper;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BotResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BotResourceIT {

    private static final String DEFAULT_INSTALLATION_ID = "AAAAAAAAAA";
    private static final String UPDATED_INSTALLATION_ID = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final ZonedDateTime DEFAULT_LAST_CONNECTED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_CONNECTED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_LAST_CONNECTED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final String ENTITY_API_URL = "/api/bots";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BotRepository botRepository;

    @Autowired
    private BotMapper botMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBotMockMvc;

    private Bot bot;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bot createEntity(EntityManager em) {
        Bot bot = new Bot().installationId(DEFAULT_INSTALLATION_ID).created(DEFAULT_CREATED).lastConnected(DEFAULT_LAST_CONNECTED);
        return bot;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bot createUpdatedEntity(EntityManager em) {
        Bot bot = new Bot().installationId(UPDATED_INSTALLATION_ID).created(UPDATED_CREATED).lastConnected(UPDATED_LAST_CONNECTED);
        return bot;
    }

    @BeforeEach
    public void initTest() {
        bot = createEntity(em);
    }

    @Test
    @Transactional
    void createBot() throws Exception {
        int databaseSizeBeforeCreate = botRepository.findAll().size();
        // Create the Bot
        BotDTO botDTO = botMapper.toDto(bot);
        restBotMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(botDTO)))
            .andExpect(status().isCreated());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeCreate + 1);
        Bot testBot = botList.get(botList.size() - 1);
        assertThat(testBot.getInstallationId()).isEqualTo(DEFAULT_INSTALLATION_ID);
        assertThat(testBot.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testBot.getLastConnected()).isEqualTo(DEFAULT_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void createBotWithExistingId() throws Exception {
        // Create the Bot with an existing ID
        bot.setId(1L);
        BotDTO botDTO = botMapper.toDto(bot);

        int databaseSizeBeforeCreate = botRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBotMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(botDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkInstallationIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = botRepository.findAll().size();
        // set the field null
        bot.setInstallationId(null);

        // Create the Bot, which fails.
        BotDTO botDTO = botMapper.toDto(bot);

        restBotMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(botDTO)))
            .andExpect(status().isBadRequest());

        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBots() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList
        restBotMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bot.getId().intValue())))
            .andExpect(jsonPath("$.[*].installationId").value(hasItem(DEFAULT_INSTALLATION_ID)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].lastConnected").value(hasItem(sameInstant(DEFAULT_LAST_CONNECTED))));
    }

    @Test
    @Transactional
    void getBot() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get the bot
        restBotMockMvc
            .perform(get(ENTITY_API_URL_ID, bot.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bot.getId().intValue()))
            .andExpect(jsonPath("$.installationId").value(DEFAULT_INSTALLATION_ID))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.lastConnected").value(sameInstant(DEFAULT_LAST_CONNECTED)));
    }

    @Test
    @Transactional
    void getBotsByIdFiltering() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        Long id = bot.getId();

        defaultBotShouldBeFound("id.equals=" + id);
        defaultBotShouldNotBeFound("id.notEquals=" + id);

        defaultBotShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultBotShouldNotBeFound("id.greaterThan=" + id);

        defaultBotShouldBeFound("id.lessThanOrEqual=" + id);
        defaultBotShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllBotsByInstallationIdIsEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where installationId equals to DEFAULT_INSTALLATION_ID
        defaultBotShouldBeFound("installationId.equals=" + DEFAULT_INSTALLATION_ID);

        // Get all the botList where installationId equals to UPDATED_INSTALLATION_ID
        defaultBotShouldNotBeFound("installationId.equals=" + UPDATED_INSTALLATION_ID);
    }

    @Test
    @Transactional
    void getAllBotsByInstallationIdIsNotEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where installationId not equals to DEFAULT_INSTALLATION_ID
        defaultBotShouldNotBeFound("installationId.notEquals=" + DEFAULT_INSTALLATION_ID);

        // Get all the botList where installationId not equals to UPDATED_INSTALLATION_ID
        defaultBotShouldBeFound("installationId.notEquals=" + UPDATED_INSTALLATION_ID);
    }

    @Test
    @Transactional
    void getAllBotsByInstallationIdIsInShouldWork() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where installationId in DEFAULT_INSTALLATION_ID or UPDATED_INSTALLATION_ID
        defaultBotShouldBeFound("installationId.in=" + DEFAULT_INSTALLATION_ID + "," + UPDATED_INSTALLATION_ID);

        // Get all the botList where installationId equals to UPDATED_INSTALLATION_ID
        defaultBotShouldNotBeFound("installationId.in=" + UPDATED_INSTALLATION_ID);
    }

    @Test
    @Transactional
    void getAllBotsByInstallationIdIsNullOrNotNull() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where installationId is not null
        defaultBotShouldBeFound("installationId.specified=true");

        // Get all the botList where installationId is null
        defaultBotShouldNotBeFound("installationId.specified=false");
    }

    @Test
    @Transactional
    void getAllBotsByInstallationIdContainsSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where installationId contains DEFAULT_INSTALLATION_ID
        defaultBotShouldBeFound("installationId.contains=" + DEFAULT_INSTALLATION_ID);

        // Get all the botList where installationId contains UPDATED_INSTALLATION_ID
        defaultBotShouldNotBeFound("installationId.contains=" + UPDATED_INSTALLATION_ID);
    }

    @Test
    @Transactional
    void getAllBotsByInstallationIdNotContainsSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where installationId does not contain DEFAULT_INSTALLATION_ID
        defaultBotShouldNotBeFound("installationId.doesNotContain=" + DEFAULT_INSTALLATION_ID);

        // Get all the botList where installationId does not contain UPDATED_INSTALLATION_ID
        defaultBotShouldBeFound("installationId.doesNotContain=" + UPDATED_INSTALLATION_ID);
    }

    @Test
    @Transactional
    void getAllBotsByCreatedIsEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where created equals to DEFAULT_CREATED
        defaultBotShouldBeFound("created.equals=" + DEFAULT_CREATED);

        // Get all the botList where created equals to UPDATED_CREATED
        defaultBotShouldNotBeFound("created.equals=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllBotsByCreatedIsNotEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where created not equals to DEFAULT_CREATED
        defaultBotShouldNotBeFound("created.notEquals=" + DEFAULT_CREATED);

        // Get all the botList where created not equals to UPDATED_CREATED
        defaultBotShouldBeFound("created.notEquals=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllBotsByCreatedIsInShouldWork() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where created in DEFAULT_CREATED or UPDATED_CREATED
        defaultBotShouldBeFound("created.in=" + DEFAULT_CREATED + "," + UPDATED_CREATED);

        // Get all the botList where created equals to UPDATED_CREATED
        defaultBotShouldNotBeFound("created.in=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllBotsByCreatedIsNullOrNotNull() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where created is not null
        defaultBotShouldBeFound("created.specified=true");

        // Get all the botList where created is null
        defaultBotShouldNotBeFound("created.specified=false");
    }

    @Test
    @Transactional
    void getAllBotsByCreatedIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where created is greater than or equal to DEFAULT_CREATED
        defaultBotShouldBeFound("created.greaterThanOrEqual=" + DEFAULT_CREATED);

        // Get all the botList where created is greater than or equal to UPDATED_CREATED
        defaultBotShouldNotBeFound("created.greaterThanOrEqual=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllBotsByCreatedIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where created is less than or equal to DEFAULT_CREATED
        defaultBotShouldBeFound("created.lessThanOrEqual=" + DEFAULT_CREATED);

        // Get all the botList where created is less than or equal to SMALLER_CREATED
        defaultBotShouldNotBeFound("created.lessThanOrEqual=" + SMALLER_CREATED);
    }

    @Test
    @Transactional
    void getAllBotsByCreatedIsLessThanSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where created is less than DEFAULT_CREATED
        defaultBotShouldNotBeFound("created.lessThan=" + DEFAULT_CREATED);

        // Get all the botList where created is less than UPDATED_CREATED
        defaultBotShouldBeFound("created.lessThan=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllBotsByCreatedIsGreaterThanSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where created is greater than DEFAULT_CREATED
        defaultBotShouldNotBeFound("created.greaterThan=" + DEFAULT_CREATED);

        // Get all the botList where created is greater than SMALLER_CREATED
        defaultBotShouldBeFound("created.greaterThan=" + SMALLER_CREATED);
    }

    @Test
    @Transactional
    void getAllBotsByLastConnectedIsEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where lastConnected equals to DEFAULT_LAST_CONNECTED
        defaultBotShouldBeFound("lastConnected.equals=" + DEFAULT_LAST_CONNECTED);

        // Get all the botList where lastConnected equals to UPDATED_LAST_CONNECTED
        defaultBotShouldNotBeFound("lastConnected.equals=" + UPDATED_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void getAllBotsByLastConnectedIsNotEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where lastConnected not equals to DEFAULT_LAST_CONNECTED
        defaultBotShouldNotBeFound("lastConnected.notEquals=" + DEFAULT_LAST_CONNECTED);

        // Get all the botList where lastConnected not equals to UPDATED_LAST_CONNECTED
        defaultBotShouldBeFound("lastConnected.notEquals=" + UPDATED_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void getAllBotsByLastConnectedIsInShouldWork() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where lastConnected in DEFAULT_LAST_CONNECTED or UPDATED_LAST_CONNECTED
        defaultBotShouldBeFound("lastConnected.in=" + DEFAULT_LAST_CONNECTED + "," + UPDATED_LAST_CONNECTED);

        // Get all the botList where lastConnected equals to UPDATED_LAST_CONNECTED
        defaultBotShouldNotBeFound("lastConnected.in=" + UPDATED_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void getAllBotsByLastConnectedIsNullOrNotNull() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where lastConnected is not null
        defaultBotShouldBeFound("lastConnected.specified=true");

        // Get all the botList where lastConnected is null
        defaultBotShouldNotBeFound("lastConnected.specified=false");
    }

    @Test
    @Transactional
    void getAllBotsByLastConnectedIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where lastConnected is greater than or equal to DEFAULT_LAST_CONNECTED
        defaultBotShouldBeFound("lastConnected.greaterThanOrEqual=" + DEFAULT_LAST_CONNECTED);

        // Get all the botList where lastConnected is greater than or equal to UPDATED_LAST_CONNECTED
        defaultBotShouldNotBeFound("lastConnected.greaterThanOrEqual=" + UPDATED_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void getAllBotsByLastConnectedIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where lastConnected is less than or equal to DEFAULT_LAST_CONNECTED
        defaultBotShouldBeFound("lastConnected.lessThanOrEqual=" + DEFAULT_LAST_CONNECTED);

        // Get all the botList where lastConnected is less than or equal to SMALLER_LAST_CONNECTED
        defaultBotShouldNotBeFound("lastConnected.lessThanOrEqual=" + SMALLER_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void getAllBotsByLastConnectedIsLessThanSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where lastConnected is less than DEFAULT_LAST_CONNECTED
        defaultBotShouldNotBeFound("lastConnected.lessThan=" + DEFAULT_LAST_CONNECTED);

        // Get all the botList where lastConnected is less than UPDATED_LAST_CONNECTED
        defaultBotShouldBeFound("lastConnected.lessThan=" + UPDATED_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void getAllBotsByLastConnectedIsGreaterThanSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        // Get all the botList where lastConnected is greater than DEFAULT_LAST_CONNECTED
        defaultBotShouldNotBeFound("lastConnected.greaterThan=" + DEFAULT_LAST_CONNECTED);

        // Get all the botList where lastConnected is greater than SMALLER_LAST_CONNECTED
        defaultBotShouldBeFound("lastConnected.greaterThan=" + SMALLER_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void getAllBotsByUserIsEqualToSomething() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        bot.setUser(user);
        botRepository.saveAndFlush(bot);
        Long userId = user.getId();

        // Get all the botList where user equals to userId
        defaultBotShouldBeFound("userId.equals=" + userId);

        // Get all the botList where user equals to (userId + 1)
        defaultBotShouldNotBeFound("userId.equals=" + (userId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultBotShouldBeFound(String filter) throws Exception {
        restBotMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bot.getId().intValue())))
            .andExpect(jsonPath("$.[*].installationId").value(hasItem(DEFAULT_INSTALLATION_ID)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].lastConnected").value(hasItem(sameInstant(DEFAULT_LAST_CONNECTED))));

        // Check, that the count call also returns 1
        restBotMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultBotShouldNotBeFound(String filter) throws Exception {
        restBotMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restBotMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingBot() throws Exception {
        // Get the bot
        restBotMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBot() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        int databaseSizeBeforeUpdate = botRepository.findAll().size();

        // Update the bot
        Bot updatedBot = botRepository.findById(bot.getId()).get();
        // Disconnect from session so that the updates on updatedBot are not directly saved in db
        em.detach(updatedBot);
        updatedBot.installationId(UPDATED_INSTALLATION_ID).created(UPDATED_CREATED).lastConnected(UPDATED_LAST_CONNECTED);
        BotDTO botDTO = botMapper.toDto(updatedBot);

        restBotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, botDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(botDTO))
            )
            .andExpect(status().isOk());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeUpdate);
        Bot testBot = botList.get(botList.size() - 1);
        assertThat(testBot.getInstallationId()).isEqualTo(UPDATED_INSTALLATION_ID);
        assertThat(testBot.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testBot.getLastConnected()).isEqualTo(UPDATED_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void putNonExistingBot() throws Exception {
        int databaseSizeBeforeUpdate = botRepository.findAll().size();
        bot.setId(count.incrementAndGet());

        // Create the Bot
        BotDTO botDTO = botMapper.toDto(bot);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, botDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(botDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBot() throws Exception {
        int databaseSizeBeforeUpdate = botRepository.findAll().size();
        bot.setId(count.incrementAndGet());

        // Create the Bot
        BotDTO botDTO = botMapper.toDto(bot);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(botDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBot() throws Exception {
        int databaseSizeBeforeUpdate = botRepository.findAll().size();
        bot.setId(count.incrementAndGet());

        // Create the Bot
        BotDTO botDTO = botMapper.toDto(bot);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBotMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(botDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBotWithPatch() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        int databaseSizeBeforeUpdate = botRepository.findAll().size();

        // Update the bot using partial update
        Bot partialUpdatedBot = new Bot();
        partialUpdatedBot.setId(bot.getId());

        restBotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBot.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBot))
            )
            .andExpect(status().isOk());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeUpdate);
        Bot testBot = botList.get(botList.size() - 1);
        assertThat(testBot.getInstallationId()).isEqualTo(DEFAULT_INSTALLATION_ID);
        assertThat(testBot.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testBot.getLastConnected()).isEqualTo(DEFAULT_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void fullUpdateBotWithPatch() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        int databaseSizeBeforeUpdate = botRepository.findAll().size();

        // Update the bot using partial update
        Bot partialUpdatedBot = new Bot();
        partialUpdatedBot.setId(bot.getId());

        partialUpdatedBot.installationId(UPDATED_INSTALLATION_ID).created(UPDATED_CREATED).lastConnected(UPDATED_LAST_CONNECTED);

        restBotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBot.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBot))
            )
            .andExpect(status().isOk());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeUpdate);
        Bot testBot = botList.get(botList.size() - 1);
        assertThat(testBot.getInstallationId()).isEqualTo(UPDATED_INSTALLATION_ID);
        assertThat(testBot.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testBot.getLastConnected()).isEqualTo(UPDATED_LAST_CONNECTED);
    }

    @Test
    @Transactional
    void patchNonExistingBot() throws Exception {
        int databaseSizeBeforeUpdate = botRepository.findAll().size();
        bot.setId(count.incrementAndGet());

        // Create the Bot
        BotDTO botDTO = botMapper.toDto(bot);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, botDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(botDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBot() throws Exception {
        int databaseSizeBeforeUpdate = botRepository.findAll().size();
        bot.setId(count.incrementAndGet());

        // Create the Bot
        BotDTO botDTO = botMapper.toDto(bot);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(botDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBot() throws Exception {
        int databaseSizeBeforeUpdate = botRepository.findAll().size();
        bot.setId(count.incrementAndGet());

        // Create the Bot
        BotDTO botDTO = botMapper.toDto(bot);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBotMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(botDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bot in the database
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBot() throws Exception {
        // Initialize the database
        botRepository.saveAndFlush(bot);

        int databaseSizeBeforeDelete = botRepository.findAll().size();

        // Delete the bot
        restBotMockMvc.perform(delete(ENTITY_API_URL_ID, bot.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bot> botList = botRepository.findAll();
        assertThat(botList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

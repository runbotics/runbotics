package com.runbotics.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.runbotics.IntegrationTest;
import com.runbotics.domain.Bot;
import com.runbotics.domain.Process;
import com.runbotics.domain.ScheduleProcess;
import com.runbotics.repository.ScheduleProcessRepository;
import com.runbotics.service.criteria.ScheduleProcessCriteria;
import com.runbotics.service.dto.ScheduleProcessDTO;
import com.runbotics.service.mapper.ScheduleProcessMapper;
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
 * Integration tests for the {@link ScheduleProcessResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ScheduleProcessResourceIT {

    private static final String DEFAULT_CRON = "AAAAAAAAAA";
    private static final String UPDATED_CRON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/schedule-processes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ScheduleProcessRepository scheduleProcessRepository;

    @Autowired
    private ScheduleProcessMapper scheduleProcessMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restScheduleProcessMockMvc;

    private ScheduleProcess scheduleProcess;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ScheduleProcess createEntity(EntityManager em) {
        ScheduleProcess scheduleProcess = new ScheduleProcess().cron(DEFAULT_CRON);
        // Add required entity
        Process process;
        if (TestUtil.findAll(em, Process.class).isEmpty()) {
            process = ProcessResourceIT.createEntity(em);
            em.persist(process);
            em.flush();
        } else {
            process = TestUtil.findAll(em, Process.class).get(0);
        }
        scheduleProcess.setProcess(process);
        // Add required entity
        Bot bot;
        if (TestUtil.findAll(em, Bot.class).isEmpty()) {
            bot = BotResourceIT.createEntity(em);
            em.persist(bot);
            em.flush();
        } else {
            bot = TestUtil.findAll(em, Bot.class).get(0);
        }
        scheduleProcess.setBot(bot);
        return scheduleProcess;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ScheduleProcess createUpdatedEntity(EntityManager em) {
        ScheduleProcess scheduleProcess = new ScheduleProcess().cron(UPDATED_CRON);
        // Add required entity
        Process process;
        if (TestUtil.findAll(em, Process.class).isEmpty()) {
            process = ProcessResourceIT.createUpdatedEntity(em);
            em.persist(process);
            em.flush();
        } else {
            process = TestUtil.findAll(em, Process.class).get(0);
        }
        scheduleProcess.setProcess(process);
        // Add required entity
        Bot bot;
        if (TestUtil.findAll(em, Bot.class).isEmpty()) {
            bot = BotResourceIT.createUpdatedEntity(em);
            em.persist(bot);
            em.flush();
        } else {
            bot = TestUtil.findAll(em, Bot.class).get(0);
        }
        scheduleProcess.setBot(bot);
        return scheduleProcess;
    }

    @BeforeEach
    public void initTest() {
        scheduleProcess = createEntity(em);
    }

    @Test
    @Transactional
    void createScheduleProcess() throws Exception {
        int databaseSizeBeforeCreate = scheduleProcessRepository.findAll().size();
        // Create the ScheduleProcess
        ScheduleProcessDTO scheduleProcessDTO = scheduleProcessMapper.toDto(scheduleProcess);
        restScheduleProcessMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scheduleProcessDTO))
            )
            .andExpect(status().isCreated());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeCreate + 1);
        ScheduleProcess testScheduleProcess = scheduleProcessList.get(scheduleProcessList.size() - 1);
        assertThat(testScheduleProcess.getCron()).isEqualTo(DEFAULT_CRON);
    }

    @Test
    @Transactional
    void createScheduleProcessWithExistingId() throws Exception {
        // Create the ScheduleProcess with an existing ID
        scheduleProcess.setId(1L);
        ScheduleProcessDTO scheduleProcessDTO = scheduleProcessMapper.toDto(scheduleProcess);

        int databaseSizeBeforeCreate = scheduleProcessRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restScheduleProcessMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scheduleProcessDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCronIsRequired() throws Exception {
        int databaseSizeBeforeTest = scheduleProcessRepository.findAll().size();
        // set the field null
        scheduleProcess.setCron(null);

        // Create the ScheduleProcess, which fails.
        ScheduleProcessDTO scheduleProcessDTO = scheduleProcessMapper.toDto(scheduleProcess);

        restScheduleProcessMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scheduleProcessDTO))
            )
            .andExpect(status().isBadRequest());

        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllScheduleProcesses() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        // Get all the scheduleProcessList
        restScheduleProcessMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(scheduleProcess.getId().intValue())))
            .andExpect(jsonPath("$.[*].cron").value(hasItem(DEFAULT_CRON)));
    }

    @Test
    @Transactional
    void getScheduleProcess() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        // Get the scheduleProcess
        restScheduleProcessMockMvc
            .perform(get(ENTITY_API_URL_ID, scheduleProcess.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(scheduleProcess.getId().intValue()))
            .andExpect(jsonPath("$.cron").value(DEFAULT_CRON));
    }

    @Test
    @Transactional
    void getScheduleProcessesByIdFiltering() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        Long id = scheduleProcess.getId();

        defaultScheduleProcessShouldBeFound("id.equals=" + id);
        defaultScheduleProcessShouldNotBeFound("id.notEquals=" + id);

        defaultScheduleProcessShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultScheduleProcessShouldNotBeFound("id.greaterThan=" + id);

        defaultScheduleProcessShouldBeFound("id.lessThanOrEqual=" + id);
        defaultScheduleProcessShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllScheduleProcessesByCronIsEqualToSomething() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        // Get all the scheduleProcessList where cron equals to DEFAULT_CRON
        defaultScheduleProcessShouldBeFound("cron.equals=" + DEFAULT_CRON);

        // Get all the scheduleProcessList where cron equals to UPDATED_CRON
        defaultScheduleProcessShouldNotBeFound("cron.equals=" + UPDATED_CRON);
    }

    @Test
    @Transactional
    void getAllScheduleProcessesByCronIsNotEqualToSomething() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        // Get all the scheduleProcessList where cron not equals to DEFAULT_CRON
        defaultScheduleProcessShouldNotBeFound("cron.notEquals=" + DEFAULT_CRON);

        // Get all the scheduleProcessList where cron not equals to UPDATED_CRON
        defaultScheduleProcessShouldBeFound("cron.notEquals=" + UPDATED_CRON);
    }

    @Test
    @Transactional
    void getAllScheduleProcessesByCronIsInShouldWork() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        // Get all the scheduleProcessList where cron in DEFAULT_CRON or UPDATED_CRON
        defaultScheduleProcessShouldBeFound("cron.in=" + DEFAULT_CRON + "," + UPDATED_CRON);

        // Get all the scheduleProcessList where cron equals to UPDATED_CRON
        defaultScheduleProcessShouldNotBeFound("cron.in=" + UPDATED_CRON);
    }

    @Test
    @Transactional
    void getAllScheduleProcessesByCronIsNullOrNotNull() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        // Get all the scheduleProcessList where cron is not null
        defaultScheduleProcessShouldBeFound("cron.specified=true");

        // Get all the scheduleProcessList where cron is null
        defaultScheduleProcessShouldNotBeFound("cron.specified=false");
    }

    @Test
    @Transactional
    void getAllScheduleProcessesByCronContainsSomething() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        // Get all the scheduleProcessList where cron contains DEFAULT_CRON
        defaultScheduleProcessShouldBeFound("cron.contains=" + DEFAULT_CRON);

        // Get all the scheduleProcessList where cron contains UPDATED_CRON
        defaultScheduleProcessShouldNotBeFound("cron.contains=" + UPDATED_CRON);
    }

    @Test
    @Transactional
    void getAllScheduleProcessesByCronNotContainsSomething() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        // Get all the scheduleProcessList where cron does not contain DEFAULT_CRON
        defaultScheduleProcessShouldNotBeFound("cron.doesNotContain=" + DEFAULT_CRON);

        // Get all the scheduleProcessList where cron does not contain UPDATED_CRON
        defaultScheduleProcessShouldBeFound("cron.doesNotContain=" + UPDATED_CRON);
    }

    @Test
    @Transactional
    void getAllScheduleProcessesByProcessIsEqualToSomething() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);
        Process process = ProcessResourceIT.createEntity(em);
        em.persist(process);
        em.flush();
        scheduleProcess.setProcess(process);
        scheduleProcessRepository.saveAndFlush(scheduleProcess);
        Long processId = process.getId();

        // Get all the scheduleProcessList where process equals to processId
        defaultScheduleProcessShouldBeFound("processId.equals=" + processId);

        // Get all the scheduleProcessList where process equals to (processId + 1)
        defaultScheduleProcessShouldNotBeFound("processId.equals=" + (processId + 1));
    }

    @Test
    @Transactional
    void getAllScheduleProcessesByBotIsEqualToSomething() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);
        Bot bot = BotResourceIT.createEntity(em);
        em.persist(bot);
        em.flush();
        scheduleProcess.setBot(bot);
        scheduleProcessRepository.saveAndFlush(scheduleProcess);
        Long botId = bot.getId();

        // Get all the scheduleProcessList where bot equals to botId
        defaultScheduleProcessShouldBeFound("botId.equals=" + botId);

        // Get all the scheduleProcessList where bot equals to (botId + 1)
        defaultScheduleProcessShouldNotBeFound("botId.equals=" + (botId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultScheduleProcessShouldBeFound(String filter) throws Exception {
        restScheduleProcessMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(scheduleProcess.getId().intValue())))
            .andExpect(jsonPath("$.[*].cron").value(hasItem(DEFAULT_CRON)));

        // Check, that the count call also returns 1
        restScheduleProcessMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultScheduleProcessShouldNotBeFound(String filter) throws Exception {
        restScheduleProcessMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restScheduleProcessMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingScheduleProcess() throws Exception {
        // Get the scheduleProcess
        restScheduleProcessMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewScheduleProcess() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        int databaseSizeBeforeUpdate = scheduleProcessRepository.findAll().size();

        // Update the scheduleProcess
        ScheduleProcess updatedScheduleProcess = scheduleProcessRepository.findById(scheduleProcess.getId()).get();
        // Disconnect from session so that the updates on updatedScheduleProcess are not directly saved in db
        em.detach(updatedScheduleProcess);
        updatedScheduleProcess.cron(UPDATED_CRON);
        ScheduleProcessDTO scheduleProcessDTO = scheduleProcessMapper.toDto(updatedScheduleProcess);

        restScheduleProcessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, scheduleProcessDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scheduleProcessDTO))
            )
            .andExpect(status().isOk());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeUpdate);
        ScheduleProcess testScheduleProcess = scheduleProcessList.get(scheduleProcessList.size() - 1);
        assertThat(testScheduleProcess.getCron()).isEqualTo(UPDATED_CRON);
    }

    @Test
    @Transactional
    void putNonExistingScheduleProcess() throws Exception {
        int databaseSizeBeforeUpdate = scheduleProcessRepository.findAll().size();
        scheduleProcess.setId(count.incrementAndGet());

        // Create the ScheduleProcess
        ScheduleProcessDTO scheduleProcessDTO = scheduleProcessMapper.toDto(scheduleProcess);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScheduleProcessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, scheduleProcessDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scheduleProcessDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchScheduleProcess() throws Exception {
        int databaseSizeBeforeUpdate = scheduleProcessRepository.findAll().size();
        scheduleProcess.setId(count.incrementAndGet());

        // Create the ScheduleProcess
        ScheduleProcessDTO scheduleProcessDTO = scheduleProcessMapper.toDto(scheduleProcess);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScheduleProcessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scheduleProcessDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamScheduleProcess() throws Exception {
        int databaseSizeBeforeUpdate = scheduleProcessRepository.findAll().size();
        scheduleProcess.setId(count.incrementAndGet());

        // Create the ScheduleProcess
        ScheduleProcessDTO scheduleProcessDTO = scheduleProcessMapper.toDto(scheduleProcess);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScheduleProcessMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scheduleProcessDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateScheduleProcessWithPatch() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        int databaseSizeBeforeUpdate = scheduleProcessRepository.findAll().size();

        // Update the scheduleProcess using partial update
        ScheduleProcess partialUpdatedScheduleProcess = new ScheduleProcess();
        partialUpdatedScheduleProcess.setId(scheduleProcess.getId());

        restScheduleProcessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScheduleProcess.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScheduleProcess))
            )
            .andExpect(status().isOk());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeUpdate);
        ScheduleProcess testScheduleProcess = scheduleProcessList.get(scheduleProcessList.size() - 1);
        assertThat(testScheduleProcess.getCron()).isEqualTo(DEFAULT_CRON);
    }

    @Test
    @Transactional
    void fullUpdateScheduleProcessWithPatch() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        int databaseSizeBeforeUpdate = scheduleProcessRepository.findAll().size();

        // Update the scheduleProcess using partial update
        ScheduleProcess partialUpdatedScheduleProcess = new ScheduleProcess();
        partialUpdatedScheduleProcess.setId(scheduleProcess.getId());

        partialUpdatedScheduleProcess.cron(UPDATED_CRON);

        restScheduleProcessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScheduleProcess.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScheduleProcess))
            )
            .andExpect(status().isOk());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeUpdate);
        ScheduleProcess testScheduleProcess = scheduleProcessList.get(scheduleProcessList.size() - 1);
        assertThat(testScheduleProcess.getCron()).isEqualTo(UPDATED_CRON);
    }

    @Test
    @Transactional
    void patchNonExistingScheduleProcess() throws Exception {
        int databaseSizeBeforeUpdate = scheduleProcessRepository.findAll().size();
        scheduleProcess.setId(count.incrementAndGet());

        // Create the ScheduleProcess
        ScheduleProcessDTO scheduleProcessDTO = scheduleProcessMapper.toDto(scheduleProcess);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScheduleProcessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, scheduleProcessDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scheduleProcessDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchScheduleProcess() throws Exception {
        int databaseSizeBeforeUpdate = scheduleProcessRepository.findAll().size();
        scheduleProcess.setId(count.incrementAndGet());

        // Create the ScheduleProcess
        ScheduleProcessDTO scheduleProcessDTO = scheduleProcessMapper.toDto(scheduleProcess);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScheduleProcessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scheduleProcessDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamScheduleProcess() throws Exception {
        int databaseSizeBeforeUpdate = scheduleProcessRepository.findAll().size();
        scheduleProcess.setId(count.incrementAndGet());

        // Create the ScheduleProcess
        ScheduleProcessDTO scheduleProcessDTO = scheduleProcessMapper.toDto(scheduleProcess);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScheduleProcessMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scheduleProcessDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ScheduleProcess in the database
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteScheduleProcess() throws Exception {
        // Initialize the database
        scheduleProcessRepository.saveAndFlush(scheduleProcess);

        int databaseSizeBeforeDelete = scheduleProcessRepository.findAll().size();

        // Delete the scheduleProcess
        restScheduleProcessMockMvc
            .perform(delete(ENTITY_API_URL_ID, scheduleProcess.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ScheduleProcess> scheduleProcessList = scheduleProcessRepository.findAll();
        assertThat(scheduleProcessList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

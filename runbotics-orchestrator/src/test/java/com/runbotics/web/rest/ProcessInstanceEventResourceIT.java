package com.runbotics.web.rest;

import static com.runbotics.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.runbotics.IntegrationTest;
import com.runbotics.domain.ProcessInstance;
import com.runbotics.domain.ProcessInstanceEvent;
import com.runbotics.repository.ProcessInstanceEventRepository;
import com.runbotics.service.criteria.ProcessInstanceEventCriteria;
import com.runbotics.service.dto.ProcessInstanceEventDTO;
import com.runbotics.service.mapper.ProcessInstanceEventMapper;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ProcessInstanceEventResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProcessInstanceEventResourceIT {

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final String DEFAULT_LOG = "AAAAAAAAAA";
    private static final String UPDATED_LOG = "BBBBBBBBBB";

    private static final String DEFAULT_STEP = "AAAAAAAAAA";
    private static final String UPDATED_STEP = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/process-instance-events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProcessInstanceEventRepository processInstanceEventRepository;

    @Autowired
    private ProcessInstanceEventMapper processInstanceEventMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProcessInstanceEventMockMvc;

    private ProcessInstanceEvent processInstanceEvent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProcessInstanceEvent createEntity(EntityManager em) {
        ProcessInstanceEvent processInstanceEvent = new ProcessInstanceEvent().created(DEFAULT_CREATED).log(DEFAULT_LOG).step(DEFAULT_STEP);
        return processInstanceEvent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProcessInstanceEvent createUpdatedEntity(EntityManager em) {
        ProcessInstanceEvent processInstanceEvent = new ProcessInstanceEvent().created(UPDATED_CREATED).log(UPDATED_LOG).step(UPDATED_STEP);
        return processInstanceEvent;
    }

    @BeforeEach
    public void initTest() {
        processInstanceEvent = createEntity(em);
    }

    @Test
    @Transactional
    void createProcessInstanceEvent() throws Exception {
        int databaseSizeBeforeCreate = processInstanceEventRepository.findAll().size();
        // Create the ProcessInstanceEvent
        ProcessInstanceEventDTO processInstanceEventDTO = processInstanceEventMapper.toDto(processInstanceEvent);
        restProcessInstanceEventMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceEventDTO))
            )
            .andExpect(status().isCreated());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeCreate + 1);
        ProcessInstanceEvent testProcessInstanceEvent = processInstanceEventList.get(processInstanceEventList.size() - 1);
        assertThat(testProcessInstanceEvent.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testProcessInstanceEvent.getLog()).isEqualTo(DEFAULT_LOG);
        assertThat(testProcessInstanceEvent.getStep()).isEqualTo(DEFAULT_STEP);
    }

    @Test
    @Transactional
    void createProcessInstanceEventWithExistingId() throws Exception {
        // Create the ProcessInstanceEvent with an existing ID
        processInstanceEvent.setId(1L);
        ProcessInstanceEventDTO processInstanceEventDTO = processInstanceEventMapper.toDto(processInstanceEvent);

        int databaseSizeBeforeCreate = processInstanceEventRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProcessInstanceEventMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceEventDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEvents() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList
        restProcessInstanceEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(processInstanceEvent.getId().intValue())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].log").value(hasItem(DEFAULT_LOG.toString())))
            .andExpect(jsonPath("$.[*].step").value(hasItem(DEFAULT_STEP)));
    }

    @Test
    @Transactional
    void getProcessInstanceEvent() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get the processInstanceEvent
        restProcessInstanceEventMockMvc
            .perform(get(ENTITY_API_URL_ID, processInstanceEvent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(processInstanceEvent.getId().intValue()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.log").value(DEFAULT_LOG.toString()))
            .andExpect(jsonPath("$.step").value(DEFAULT_STEP));
    }

    @Test
    @Transactional
    void getProcessInstanceEventsByIdFiltering() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        Long id = processInstanceEvent.getId();

        defaultProcessInstanceEventShouldBeFound("id.equals=" + id);
        defaultProcessInstanceEventShouldNotBeFound("id.notEquals=" + id);

        defaultProcessInstanceEventShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultProcessInstanceEventShouldNotBeFound("id.greaterThan=" + id);

        defaultProcessInstanceEventShouldBeFound("id.lessThanOrEqual=" + id);
        defaultProcessInstanceEventShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByCreatedIsEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where created equals to DEFAULT_CREATED
        defaultProcessInstanceEventShouldBeFound("created.equals=" + DEFAULT_CREATED);

        // Get all the processInstanceEventList where created equals to UPDATED_CREATED
        defaultProcessInstanceEventShouldNotBeFound("created.equals=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByCreatedIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where created not equals to DEFAULT_CREATED
        defaultProcessInstanceEventShouldNotBeFound("created.notEquals=" + DEFAULT_CREATED);

        // Get all the processInstanceEventList where created not equals to UPDATED_CREATED
        defaultProcessInstanceEventShouldBeFound("created.notEquals=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByCreatedIsInShouldWork() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where created in DEFAULT_CREATED or UPDATED_CREATED
        defaultProcessInstanceEventShouldBeFound("created.in=" + DEFAULT_CREATED + "," + UPDATED_CREATED);

        // Get all the processInstanceEventList where created equals to UPDATED_CREATED
        defaultProcessInstanceEventShouldNotBeFound("created.in=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByCreatedIsNullOrNotNull() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where created is not null
        defaultProcessInstanceEventShouldBeFound("created.specified=true");

        // Get all the processInstanceEventList where created is null
        defaultProcessInstanceEventShouldNotBeFound("created.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByCreatedIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where created is greater than or equal to DEFAULT_CREATED
        defaultProcessInstanceEventShouldBeFound("created.greaterThanOrEqual=" + DEFAULT_CREATED);

        // Get all the processInstanceEventList where created is greater than or equal to UPDATED_CREATED
        defaultProcessInstanceEventShouldNotBeFound("created.greaterThanOrEqual=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByCreatedIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where created is less than or equal to DEFAULT_CREATED
        defaultProcessInstanceEventShouldBeFound("created.lessThanOrEqual=" + DEFAULT_CREATED);

        // Get all the processInstanceEventList where created is less than or equal to SMALLER_CREATED
        defaultProcessInstanceEventShouldNotBeFound("created.lessThanOrEqual=" + SMALLER_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByCreatedIsLessThanSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where created is less than DEFAULT_CREATED
        defaultProcessInstanceEventShouldNotBeFound("created.lessThan=" + DEFAULT_CREATED);

        // Get all the processInstanceEventList where created is less than UPDATED_CREATED
        defaultProcessInstanceEventShouldBeFound("created.lessThan=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByCreatedIsGreaterThanSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where created is greater than DEFAULT_CREATED
        defaultProcessInstanceEventShouldNotBeFound("created.greaterThan=" + DEFAULT_CREATED);

        // Get all the processInstanceEventList where created is greater than SMALLER_CREATED
        defaultProcessInstanceEventShouldBeFound("created.greaterThan=" + SMALLER_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByStepIsEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where step equals to DEFAULT_STEP
        defaultProcessInstanceEventShouldBeFound("step.equals=" + DEFAULT_STEP);

        // Get all the processInstanceEventList where step equals to UPDATED_STEP
        defaultProcessInstanceEventShouldNotBeFound("step.equals=" + UPDATED_STEP);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByStepIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where step not equals to DEFAULT_STEP
        defaultProcessInstanceEventShouldNotBeFound("step.notEquals=" + DEFAULT_STEP);

        // Get all the processInstanceEventList where step not equals to UPDATED_STEP
        defaultProcessInstanceEventShouldBeFound("step.notEquals=" + UPDATED_STEP);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByStepIsInShouldWork() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where step in DEFAULT_STEP or UPDATED_STEP
        defaultProcessInstanceEventShouldBeFound("step.in=" + DEFAULT_STEP + "," + UPDATED_STEP);

        // Get all the processInstanceEventList where step equals to UPDATED_STEP
        defaultProcessInstanceEventShouldNotBeFound("step.in=" + UPDATED_STEP);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByStepIsNullOrNotNull() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where step is not null
        defaultProcessInstanceEventShouldBeFound("step.specified=true");

        // Get all the processInstanceEventList where step is null
        defaultProcessInstanceEventShouldNotBeFound("step.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByStepContainsSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where step contains DEFAULT_STEP
        defaultProcessInstanceEventShouldBeFound("step.contains=" + DEFAULT_STEP);

        // Get all the processInstanceEventList where step contains UPDATED_STEP
        defaultProcessInstanceEventShouldNotBeFound("step.contains=" + UPDATED_STEP);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByStepNotContainsSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        // Get all the processInstanceEventList where step does not contain DEFAULT_STEP
        defaultProcessInstanceEventShouldNotBeFound("step.doesNotContain=" + DEFAULT_STEP);

        // Get all the processInstanceEventList where step does not contain UPDATED_STEP
        defaultProcessInstanceEventShouldBeFound("step.doesNotContain=" + UPDATED_STEP);
    }

    @Test
    @Transactional
    void getAllProcessInstanceEventsByProcessInstanceIsEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);
        ProcessInstance processInstance = ProcessInstanceResourceIT.createEntity(em);
        em.persist(processInstance);
        em.flush();
        processInstanceEvent.setProcessInstance(processInstance);
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);
        UUID processInstanceId = processInstance.getId();

        // Get all the processInstanceEventList where processInstance equals to processInstanceId
        defaultProcessInstanceEventShouldBeFound("processInstanceId.equals=" + processInstanceId);

        // Get all the processInstanceEventList where processInstance equals to UUID.randomUUID()
        defaultProcessInstanceEventShouldNotBeFound("processInstanceId.equals=" + UUID.randomUUID());
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultProcessInstanceEventShouldBeFound(String filter) throws Exception {
        restProcessInstanceEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(processInstanceEvent.getId().intValue())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].log").value(hasItem(DEFAULT_LOG.toString())))
            .andExpect(jsonPath("$.[*].step").value(hasItem(DEFAULT_STEP)));

        // Check, that the count call also returns 1
        restProcessInstanceEventMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultProcessInstanceEventShouldNotBeFound(String filter) throws Exception {
        restProcessInstanceEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restProcessInstanceEventMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingProcessInstanceEvent() throws Exception {
        // Get the processInstanceEvent
        restProcessInstanceEventMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProcessInstanceEvent() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        int databaseSizeBeforeUpdate = processInstanceEventRepository.findAll().size();

        // Update the processInstanceEvent
        ProcessInstanceEvent updatedProcessInstanceEvent = processInstanceEventRepository.findById(processInstanceEvent.getId()).get();
        // Disconnect from session so that the updates on updatedProcessInstanceEvent are not directly saved in db
        em.detach(updatedProcessInstanceEvent);
        updatedProcessInstanceEvent.created(UPDATED_CREATED).log(UPDATED_LOG).step(UPDATED_STEP);
        ProcessInstanceEventDTO processInstanceEventDTO = processInstanceEventMapper.toDto(updatedProcessInstanceEvent);

        restProcessInstanceEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, processInstanceEventDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceEventDTO))
            )
            .andExpect(status().isOk());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeUpdate);
        ProcessInstanceEvent testProcessInstanceEvent = processInstanceEventList.get(processInstanceEventList.size() - 1);
        assertThat(testProcessInstanceEvent.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testProcessInstanceEvent.getLog()).isEqualTo(UPDATED_LOG);
        assertThat(testProcessInstanceEvent.getStep()).isEqualTo(UPDATED_STEP);
    }

    @Test
    @Transactional
    void putNonExistingProcessInstanceEvent() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceEventRepository.findAll().size();
        processInstanceEvent.setId(count.incrementAndGet());

        // Create the ProcessInstanceEvent
        ProcessInstanceEventDTO processInstanceEventDTO = processInstanceEventMapper.toDto(processInstanceEvent);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcessInstanceEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, processInstanceEventDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceEventDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProcessInstanceEvent() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceEventRepository.findAll().size();
        processInstanceEvent.setId(count.incrementAndGet());

        // Create the ProcessInstanceEvent
        ProcessInstanceEventDTO processInstanceEventDTO = processInstanceEventMapper.toDto(processInstanceEvent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessInstanceEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceEventDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProcessInstanceEvent() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceEventRepository.findAll().size();
        processInstanceEvent.setId(count.incrementAndGet());

        // Create the ProcessInstanceEvent
        ProcessInstanceEventDTO processInstanceEventDTO = processInstanceEventMapper.toDto(processInstanceEvent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessInstanceEventMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceEventDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProcessInstanceEventWithPatch() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        int databaseSizeBeforeUpdate = processInstanceEventRepository.findAll().size();

        // Update the processInstanceEvent using partial update
        ProcessInstanceEvent partialUpdatedProcessInstanceEvent = new ProcessInstanceEvent();
        partialUpdatedProcessInstanceEvent.setId(processInstanceEvent.getId());

        partialUpdatedProcessInstanceEvent.step(UPDATED_STEP);

        restProcessInstanceEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProcessInstanceEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProcessInstanceEvent))
            )
            .andExpect(status().isOk());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeUpdate);
        ProcessInstanceEvent testProcessInstanceEvent = processInstanceEventList.get(processInstanceEventList.size() - 1);
        assertThat(testProcessInstanceEvent.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testProcessInstanceEvent.getLog()).isEqualTo(DEFAULT_LOG);
        assertThat(testProcessInstanceEvent.getStep()).isEqualTo(UPDATED_STEP);
    }

    @Test
    @Transactional
    void fullUpdateProcessInstanceEventWithPatch() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        int databaseSizeBeforeUpdate = processInstanceEventRepository.findAll().size();

        // Update the processInstanceEvent using partial update
        ProcessInstanceEvent partialUpdatedProcessInstanceEvent = new ProcessInstanceEvent();
        partialUpdatedProcessInstanceEvent.setId(processInstanceEvent.getId());

        partialUpdatedProcessInstanceEvent.created(UPDATED_CREATED).log(UPDATED_LOG).step(UPDATED_STEP);

        restProcessInstanceEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProcessInstanceEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProcessInstanceEvent))
            )
            .andExpect(status().isOk());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeUpdate);
        ProcessInstanceEvent testProcessInstanceEvent = processInstanceEventList.get(processInstanceEventList.size() - 1);
        assertThat(testProcessInstanceEvent.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testProcessInstanceEvent.getLog()).isEqualTo(UPDATED_LOG);
        assertThat(testProcessInstanceEvent.getStep()).isEqualTo(UPDATED_STEP);
    }

    @Test
    @Transactional
    void patchNonExistingProcessInstanceEvent() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceEventRepository.findAll().size();
        processInstanceEvent.setId(count.incrementAndGet());

        // Create the ProcessInstanceEvent
        ProcessInstanceEventDTO processInstanceEventDTO = processInstanceEventMapper.toDto(processInstanceEvent);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcessInstanceEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, processInstanceEventDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceEventDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProcessInstanceEvent() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceEventRepository.findAll().size();
        processInstanceEvent.setId(count.incrementAndGet());

        // Create the ProcessInstanceEvent
        ProcessInstanceEventDTO processInstanceEventDTO = processInstanceEventMapper.toDto(processInstanceEvent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessInstanceEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceEventDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProcessInstanceEvent() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceEventRepository.findAll().size();
        processInstanceEvent.setId(count.incrementAndGet());

        // Create the ProcessInstanceEvent
        ProcessInstanceEventDTO processInstanceEventDTO = processInstanceEventMapper.toDto(processInstanceEvent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessInstanceEventMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceEventDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProcessInstanceEvent in the database
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProcessInstanceEvent() throws Exception {
        // Initialize the database
        processInstanceEventRepository.saveAndFlush(processInstanceEvent);

        int databaseSizeBeforeDelete = processInstanceEventRepository.findAll().size();

        // Delete the processInstanceEvent
        restProcessInstanceEventMockMvc
            .perform(delete(ENTITY_API_URL_ID, processInstanceEvent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProcessInstanceEvent> processInstanceEventList = processInstanceEventRepository.findAll();
        assertThat(processInstanceEventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

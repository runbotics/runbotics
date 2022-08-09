package com.runbotics.web.rest;

import static com.runbotics.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.runbotics.IntegrationTest;
import com.runbotics.domain.Bot;
import com.runbotics.domain.Process;
import com.runbotics.domain.ProcessInstance;
import com.runbotics.repository.ProcessInstanceRepository;
import com.runbotics.service.criteria.ProcessInstanceCriteria;
import com.runbotics.service.dto.ProcessInstanceDTO;
import com.runbotics.service.mapper.ProcessInstanceMapper;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
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
 * Integration tests for the {@link ProcessInstanceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProcessInstanceResourceIT {

    private static final String DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID = "AAAAAAAAAA";
    private static final String UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final ZonedDateTime DEFAULT_UPDATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_UPDATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final String DEFAULT_INPUT = "AAAAAAAAAA";
    private static final String UPDATED_INPUT = "BBBBBBBBBB";

    private static final String DEFAULT_OUTPUT = "AAAAAAAAAA";
    private static final String UPDATED_OUTPUT = "BBBBBBBBBB";

    private static final String DEFAULT_STEP = "AAAAAAAAAA";
    private static final String UPDATED_STEP = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/process-instances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ProcessInstanceRepository processInstanceRepository;

    @Autowired
    private ProcessInstanceMapper processInstanceMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProcessInstanceMockMvc;

    private ProcessInstance processInstance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProcessInstance createEntity(EntityManager em) {
        ProcessInstance processInstance = new ProcessInstance()
            .orchestratorProcessInstanceId(DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID)
            .status(DEFAULT_STATUS)
            .created(DEFAULT_CREATED)
            .updated(DEFAULT_UPDATED)
            .input(DEFAULT_INPUT)
            .output(DEFAULT_OUTPUT)
            .step(DEFAULT_STEP);
        // Add required entity
        Process process;
        if (TestUtil.findAll(em, Process.class).isEmpty()) {
            process = ProcessResourceIT.createEntity(em);
            em.persist(process);
            em.flush();
        } else {
            process = TestUtil.findAll(em, Process.class).get(0);
        }
        processInstance.setProcess(process);
        // Add required entity
        Bot bot;
        if (TestUtil.findAll(em, Bot.class).isEmpty()) {
            bot = BotResourceIT.createEntity(em);
            em.persist(bot);
            em.flush();
        } else {
            bot = TestUtil.findAll(em, Bot.class).get(0);
        }
        processInstance.setBot(bot);
        return processInstance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProcessInstance createUpdatedEntity(EntityManager em) {
        ProcessInstance processInstance = new ProcessInstance()
            .orchestratorProcessInstanceId(UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID)
            .status(UPDATED_STATUS)
            .created(UPDATED_CREATED)
            .updated(UPDATED_UPDATED)
            .input(UPDATED_INPUT)
            .output(UPDATED_OUTPUT)
            .step(UPDATED_STEP);
        // Add required entity
        Process process;
        if (TestUtil.findAll(em, Process.class).isEmpty()) {
            process = ProcessResourceIT.createUpdatedEntity(em);
            em.persist(process);
            em.flush();
        } else {
            process = TestUtil.findAll(em, Process.class).get(0);
        }
        processInstance.setProcess(process);
        // Add required entity
        Bot bot;
        if (TestUtil.findAll(em, Bot.class).isEmpty()) {
            bot = BotResourceIT.createUpdatedEntity(em);
            em.persist(bot);
            em.flush();
        } else {
            bot = TestUtil.findAll(em, Bot.class).get(0);
        }
        processInstance.setBot(bot);
        return processInstance;
    }

    @BeforeEach
    public void initTest() {
        processInstance = createEntity(em);
    }

    @Test
    @Transactional
    void createProcessInstance() throws Exception {
        int databaseSizeBeforeCreate = processInstanceRepository.findAll().size();
        // Create the ProcessInstance
        ProcessInstanceDTO processInstanceDTO = processInstanceMapper.toDto(processInstance);
        restProcessInstanceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(processInstanceDTO))
            )
            .andExpect(status().isCreated());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeCreate + 1);
        ProcessInstance testProcessInstance = processInstanceList.get(processInstanceList.size() - 1);
        assertThat(testProcessInstance.getOrchestratorProcessInstanceId()).isEqualTo(DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID);
        assertThat(testProcessInstance.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testProcessInstance.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testProcessInstance.getUpdated()).isEqualTo(DEFAULT_UPDATED);
        assertThat(testProcessInstance.getInput()).isEqualTo(DEFAULT_INPUT);
        assertThat(testProcessInstance.getOutput()).isEqualTo(DEFAULT_OUTPUT);
        assertThat(testProcessInstance.getStep()).isEqualTo(DEFAULT_STEP);
    }

    @Test
    @Transactional
    void createProcessInstanceWithExistingId() throws Exception {
        // Create the ProcessInstance with an existing ID
        processInstanceRepository.saveAndFlush(processInstance);
        ProcessInstanceDTO processInstanceDTO = processInstanceMapper.toDto(processInstance);

        int databaseSizeBeforeCreate = processInstanceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProcessInstanceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(processInstanceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProcessInstances() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList
        restProcessInstanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(processInstance.getId().toString())))
            .andExpect(jsonPath("$.[*].orchestratorProcessInstanceId").value(hasItem(DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].updated").value(hasItem(sameInstant(DEFAULT_UPDATED))))
            .andExpect(jsonPath("$.[*].input").value(hasItem(DEFAULT_INPUT.toString())))
            .andExpect(jsonPath("$.[*].output").value(hasItem(DEFAULT_OUTPUT.toString())))
            .andExpect(jsonPath("$.[*].step").value(hasItem(DEFAULT_STEP)));
    }

    @Test
    @Transactional
    void getProcessInstance() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get the processInstance
        restProcessInstanceMockMvc
            .perform(get(ENTITY_API_URL_ID, processInstance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(processInstance.getId().toString()))
            .andExpect(jsonPath("$.orchestratorProcessInstanceId").value(DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.updated").value(sameInstant(DEFAULT_UPDATED)))
            .andExpect(jsonPath("$.input").value(DEFAULT_INPUT.toString()))
            .andExpect(jsonPath("$.output").value(DEFAULT_OUTPUT.toString()))
            .andExpect(jsonPath("$.step").value(DEFAULT_STEP));
    }

    @Test
    @Transactional
    void getProcessInstancesByIdFiltering() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        UUID id = processInstance.getId();

        defaultProcessInstanceShouldBeFound("id.equals=" + id);
        defaultProcessInstanceShouldNotBeFound("id.notEquals=" + id);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByOrchestratorProcessInstanceIdIsEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where orchestratorProcessInstanceId equals to DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID
        defaultProcessInstanceShouldBeFound("orchestratorProcessInstanceId.equals=" + DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID);

        // Get all the processInstanceList where orchestratorProcessInstanceId equals to UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID
        defaultProcessInstanceShouldNotBeFound("orchestratorProcessInstanceId.equals=" + UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByOrchestratorProcessInstanceIdIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where orchestratorProcessInstanceId not equals to DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID
        defaultProcessInstanceShouldNotBeFound("orchestratorProcessInstanceId.notEquals=" + DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID);

        // Get all the processInstanceList where orchestratorProcessInstanceId not equals to UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID
        defaultProcessInstanceShouldBeFound("orchestratorProcessInstanceId.notEquals=" + UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByOrchestratorProcessInstanceIdIsInShouldWork() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where orchestratorProcessInstanceId in DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID or UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID
        defaultProcessInstanceShouldBeFound(
            "orchestratorProcessInstanceId.in=" + DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID + "," + UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID
        );

        // Get all the processInstanceList where orchestratorProcessInstanceId equals to UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID
        defaultProcessInstanceShouldNotBeFound("orchestratorProcessInstanceId.in=" + UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByOrchestratorProcessInstanceIdIsNullOrNotNull() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where orchestratorProcessInstanceId is not null
        defaultProcessInstanceShouldBeFound("orchestratorProcessInstanceId.specified=true");

        // Get all the processInstanceList where orchestratorProcessInstanceId is null
        defaultProcessInstanceShouldNotBeFound("orchestratorProcessInstanceId.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessInstancesByOrchestratorProcessInstanceIdContainsSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where orchestratorProcessInstanceId contains DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID
        defaultProcessInstanceShouldBeFound("orchestratorProcessInstanceId.contains=" + DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID);

        // Get all the processInstanceList where orchestratorProcessInstanceId contains UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID
        defaultProcessInstanceShouldNotBeFound("orchestratorProcessInstanceId.contains=" + UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByOrchestratorProcessInstanceIdNotContainsSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where orchestratorProcessInstanceId does not contain DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID
        defaultProcessInstanceShouldNotBeFound("orchestratorProcessInstanceId.doesNotContain=" + DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID);

        // Get all the processInstanceList where orchestratorProcessInstanceId does not contain UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID
        defaultProcessInstanceShouldBeFound("orchestratorProcessInstanceId.doesNotContain=" + UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStatusIsEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where status equals to DEFAULT_STATUS
        defaultProcessInstanceShouldBeFound("status.equals=" + DEFAULT_STATUS);

        // Get all the processInstanceList where status equals to UPDATED_STATUS
        defaultProcessInstanceShouldNotBeFound("status.equals=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStatusIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where status not equals to DEFAULT_STATUS
        defaultProcessInstanceShouldNotBeFound("status.notEquals=" + DEFAULT_STATUS);

        // Get all the processInstanceList where status not equals to UPDATED_STATUS
        defaultProcessInstanceShouldBeFound("status.notEquals=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStatusIsInShouldWork() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where status in DEFAULT_STATUS or UPDATED_STATUS
        defaultProcessInstanceShouldBeFound("status.in=" + DEFAULT_STATUS + "," + UPDATED_STATUS);

        // Get all the processInstanceList where status equals to UPDATED_STATUS
        defaultProcessInstanceShouldNotBeFound("status.in=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStatusIsNullOrNotNull() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where status is not null
        defaultProcessInstanceShouldBeFound("status.specified=true");

        // Get all the processInstanceList where status is null
        defaultProcessInstanceShouldNotBeFound("status.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStatusContainsSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where status contains DEFAULT_STATUS
        defaultProcessInstanceShouldBeFound("status.contains=" + DEFAULT_STATUS);

        // Get all the processInstanceList where status contains UPDATED_STATUS
        defaultProcessInstanceShouldNotBeFound("status.contains=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStatusNotContainsSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where status does not contain DEFAULT_STATUS
        defaultProcessInstanceShouldNotBeFound("status.doesNotContain=" + DEFAULT_STATUS);

        // Get all the processInstanceList where status does not contain UPDATED_STATUS
        defaultProcessInstanceShouldBeFound("status.doesNotContain=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByCreatedIsEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where created equals to DEFAULT_CREATED
        defaultProcessInstanceShouldBeFound("created.equals=" + DEFAULT_CREATED);

        // Get all the processInstanceList where created equals to UPDATED_CREATED
        defaultProcessInstanceShouldNotBeFound("created.equals=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByCreatedIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where created not equals to DEFAULT_CREATED
        defaultProcessInstanceShouldNotBeFound("created.notEquals=" + DEFAULT_CREATED);

        // Get all the processInstanceList where created not equals to UPDATED_CREATED
        defaultProcessInstanceShouldBeFound("created.notEquals=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByCreatedIsInShouldWork() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where created in DEFAULT_CREATED or UPDATED_CREATED
        defaultProcessInstanceShouldBeFound("created.in=" + DEFAULT_CREATED + "," + UPDATED_CREATED);

        // Get all the processInstanceList where created equals to UPDATED_CREATED
        defaultProcessInstanceShouldNotBeFound("created.in=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByCreatedIsNullOrNotNull() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where created is not null
        defaultProcessInstanceShouldBeFound("created.specified=true");

        // Get all the processInstanceList where created is null
        defaultProcessInstanceShouldNotBeFound("created.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessInstancesByCreatedIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where created is greater than or equal to DEFAULT_CREATED
        defaultProcessInstanceShouldBeFound("created.greaterThanOrEqual=" + DEFAULT_CREATED);

        // Get all the processInstanceList where created is greater than or equal to UPDATED_CREATED
        defaultProcessInstanceShouldNotBeFound("created.greaterThanOrEqual=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByCreatedIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where created is less than or equal to DEFAULT_CREATED
        defaultProcessInstanceShouldBeFound("created.lessThanOrEqual=" + DEFAULT_CREATED);

        // Get all the processInstanceList where created is less than or equal to SMALLER_CREATED
        defaultProcessInstanceShouldNotBeFound("created.lessThanOrEqual=" + SMALLER_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByCreatedIsLessThanSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where created is less than DEFAULT_CREATED
        defaultProcessInstanceShouldNotBeFound("created.lessThan=" + DEFAULT_CREATED);

        // Get all the processInstanceList where created is less than UPDATED_CREATED
        defaultProcessInstanceShouldBeFound("created.lessThan=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByCreatedIsGreaterThanSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where created is greater than DEFAULT_CREATED
        defaultProcessInstanceShouldNotBeFound("created.greaterThan=" + DEFAULT_CREATED);

        // Get all the processInstanceList where created is greater than SMALLER_CREATED
        defaultProcessInstanceShouldBeFound("created.greaterThan=" + SMALLER_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByUpdatedIsEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where updated equals to DEFAULT_UPDATED
        defaultProcessInstanceShouldBeFound("updated.equals=" + DEFAULT_UPDATED);

        // Get all the processInstanceList where updated equals to UPDATED_UPDATED
        defaultProcessInstanceShouldNotBeFound("updated.equals=" + UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByUpdatedIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where updated not equals to DEFAULT_UPDATED
        defaultProcessInstanceShouldNotBeFound("updated.notEquals=" + DEFAULT_UPDATED);

        // Get all the processInstanceList where updated not equals to UPDATED_UPDATED
        defaultProcessInstanceShouldBeFound("updated.notEquals=" + UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByUpdatedIsInShouldWork() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where updated in DEFAULT_UPDATED or UPDATED_UPDATED
        defaultProcessInstanceShouldBeFound("updated.in=" + DEFAULT_UPDATED + "," + UPDATED_UPDATED);

        // Get all the processInstanceList where updated equals to UPDATED_UPDATED
        defaultProcessInstanceShouldNotBeFound("updated.in=" + UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByUpdatedIsNullOrNotNull() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where updated is not null
        defaultProcessInstanceShouldBeFound("updated.specified=true");

        // Get all the processInstanceList where updated is null
        defaultProcessInstanceShouldNotBeFound("updated.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessInstancesByUpdatedIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where updated is greater than or equal to DEFAULT_UPDATED
        defaultProcessInstanceShouldBeFound("updated.greaterThanOrEqual=" + DEFAULT_UPDATED);

        // Get all the processInstanceList where updated is greater than or equal to UPDATED_UPDATED
        defaultProcessInstanceShouldNotBeFound("updated.greaterThanOrEqual=" + UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByUpdatedIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where updated is less than or equal to DEFAULT_UPDATED
        defaultProcessInstanceShouldBeFound("updated.lessThanOrEqual=" + DEFAULT_UPDATED);

        // Get all the processInstanceList where updated is less than or equal to SMALLER_UPDATED
        defaultProcessInstanceShouldNotBeFound("updated.lessThanOrEqual=" + SMALLER_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByUpdatedIsLessThanSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where updated is less than DEFAULT_UPDATED
        defaultProcessInstanceShouldNotBeFound("updated.lessThan=" + DEFAULT_UPDATED);

        // Get all the processInstanceList where updated is less than UPDATED_UPDATED
        defaultProcessInstanceShouldBeFound("updated.lessThan=" + UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByUpdatedIsGreaterThanSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where updated is greater than DEFAULT_UPDATED
        defaultProcessInstanceShouldNotBeFound("updated.greaterThan=" + DEFAULT_UPDATED);

        // Get all the processInstanceList where updated is greater than SMALLER_UPDATED
        defaultProcessInstanceShouldBeFound("updated.greaterThan=" + SMALLER_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStepIsEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where step equals to DEFAULT_STEP
        defaultProcessInstanceShouldBeFound("step.equals=" + DEFAULT_STEP);

        // Get all the processInstanceList where step equals to UPDATED_STEP
        defaultProcessInstanceShouldNotBeFound("step.equals=" + UPDATED_STEP);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStepIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where step not equals to DEFAULT_STEP
        defaultProcessInstanceShouldNotBeFound("step.notEquals=" + DEFAULT_STEP);

        // Get all the processInstanceList where step not equals to UPDATED_STEP
        defaultProcessInstanceShouldBeFound("step.notEquals=" + UPDATED_STEP);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStepIsInShouldWork() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where step in DEFAULT_STEP or UPDATED_STEP
        defaultProcessInstanceShouldBeFound("step.in=" + DEFAULT_STEP + "," + UPDATED_STEP);

        // Get all the processInstanceList where step equals to UPDATED_STEP
        defaultProcessInstanceShouldNotBeFound("step.in=" + UPDATED_STEP);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStepIsNullOrNotNull() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where step is not null
        defaultProcessInstanceShouldBeFound("step.specified=true");

        // Get all the processInstanceList where step is null
        defaultProcessInstanceShouldNotBeFound("step.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStepContainsSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where step contains DEFAULT_STEP
        defaultProcessInstanceShouldBeFound("step.contains=" + DEFAULT_STEP);

        // Get all the processInstanceList where step contains UPDATED_STEP
        defaultProcessInstanceShouldNotBeFound("step.contains=" + UPDATED_STEP);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByStepNotContainsSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        // Get all the processInstanceList where step does not contain DEFAULT_STEP
        defaultProcessInstanceShouldNotBeFound("step.doesNotContain=" + DEFAULT_STEP);

        // Get all the processInstanceList where step does not contain UPDATED_STEP
        defaultProcessInstanceShouldBeFound("step.doesNotContain=" + UPDATED_STEP);
    }

    @Test
    @Transactional
    void getAllProcessInstancesByProcessIsEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);
        Process process = ProcessResourceIT.createEntity(em);
        em.persist(process);
        em.flush();
        processInstance.setProcess(process);
        processInstanceRepository.saveAndFlush(processInstance);
        Long processId = process.getId();

        // Get all the processInstanceList where process equals to processId
        defaultProcessInstanceShouldBeFound("processId.equals=" + processId);

        // Get all the processInstanceList where process equals to (processId + 1)
        defaultProcessInstanceShouldNotBeFound("processId.equals=" + (processId + 1));
    }

    @Test
    @Transactional
    void getAllProcessInstancesByBotIsEqualToSomething() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);
        Bot bot = BotResourceIT.createEntity(em);
        em.persist(bot);
        em.flush();
        processInstance.setBot(bot);
        processInstanceRepository.saveAndFlush(processInstance);
        Long botId = bot.getId();

        // Get all the processInstanceList where bot equals to botId
        defaultProcessInstanceShouldBeFound("botId.equals=" + botId);

        // Get all the processInstanceList where bot equals to (botId + 1)
        defaultProcessInstanceShouldNotBeFound("botId.equals=" + (botId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultProcessInstanceShouldBeFound(String filter) throws Exception {
        restProcessInstanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(processInstance.getId().toString())))
            .andExpect(jsonPath("$.[*].orchestratorProcessInstanceId").value(hasItem(DEFAULT_ORCHESTRATOR_PROCESS_INSTANCE_ID)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].updated").value(hasItem(sameInstant(DEFAULT_UPDATED))))
            .andExpect(jsonPath("$.[*].input").value(hasItem(DEFAULT_INPUT.toString())))
            .andExpect(jsonPath("$.[*].output").value(hasItem(DEFAULT_OUTPUT.toString())))
            .andExpect(jsonPath("$.[*].step").value(hasItem(DEFAULT_STEP)));

        // Check, that the count call also returns 1
        restProcessInstanceMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultProcessInstanceShouldNotBeFound(String filter) throws Exception {
        restProcessInstanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restProcessInstanceMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingProcessInstance() throws Exception {
        // Get the processInstance
        restProcessInstanceMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProcessInstance() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        int databaseSizeBeforeUpdate = processInstanceRepository.findAll().size();

        // Update the processInstance
        ProcessInstance updatedProcessInstance = processInstanceRepository.findById(processInstance.getId()).get();
        // Disconnect from session so that the updates on updatedProcessInstance are not directly saved in db
        em.detach(updatedProcessInstance);
        updatedProcessInstance
            .orchestratorProcessInstanceId(UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID)
            .status(UPDATED_STATUS)
            .created(UPDATED_CREATED)
            .updated(UPDATED_UPDATED)
            .input(UPDATED_INPUT)
            .output(UPDATED_OUTPUT)
            .step(UPDATED_STEP);
        ProcessInstanceDTO processInstanceDTO = processInstanceMapper.toDto(updatedProcessInstance);

        restProcessInstanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, processInstanceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceDTO))
            )
            .andExpect(status().isOk());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeUpdate);
        ProcessInstance testProcessInstance = processInstanceList.get(processInstanceList.size() - 1);
        assertThat(testProcessInstance.getOrchestratorProcessInstanceId()).isEqualTo(UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID);
        assertThat(testProcessInstance.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testProcessInstance.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testProcessInstance.getUpdated()).isEqualTo(UPDATED_UPDATED);
        assertThat(testProcessInstance.getInput()).isEqualTo(UPDATED_INPUT);
        assertThat(testProcessInstance.getOutput()).isEqualTo(UPDATED_OUTPUT);
        assertThat(testProcessInstance.getStep()).isEqualTo(UPDATED_STEP);
    }

    @Test
    @Transactional
    void putNonExistingProcessInstance() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceRepository.findAll().size();
        processInstance.setId(UUID.randomUUID());

        // Create the ProcessInstance
        ProcessInstanceDTO processInstanceDTO = processInstanceMapper.toDto(processInstance);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcessInstanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, processInstanceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProcessInstance() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceRepository.findAll().size();
        processInstance.setId(UUID.randomUUID());

        // Create the ProcessInstance
        ProcessInstanceDTO processInstanceDTO = processInstanceMapper.toDto(processInstance);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessInstanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProcessInstance() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceRepository.findAll().size();
        processInstance.setId(UUID.randomUUID());

        // Create the ProcessInstance
        ProcessInstanceDTO processInstanceDTO = processInstanceMapper.toDto(processInstance);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessInstanceMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(processInstanceDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProcessInstanceWithPatch() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        int databaseSizeBeforeUpdate = processInstanceRepository.findAll().size();

        // Update the processInstance using partial update
        ProcessInstance partialUpdatedProcessInstance = new ProcessInstance();
        partialUpdatedProcessInstance.setId(processInstance.getId());

        partialUpdatedProcessInstance
            .orchestratorProcessInstanceId(UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID)
            .created(UPDATED_CREATED)
            .updated(UPDATED_UPDATED)
            .input(UPDATED_INPUT)
            .output(UPDATED_OUTPUT)
            .step(UPDATED_STEP);

        restProcessInstanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProcessInstance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProcessInstance))
            )
            .andExpect(status().isOk());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeUpdate);
        ProcessInstance testProcessInstance = processInstanceList.get(processInstanceList.size() - 1);
        assertThat(testProcessInstance.getOrchestratorProcessInstanceId()).isEqualTo(UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID);
        assertThat(testProcessInstance.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testProcessInstance.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testProcessInstance.getUpdated()).isEqualTo(UPDATED_UPDATED);
        assertThat(testProcessInstance.getInput()).isEqualTo(UPDATED_INPUT);
        assertThat(testProcessInstance.getOutput()).isEqualTo(UPDATED_OUTPUT);
        assertThat(testProcessInstance.getStep()).isEqualTo(UPDATED_STEP);
    }

    @Test
    @Transactional
    void fullUpdateProcessInstanceWithPatch() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        int databaseSizeBeforeUpdate = processInstanceRepository.findAll().size();

        // Update the processInstance using partial update
        ProcessInstance partialUpdatedProcessInstance = new ProcessInstance();
        partialUpdatedProcessInstance.setId(processInstance.getId());

        partialUpdatedProcessInstance
            .orchestratorProcessInstanceId(UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID)
            .status(UPDATED_STATUS)
            .created(UPDATED_CREATED)
            .updated(UPDATED_UPDATED)
            .input(UPDATED_INPUT)
            .output(UPDATED_OUTPUT)
            .step(UPDATED_STEP);

        restProcessInstanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProcessInstance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProcessInstance))
            )
            .andExpect(status().isOk());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeUpdate);
        ProcessInstance testProcessInstance = processInstanceList.get(processInstanceList.size() - 1);
        assertThat(testProcessInstance.getOrchestratorProcessInstanceId()).isEqualTo(UPDATED_ORCHESTRATOR_PROCESS_INSTANCE_ID);
        assertThat(testProcessInstance.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testProcessInstance.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testProcessInstance.getUpdated()).isEqualTo(UPDATED_UPDATED);
        assertThat(testProcessInstance.getInput()).isEqualTo(UPDATED_INPUT);
        assertThat(testProcessInstance.getOutput()).isEqualTo(UPDATED_OUTPUT);
        assertThat(testProcessInstance.getStep()).isEqualTo(UPDATED_STEP);
    }

    @Test
    @Transactional
    void patchNonExistingProcessInstance() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceRepository.findAll().size();
        processInstance.setId(UUID.randomUUID());

        // Create the ProcessInstance
        ProcessInstanceDTO processInstanceDTO = processInstanceMapper.toDto(processInstance);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcessInstanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, processInstanceDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProcessInstance() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceRepository.findAll().size();
        processInstance.setId(UUID.randomUUID());

        // Create the ProcessInstance
        ProcessInstanceDTO processInstanceDTO = processInstanceMapper.toDto(processInstance);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessInstanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProcessInstance() throws Exception {
        int databaseSizeBeforeUpdate = processInstanceRepository.findAll().size();
        processInstance.setId(UUID.randomUUID());

        // Create the ProcessInstance
        ProcessInstanceDTO processInstanceDTO = processInstanceMapper.toDto(processInstance);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessInstanceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(processInstanceDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProcessInstance in the database
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProcessInstance() throws Exception {
        // Initialize the database
        processInstanceRepository.saveAndFlush(processInstance);

        int databaseSizeBeforeDelete = processInstanceRepository.findAll().size();

        // Delete the processInstance
        restProcessInstanceMockMvc
            .perform(delete(ENTITY_API_URL_ID, processInstance.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProcessInstance> processInstanceList = processInstanceRepository.findAll();
        assertThat(processInstanceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

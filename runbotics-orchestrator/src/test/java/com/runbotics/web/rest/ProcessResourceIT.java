package com.runbotics.web.rest;

import static com.runbotics.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.runbotics.IntegrationTest;
import com.runbotics.domain.Process;
import com.runbotics.domain.User;
import com.runbotics.repository.ProcessRepository;
import com.runbotics.service.criteria.ProcessCriteria;
import com.runbotics.service.dto.ProcessDTO;
import com.runbotics.service.mapper.ProcessMapper;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ProcessResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProcessResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_DEFINITION = "AAAAAAAAAA";
    private static final String UPDATED_DEFINITION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_PUBLIC = false;
    private static final Boolean UPDATED_IS_PUBLIC = true;

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final ZonedDateTime DEFAULT_UPDATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_UPDATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final Long DEFAULT_EXECUTIONS_COUNT = 1L;
    private static final Long UPDATED_EXECUTIONS_COUNT = 2L;
    private static final Long SMALLER_EXECUTIONS_COUNT = 1L - 1L;

    private static final Long DEFAULT_SUCCESS_EXECUTIONS_COUNT = 1L;
    private static final Long UPDATED_SUCCESS_EXECUTIONS_COUNT = 2L;
    private static final Long SMALLER_SUCCESS_EXECUTIONS_COUNT = 1L - 1L;

    private static final Long DEFAULT_FAILURE_EXECUTIONS_COUNT = 1L;
    private static final Long UPDATED_FAILURE_EXECUTIONS_COUNT = 2L;
    private static final Long SMALLER_FAILURE_EXECUTIONS_COUNT = 1L - 1L;

    private static final String ENTITY_API_URL = "/api/processes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProcessRepository processRepository;

    @Autowired
    private ProcessMapper processMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProcessMockMvc;

    private Process process;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Process createEntity(EntityManager em) {
        Process process = new Process()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .definition(DEFAULT_DEFINITION)
            .isPublic(DEFAULT_IS_PUBLIC)
            .created(DEFAULT_CREATED)
            .updated(DEFAULT_UPDATED)
            .executionsCount(DEFAULT_EXECUTIONS_COUNT)
            .successExecutionsCount(DEFAULT_SUCCESS_EXECUTIONS_COUNT)
            .failureExecutionsCount(DEFAULT_FAILURE_EXECUTIONS_COUNT);
        return process;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Process createUpdatedEntity(EntityManager em) {
        Process process = new Process()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .definition(UPDATED_DEFINITION)
            .isPublic(UPDATED_IS_PUBLIC)
            .created(UPDATED_CREATED)
            .updated(UPDATED_UPDATED)
            .executionsCount(UPDATED_EXECUTIONS_COUNT)
            .successExecutionsCount(UPDATED_SUCCESS_EXECUTIONS_COUNT)
            .failureExecutionsCount(UPDATED_FAILURE_EXECUTIONS_COUNT);
        return process;
    }

    @BeforeEach
    public void initTest() {
        process = createEntity(em);
    }

    @Test
    @Transactional
    void createProcess() throws Exception {
        int databaseSizeBeforeCreate = processRepository.findAll().size();
        // Create the Process
        ProcessDTO processDTO = processMapper.toDto(process);
        restProcessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(processDTO)))
            .andExpect(status().isCreated());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeCreate + 1);
        Process testProcess = processList.get(processList.size() - 1);
        assertThat(testProcess.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProcess.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProcess.getDefinition()).isEqualTo(DEFAULT_DEFINITION);
        assertThat(testProcess.getIsPublic()).isEqualTo(DEFAULT_IS_PUBLIC);
        assertThat(testProcess.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testProcess.getUpdated()).isEqualTo(DEFAULT_UPDATED);
        assertThat(testProcess.getExecutionsCount()).isEqualTo(DEFAULT_EXECUTIONS_COUNT);
        assertThat(testProcess.getSuccessExecutionsCount()).isEqualTo(DEFAULT_SUCCESS_EXECUTIONS_COUNT);
        assertThat(testProcess.getFailureExecutionsCount()).isEqualTo(DEFAULT_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void createProcessWithExistingId() throws Exception {
        // Create the Process with an existing ID
        process.setId(1L);
        ProcessDTO processDTO = processMapper.toDto(process);

        int databaseSizeBeforeCreate = processRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProcessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(processDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = processRepository.findAll().size();
        // set the field null
        process.setName(null);

        // Create the Process, which fails.
        ProcessDTO processDTO = processMapper.toDto(process);

        restProcessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(processDTO)))
            .andExpect(status().isBadRequest());

        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProcesses() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList
        restProcessMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(process.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].definition").value(hasItem(DEFAULT_DEFINITION.toString())))
            .andExpect(jsonPath("$.[*].isPublic").value(hasItem(DEFAULT_IS_PUBLIC.booleanValue())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].updated").value(hasItem(sameInstant(DEFAULT_UPDATED))))
            .andExpect(jsonPath("$.[*].executionsCount").value(hasItem(DEFAULT_EXECUTIONS_COUNT.intValue())))
            .andExpect(jsonPath("$.[*].successExecutionsCount").value(hasItem(DEFAULT_SUCCESS_EXECUTIONS_COUNT.intValue())))
            .andExpect(jsonPath("$.[*].failureExecutionsCount").value(hasItem(DEFAULT_FAILURE_EXECUTIONS_COUNT.intValue())));
    }

    @Test
    @Transactional
    void getProcess() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get the process
        restProcessMockMvc
            .perform(get(ENTITY_API_URL_ID, process.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(process.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.definition").value(DEFAULT_DEFINITION.toString()))
            .andExpect(jsonPath("$.isPublic").value(DEFAULT_IS_PUBLIC.booleanValue()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.updated").value(sameInstant(DEFAULT_UPDATED)))
            .andExpect(jsonPath("$.executionsCount").value(DEFAULT_EXECUTIONS_COUNT.intValue()))
            .andExpect(jsonPath("$.successExecutionsCount").value(DEFAULT_SUCCESS_EXECUTIONS_COUNT.intValue()))
            .andExpect(jsonPath("$.failureExecutionsCount").value(DEFAULT_FAILURE_EXECUTIONS_COUNT.intValue()));
    }

    @Test
    @Transactional
    void getProcessesByIdFiltering() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        Long id = process.getId();

        defaultProcessShouldBeFound("id.equals=" + id);
        defaultProcessShouldNotBeFound("id.notEquals=" + id);

        defaultProcessShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultProcessShouldNotBeFound("id.greaterThan=" + id);

        defaultProcessShouldBeFound("id.lessThanOrEqual=" + id);
        defaultProcessShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllProcessesByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where name equals to DEFAULT_NAME
        defaultProcessShouldBeFound("name.equals=" + DEFAULT_NAME);

        // Get all the processList where name equals to UPDATED_NAME
        defaultProcessShouldNotBeFound("name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllProcessesByNameIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where name not equals to DEFAULT_NAME
        defaultProcessShouldNotBeFound("name.notEquals=" + DEFAULT_NAME);

        // Get all the processList where name not equals to UPDATED_NAME
        defaultProcessShouldBeFound("name.notEquals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllProcessesByNameIsInShouldWork() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where name in DEFAULT_NAME or UPDATED_NAME
        defaultProcessShouldBeFound("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME);

        // Get all the processList where name equals to UPDATED_NAME
        defaultProcessShouldNotBeFound("name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllProcessesByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where name is not null
        defaultProcessShouldBeFound("name.specified=true");

        // Get all the processList where name is null
        defaultProcessShouldNotBeFound("name.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessesByNameContainsSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where name contains DEFAULT_NAME
        defaultProcessShouldBeFound("name.contains=" + DEFAULT_NAME);

        // Get all the processList where name contains UPDATED_NAME
        defaultProcessShouldNotBeFound("name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllProcessesByNameNotContainsSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where name does not contain DEFAULT_NAME
        defaultProcessShouldNotBeFound("name.doesNotContain=" + DEFAULT_NAME);

        // Get all the processList where name does not contain UPDATED_NAME
        defaultProcessShouldBeFound("name.doesNotContain=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllProcessesByIsPublicIsEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where isPublic equals to DEFAULT_IS_PUBLIC
        defaultProcessShouldBeFound("isPublic.equals=" + DEFAULT_IS_PUBLIC);

        // Get all the processList where isPublic equals to UPDATED_IS_PUBLIC
        defaultProcessShouldNotBeFound("isPublic.equals=" + UPDATED_IS_PUBLIC);
    }

    @Test
    @Transactional
    void getAllProcessesByIsPublicIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where isPublic not equals to DEFAULT_IS_PUBLIC
        defaultProcessShouldNotBeFound("isPublic.notEquals=" + DEFAULT_IS_PUBLIC);

        // Get all the processList where isPublic not equals to UPDATED_IS_PUBLIC
        defaultProcessShouldBeFound("isPublic.notEquals=" + UPDATED_IS_PUBLIC);
    }

    @Test
    @Transactional
    void getAllProcessesByIsPublicIsInShouldWork() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where isPublic in DEFAULT_IS_PUBLIC or UPDATED_IS_PUBLIC
        defaultProcessShouldBeFound("isPublic.in=" + DEFAULT_IS_PUBLIC + "," + UPDATED_IS_PUBLIC);

        // Get all the processList where isPublic equals to UPDATED_IS_PUBLIC
        defaultProcessShouldNotBeFound("isPublic.in=" + UPDATED_IS_PUBLIC);
    }

    @Test
    @Transactional
    void getAllProcessesByIsPublicIsNullOrNotNull() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where isPublic is not null
        defaultProcessShouldBeFound("isPublic.specified=true");

        // Get all the processList where isPublic is null
        defaultProcessShouldNotBeFound("isPublic.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessesByCreatedIsEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where created equals to DEFAULT_CREATED
        defaultProcessShouldBeFound("created.equals=" + DEFAULT_CREATED);

        // Get all the processList where created equals to UPDATED_CREATED
        defaultProcessShouldNotBeFound("created.equals=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessesByCreatedIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where created not equals to DEFAULT_CREATED
        defaultProcessShouldNotBeFound("created.notEquals=" + DEFAULT_CREATED);

        // Get all the processList where created not equals to UPDATED_CREATED
        defaultProcessShouldBeFound("created.notEquals=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessesByCreatedIsInShouldWork() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where created in DEFAULT_CREATED or UPDATED_CREATED
        defaultProcessShouldBeFound("created.in=" + DEFAULT_CREATED + "," + UPDATED_CREATED);

        // Get all the processList where created equals to UPDATED_CREATED
        defaultProcessShouldNotBeFound("created.in=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessesByCreatedIsNullOrNotNull() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where created is not null
        defaultProcessShouldBeFound("created.specified=true");

        // Get all the processList where created is null
        defaultProcessShouldNotBeFound("created.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessesByCreatedIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where created is greater than or equal to DEFAULT_CREATED
        defaultProcessShouldBeFound("created.greaterThanOrEqual=" + DEFAULT_CREATED);

        // Get all the processList where created is greater than or equal to UPDATED_CREATED
        defaultProcessShouldNotBeFound("created.greaterThanOrEqual=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessesByCreatedIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where created is less than or equal to DEFAULT_CREATED
        defaultProcessShouldBeFound("created.lessThanOrEqual=" + DEFAULT_CREATED);

        // Get all the processList where created is less than or equal to SMALLER_CREATED
        defaultProcessShouldNotBeFound("created.lessThanOrEqual=" + SMALLER_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessesByCreatedIsLessThanSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where created is less than DEFAULT_CREATED
        defaultProcessShouldNotBeFound("created.lessThan=" + DEFAULT_CREATED);

        // Get all the processList where created is less than UPDATED_CREATED
        defaultProcessShouldBeFound("created.lessThan=" + UPDATED_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessesByCreatedIsGreaterThanSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where created is greater than DEFAULT_CREATED
        defaultProcessShouldNotBeFound("created.greaterThan=" + DEFAULT_CREATED);

        // Get all the processList where created is greater than SMALLER_CREATED
        defaultProcessShouldBeFound("created.greaterThan=" + SMALLER_CREATED);
    }

    @Test
    @Transactional
    void getAllProcessesByUpdatedIsEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where updated equals to DEFAULT_UPDATED
        defaultProcessShouldBeFound("updated.equals=" + DEFAULT_UPDATED);

        // Get all the processList where updated equals to UPDATED_UPDATED
        defaultProcessShouldNotBeFound("updated.equals=" + UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessesByUpdatedIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where updated not equals to DEFAULT_UPDATED
        defaultProcessShouldNotBeFound("updated.notEquals=" + DEFAULT_UPDATED);

        // Get all the processList where updated not equals to UPDATED_UPDATED
        defaultProcessShouldBeFound("updated.notEquals=" + UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessesByUpdatedIsInShouldWork() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where updated in DEFAULT_UPDATED or UPDATED_UPDATED
        defaultProcessShouldBeFound("updated.in=" + DEFAULT_UPDATED + "," + UPDATED_UPDATED);

        // Get all the processList where updated equals to UPDATED_UPDATED
        defaultProcessShouldNotBeFound("updated.in=" + UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessesByUpdatedIsNullOrNotNull() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where updated is not null
        defaultProcessShouldBeFound("updated.specified=true");

        // Get all the processList where updated is null
        defaultProcessShouldNotBeFound("updated.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessesByUpdatedIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where updated is greater than or equal to DEFAULT_UPDATED
        defaultProcessShouldBeFound("updated.greaterThanOrEqual=" + DEFAULT_UPDATED);

        // Get all the processList where updated is greater than or equal to UPDATED_UPDATED
        defaultProcessShouldNotBeFound("updated.greaterThanOrEqual=" + UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessesByUpdatedIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where updated is less than or equal to DEFAULT_UPDATED
        defaultProcessShouldBeFound("updated.lessThanOrEqual=" + DEFAULT_UPDATED);

        // Get all the processList where updated is less than or equal to SMALLER_UPDATED
        defaultProcessShouldNotBeFound("updated.lessThanOrEqual=" + SMALLER_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessesByUpdatedIsLessThanSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where updated is less than DEFAULT_UPDATED
        defaultProcessShouldNotBeFound("updated.lessThan=" + DEFAULT_UPDATED);

        // Get all the processList where updated is less than UPDATED_UPDATED
        defaultProcessShouldBeFound("updated.lessThan=" + UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessesByUpdatedIsGreaterThanSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where updated is greater than DEFAULT_UPDATED
        defaultProcessShouldNotBeFound("updated.greaterThan=" + DEFAULT_UPDATED);

        // Get all the processList where updated is greater than SMALLER_UPDATED
        defaultProcessShouldBeFound("updated.greaterThan=" + SMALLER_UPDATED);
    }

    @Test
    @Transactional
    void getAllProcessesByExecutionsCountIsEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where executionsCount equals to DEFAULT_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("executionsCount.equals=" + DEFAULT_EXECUTIONS_COUNT);

        // Get all the processList where executionsCount equals to UPDATED_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("executionsCount.equals=" + UPDATED_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByExecutionsCountIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where executionsCount not equals to DEFAULT_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("executionsCount.notEquals=" + DEFAULT_EXECUTIONS_COUNT);

        // Get all the processList where executionsCount not equals to UPDATED_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("executionsCount.notEquals=" + UPDATED_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByExecutionsCountIsInShouldWork() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where executionsCount in DEFAULT_EXECUTIONS_COUNT or UPDATED_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("executionsCount.in=" + DEFAULT_EXECUTIONS_COUNT + "," + UPDATED_EXECUTIONS_COUNT);

        // Get all the processList where executionsCount equals to UPDATED_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("executionsCount.in=" + UPDATED_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByExecutionsCountIsNullOrNotNull() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where executionsCount is not null
        defaultProcessShouldBeFound("executionsCount.specified=true");

        // Get all the processList where executionsCount is null
        defaultProcessShouldNotBeFound("executionsCount.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessesByExecutionsCountIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where executionsCount is greater than or equal to DEFAULT_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("executionsCount.greaterThanOrEqual=" + DEFAULT_EXECUTIONS_COUNT);

        // Get all the processList where executionsCount is greater than or equal to UPDATED_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("executionsCount.greaterThanOrEqual=" + UPDATED_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByExecutionsCountIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where executionsCount is less than or equal to DEFAULT_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("executionsCount.lessThanOrEqual=" + DEFAULT_EXECUTIONS_COUNT);

        // Get all the processList where executionsCount is less than or equal to SMALLER_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("executionsCount.lessThanOrEqual=" + SMALLER_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByExecutionsCountIsLessThanSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where executionsCount is less than DEFAULT_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("executionsCount.lessThan=" + DEFAULT_EXECUTIONS_COUNT);

        // Get all the processList where executionsCount is less than UPDATED_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("executionsCount.lessThan=" + UPDATED_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByExecutionsCountIsGreaterThanSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where executionsCount is greater than DEFAULT_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("executionsCount.greaterThan=" + DEFAULT_EXECUTIONS_COUNT);

        // Get all the processList where executionsCount is greater than SMALLER_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("executionsCount.greaterThan=" + SMALLER_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesBySuccessExecutionsCountIsEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where successExecutionsCount equals to DEFAULT_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("successExecutionsCount.equals=" + DEFAULT_SUCCESS_EXECUTIONS_COUNT);

        // Get all the processList where successExecutionsCount equals to UPDATED_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("successExecutionsCount.equals=" + UPDATED_SUCCESS_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesBySuccessExecutionsCountIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where successExecutionsCount not equals to DEFAULT_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("successExecutionsCount.notEquals=" + DEFAULT_SUCCESS_EXECUTIONS_COUNT);

        // Get all the processList where successExecutionsCount not equals to UPDATED_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("successExecutionsCount.notEquals=" + UPDATED_SUCCESS_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesBySuccessExecutionsCountIsInShouldWork() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where successExecutionsCount in DEFAULT_SUCCESS_EXECUTIONS_COUNT or UPDATED_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldBeFound(
            "successExecutionsCount.in=" + DEFAULT_SUCCESS_EXECUTIONS_COUNT + "," + UPDATED_SUCCESS_EXECUTIONS_COUNT
        );

        // Get all the processList where successExecutionsCount equals to UPDATED_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("successExecutionsCount.in=" + UPDATED_SUCCESS_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesBySuccessExecutionsCountIsNullOrNotNull() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where successExecutionsCount is not null
        defaultProcessShouldBeFound("successExecutionsCount.specified=true");

        // Get all the processList where successExecutionsCount is null
        defaultProcessShouldNotBeFound("successExecutionsCount.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessesBySuccessExecutionsCountIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where successExecutionsCount is greater than or equal to DEFAULT_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("successExecutionsCount.greaterThanOrEqual=" + DEFAULT_SUCCESS_EXECUTIONS_COUNT);

        // Get all the processList where successExecutionsCount is greater than or equal to UPDATED_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("successExecutionsCount.greaterThanOrEqual=" + UPDATED_SUCCESS_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesBySuccessExecutionsCountIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where successExecutionsCount is less than or equal to DEFAULT_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("successExecutionsCount.lessThanOrEqual=" + DEFAULT_SUCCESS_EXECUTIONS_COUNT);

        // Get all the processList where successExecutionsCount is less than or equal to SMALLER_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("successExecutionsCount.lessThanOrEqual=" + SMALLER_SUCCESS_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesBySuccessExecutionsCountIsLessThanSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where successExecutionsCount is less than DEFAULT_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("successExecutionsCount.lessThan=" + DEFAULT_SUCCESS_EXECUTIONS_COUNT);

        // Get all the processList where successExecutionsCount is less than UPDATED_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("successExecutionsCount.lessThan=" + UPDATED_SUCCESS_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesBySuccessExecutionsCountIsGreaterThanSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where successExecutionsCount is greater than DEFAULT_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("successExecutionsCount.greaterThan=" + DEFAULT_SUCCESS_EXECUTIONS_COUNT);

        // Get all the processList where successExecutionsCount is greater than SMALLER_SUCCESS_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("successExecutionsCount.greaterThan=" + SMALLER_SUCCESS_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByFailureExecutionsCountIsEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where failureExecutionsCount equals to DEFAULT_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("failureExecutionsCount.equals=" + DEFAULT_FAILURE_EXECUTIONS_COUNT);

        // Get all the processList where failureExecutionsCount equals to UPDATED_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("failureExecutionsCount.equals=" + UPDATED_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByFailureExecutionsCountIsNotEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where failureExecutionsCount not equals to DEFAULT_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("failureExecutionsCount.notEquals=" + DEFAULT_FAILURE_EXECUTIONS_COUNT);

        // Get all the processList where failureExecutionsCount not equals to UPDATED_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("failureExecutionsCount.notEquals=" + UPDATED_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByFailureExecutionsCountIsInShouldWork() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where failureExecutionsCount in DEFAULT_FAILURE_EXECUTIONS_COUNT or UPDATED_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldBeFound(
            "failureExecutionsCount.in=" + DEFAULT_FAILURE_EXECUTIONS_COUNT + "," + UPDATED_FAILURE_EXECUTIONS_COUNT
        );

        // Get all the processList where failureExecutionsCount equals to UPDATED_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("failureExecutionsCount.in=" + UPDATED_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByFailureExecutionsCountIsNullOrNotNull() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where failureExecutionsCount is not null
        defaultProcessShouldBeFound("failureExecutionsCount.specified=true");

        // Get all the processList where failureExecutionsCount is null
        defaultProcessShouldNotBeFound("failureExecutionsCount.specified=false");
    }

    @Test
    @Transactional
    void getAllProcessesByFailureExecutionsCountIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where failureExecutionsCount is greater than or equal to DEFAULT_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("failureExecutionsCount.greaterThanOrEqual=" + DEFAULT_FAILURE_EXECUTIONS_COUNT);

        // Get all the processList where failureExecutionsCount is greater than or equal to UPDATED_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("failureExecutionsCount.greaterThanOrEqual=" + UPDATED_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByFailureExecutionsCountIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where failureExecutionsCount is less than or equal to DEFAULT_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("failureExecutionsCount.lessThanOrEqual=" + DEFAULT_FAILURE_EXECUTIONS_COUNT);

        // Get all the processList where failureExecutionsCount is less than or equal to SMALLER_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("failureExecutionsCount.lessThanOrEqual=" + SMALLER_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByFailureExecutionsCountIsLessThanSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where failureExecutionsCount is less than DEFAULT_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("failureExecutionsCount.lessThan=" + DEFAULT_FAILURE_EXECUTIONS_COUNT);

        // Get all the processList where failureExecutionsCount is less than UPDATED_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("failureExecutionsCount.lessThan=" + UPDATED_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByFailureExecutionsCountIsGreaterThanSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        // Get all the processList where failureExecutionsCount is greater than DEFAULT_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldNotBeFound("failureExecutionsCount.greaterThan=" + DEFAULT_FAILURE_EXECUTIONS_COUNT);

        // Get all the processList where failureExecutionsCount is greater than SMALLER_FAILURE_EXECUTIONS_COUNT
        defaultProcessShouldBeFound("failureExecutionsCount.greaterThan=" + SMALLER_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void getAllProcessesByCreatedByIsEqualToSomething() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);
        User createdBy = UserResourceIT.createEntity(em);
        em.persist(createdBy);
        em.flush();
        process.setCreatedBy(createdBy);
        processRepository.saveAndFlush(process);
        Long createdById = createdBy.getId();

        // Get all the processList where createdBy equals to createdById
        defaultProcessShouldBeFound("createdById.equals=" + createdById);

        // Get all the processList where createdBy equals to (createdById + 1)
        defaultProcessShouldNotBeFound("createdById.equals=" + (createdById + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultProcessShouldBeFound(String filter) throws Exception {
        restProcessMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(process.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].definition").value(hasItem(DEFAULT_DEFINITION.toString())))
            .andExpect(jsonPath("$.[*].isPublic").value(hasItem(DEFAULT_IS_PUBLIC.booleanValue())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].updated").value(hasItem(sameInstant(DEFAULT_UPDATED))))
            .andExpect(jsonPath("$.[*].executionsCount").value(hasItem(DEFAULT_EXECUTIONS_COUNT.intValue())))
            .andExpect(jsonPath("$.[*].successExecutionsCount").value(hasItem(DEFAULT_SUCCESS_EXECUTIONS_COUNT.intValue())))
            .andExpect(jsonPath("$.[*].failureExecutionsCount").value(hasItem(DEFAULT_FAILURE_EXECUTIONS_COUNT.intValue())));

        // Check, that the count call also returns 1
        restProcessMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultProcessShouldNotBeFound(String filter) throws Exception {
        restProcessMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restProcessMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingProcess() throws Exception {
        // Get the process
        restProcessMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProcess() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        int databaseSizeBeforeUpdate = processRepository.findAll().size();

        // Update the process
        Process updatedProcess = processRepository.findById(process.getId()).get();
        // Disconnect from session so that the updates on updatedProcess are not directly saved in db
        em.detach(updatedProcess);
        updatedProcess
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .definition(UPDATED_DEFINITION)
            .isPublic(UPDATED_IS_PUBLIC)
            .created(UPDATED_CREATED)
            .updated(UPDATED_UPDATED)
            .executionsCount(UPDATED_EXECUTIONS_COUNT)
            .successExecutionsCount(UPDATED_SUCCESS_EXECUTIONS_COUNT)
            .failureExecutionsCount(UPDATED_FAILURE_EXECUTIONS_COUNT);
        ProcessDTO processDTO = processMapper.toDto(updatedProcess);

        restProcessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, processDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processDTO))
            )
            .andExpect(status().isOk());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeUpdate);
        Process testProcess = processList.get(processList.size() - 1);
        assertThat(testProcess.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProcess.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProcess.getDefinition()).isEqualTo(UPDATED_DEFINITION);
        assertThat(testProcess.getIsPublic()).isEqualTo(UPDATED_IS_PUBLIC);
        assertThat(testProcess.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testProcess.getUpdated()).isEqualTo(UPDATED_UPDATED);
        assertThat(testProcess.getExecutionsCount()).isEqualTo(UPDATED_EXECUTIONS_COUNT);
        assertThat(testProcess.getSuccessExecutionsCount()).isEqualTo(UPDATED_SUCCESS_EXECUTIONS_COUNT);
        assertThat(testProcess.getFailureExecutionsCount()).isEqualTo(UPDATED_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void putNonExistingProcess() throws Exception {
        int databaseSizeBeforeUpdate = processRepository.findAll().size();
        process.setId(count.incrementAndGet());

        // Create the Process
        ProcessDTO processDTO = processMapper.toDto(process);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, processDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProcess() throws Exception {
        int databaseSizeBeforeUpdate = processRepository.findAll().size();
        process.setId(count.incrementAndGet());

        // Create the Process
        ProcessDTO processDTO = processMapper.toDto(process);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(processDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProcess() throws Exception {
        int databaseSizeBeforeUpdate = processRepository.findAll().size();
        process.setId(count.incrementAndGet());

        // Create the Process
        ProcessDTO processDTO = processMapper.toDto(process);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(processDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProcessWithPatch() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        int databaseSizeBeforeUpdate = processRepository.findAll().size();

        // Update the process using partial update
        Process partialUpdatedProcess = new Process();
        partialUpdatedProcess.setId(process.getId());

        partialUpdatedProcess.name(UPDATED_NAME).created(UPDATED_CREATED).successExecutionsCount(UPDATED_SUCCESS_EXECUTIONS_COUNT);

        restProcessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProcess.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProcess))
            )
            .andExpect(status().isOk());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeUpdate);
        Process testProcess = processList.get(processList.size() - 1);
        assertThat(testProcess.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProcess.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProcess.getDefinition()).isEqualTo(DEFAULT_DEFINITION);
        assertThat(testProcess.getIsPublic()).isEqualTo(DEFAULT_IS_PUBLIC);
        assertThat(testProcess.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testProcess.getUpdated()).isEqualTo(DEFAULT_UPDATED);
        assertThat(testProcess.getExecutionsCount()).isEqualTo(DEFAULT_EXECUTIONS_COUNT);
        assertThat(testProcess.getSuccessExecutionsCount()).isEqualTo(UPDATED_SUCCESS_EXECUTIONS_COUNT);
        assertThat(testProcess.getFailureExecutionsCount()).isEqualTo(DEFAULT_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void fullUpdateProcessWithPatch() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        int databaseSizeBeforeUpdate = processRepository.findAll().size();

        // Update the process using partial update
        Process partialUpdatedProcess = new Process();
        partialUpdatedProcess.setId(process.getId());

        partialUpdatedProcess
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .definition(UPDATED_DEFINITION)
            .isPublic(UPDATED_IS_PUBLIC)
            .created(UPDATED_CREATED)
            .updated(UPDATED_UPDATED)
            .executionsCount(UPDATED_EXECUTIONS_COUNT)
            .successExecutionsCount(UPDATED_SUCCESS_EXECUTIONS_COUNT)
            .failureExecutionsCount(UPDATED_FAILURE_EXECUTIONS_COUNT);

        restProcessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProcess.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProcess))
            )
            .andExpect(status().isOk());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeUpdate);
        Process testProcess = processList.get(processList.size() - 1);
        assertThat(testProcess.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProcess.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProcess.getDefinition()).isEqualTo(UPDATED_DEFINITION);
        assertThat(testProcess.getIsPublic()).isEqualTo(UPDATED_IS_PUBLIC);
        assertThat(testProcess.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testProcess.getUpdated()).isEqualTo(UPDATED_UPDATED);
        assertThat(testProcess.getExecutionsCount()).isEqualTo(UPDATED_EXECUTIONS_COUNT);
        assertThat(testProcess.getSuccessExecutionsCount()).isEqualTo(UPDATED_SUCCESS_EXECUTIONS_COUNT);
        assertThat(testProcess.getFailureExecutionsCount()).isEqualTo(UPDATED_FAILURE_EXECUTIONS_COUNT);
    }

    @Test
    @Transactional
    void patchNonExistingProcess() throws Exception {
        int databaseSizeBeforeUpdate = processRepository.findAll().size();
        process.setId(count.incrementAndGet());

        // Create the Process
        ProcessDTO processDTO = processMapper.toDto(process);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, processDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(processDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProcess() throws Exception {
        int databaseSizeBeforeUpdate = processRepository.findAll().size();
        process.setId(count.incrementAndGet());

        // Create the Process
        ProcessDTO processDTO = processMapper.toDto(process);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(processDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProcess() throws Exception {
        int databaseSizeBeforeUpdate = processRepository.findAll().size();
        process.setId(count.incrementAndGet());

        // Create the Process
        ProcessDTO processDTO = processMapper.toDto(process);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcessMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(processDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Process in the database
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProcess() throws Exception {
        // Initialize the database
        processRepository.saveAndFlush(process);

        int databaseSizeBeforeDelete = processRepository.findAll().size();

        // Delete the process
        restProcessMockMvc
            .perform(delete(ENTITY_API_URL_ID, process.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Process> processList = processRepository.findAll();
        assertThat(processList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

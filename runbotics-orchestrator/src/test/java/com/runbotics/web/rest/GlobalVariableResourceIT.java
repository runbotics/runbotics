package com.runbotics.web.rest;

import static com.runbotics.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.runbotics.IntegrationTest;
import com.runbotics.domain.GlobalVariable;
import com.runbotics.domain.User;
import com.runbotics.repository.GlobalVariableRepository;
import com.runbotics.service.criteria.GlobalVariableCriteria;
import com.runbotics.service.dto.GlobalVariableDTO;
import com.runbotics.service.mapper.GlobalVariableMapper;
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
 * Integration tests for the {@link GlobalVariableResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GlobalVariableResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAST_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_LAST_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final String ENTITY_API_URL = "/api/global-variables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GlobalVariableRepository globalVariableRepository;

    @Autowired
    private GlobalVariableMapper globalVariableMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGlobalVariableMockMvc;

    private GlobalVariable globalVariable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GlobalVariable createEntity(EntityManager em) {
        GlobalVariable globalVariable = new GlobalVariable()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .type(DEFAULT_TYPE)
            .value(DEFAULT_VALUE)
            .lastModified(DEFAULT_LAST_MODIFIED);
        return globalVariable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GlobalVariable createUpdatedEntity(EntityManager em) {
        GlobalVariable globalVariable = new GlobalVariable()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .type(UPDATED_TYPE)
            .value(UPDATED_VALUE)
            .lastModified(UPDATED_LAST_MODIFIED);
        return globalVariable;
    }

    @BeforeEach
    public void initTest() {
        globalVariable = createEntity(em);
    }

    @Test
    @Transactional
    void createGlobalVariable() throws Exception {
        int databaseSizeBeforeCreate = globalVariableRepository.findAll().size();
        // Create the GlobalVariable
        GlobalVariableDTO globalVariableDTO = globalVariableMapper.toDto(globalVariable);
        restGlobalVariableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(globalVariableDTO))
            )
            .andExpect(status().isCreated());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeCreate + 1);
        GlobalVariable testGlobalVariable = globalVariableList.get(globalVariableList.size() - 1);
        assertThat(testGlobalVariable.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testGlobalVariable.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testGlobalVariable.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testGlobalVariable.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testGlobalVariable.getLastModified()).isEqualTo(DEFAULT_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void createGlobalVariableWithExistingId() throws Exception {
        // Create the GlobalVariable with an existing ID
        globalVariable.setId(1L);
        GlobalVariableDTO globalVariableDTO = globalVariableMapper.toDto(globalVariable);

        int databaseSizeBeforeCreate = globalVariableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGlobalVariableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(globalVariableDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGlobalVariables() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList
        restGlobalVariableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(globalVariable.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED))));
    }

    @Test
    @Transactional
    void getGlobalVariable() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get the globalVariable
        restGlobalVariableMockMvc
            .perform(get(ENTITY_API_URL_ID, globalVariable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(globalVariable.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE))
            .andExpect(jsonPath("$.lastModified").value(sameInstant(DEFAULT_LAST_MODIFIED)));
    }

    @Test
    @Transactional
    void getGlobalVariablesByIdFiltering() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        Long id = globalVariable.getId();

        defaultGlobalVariableShouldBeFound("id.equals=" + id);
        defaultGlobalVariableShouldNotBeFound("id.notEquals=" + id);

        defaultGlobalVariableShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultGlobalVariableShouldNotBeFound("id.greaterThan=" + id);

        defaultGlobalVariableShouldBeFound("id.lessThanOrEqual=" + id);
        defaultGlobalVariableShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where name equals to DEFAULT_NAME
        defaultGlobalVariableShouldBeFound("name.equals=" + DEFAULT_NAME);

        // Get all the globalVariableList where name equals to UPDATED_NAME
        defaultGlobalVariableShouldNotBeFound("name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByNameIsNotEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where name not equals to DEFAULT_NAME
        defaultGlobalVariableShouldNotBeFound("name.notEquals=" + DEFAULT_NAME);

        // Get all the globalVariableList where name not equals to UPDATED_NAME
        defaultGlobalVariableShouldBeFound("name.notEquals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByNameIsInShouldWork() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where name in DEFAULT_NAME or UPDATED_NAME
        defaultGlobalVariableShouldBeFound("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME);

        // Get all the globalVariableList where name equals to UPDATED_NAME
        defaultGlobalVariableShouldNotBeFound("name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where name is not null
        defaultGlobalVariableShouldBeFound("name.specified=true");

        // Get all the globalVariableList where name is null
        defaultGlobalVariableShouldNotBeFound("name.specified=false");
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByNameContainsSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where name contains DEFAULT_NAME
        defaultGlobalVariableShouldBeFound("name.contains=" + DEFAULT_NAME);

        // Get all the globalVariableList where name contains UPDATED_NAME
        defaultGlobalVariableShouldNotBeFound("name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByNameNotContainsSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where name does not contain DEFAULT_NAME
        defaultGlobalVariableShouldNotBeFound("name.doesNotContain=" + DEFAULT_NAME);

        // Get all the globalVariableList where name does not contain UPDATED_NAME
        defaultGlobalVariableShouldBeFound("name.doesNotContain=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByDescriptionIsEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where description equals to DEFAULT_DESCRIPTION
        defaultGlobalVariableShouldBeFound("description.equals=" + DEFAULT_DESCRIPTION);

        // Get all the globalVariableList where description equals to UPDATED_DESCRIPTION
        defaultGlobalVariableShouldNotBeFound("description.equals=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByDescriptionIsNotEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where description not equals to DEFAULT_DESCRIPTION
        defaultGlobalVariableShouldNotBeFound("description.notEquals=" + DEFAULT_DESCRIPTION);

        // Get all the globalVariableList where description not equals to UPDATED_DESCRIPTION
        defaultGlobalVariableShouldBeFound("description.notEquals=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByDescriptionIsInShouldWork() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where description in DEFAULT_DESCRIPTION or UPDATED_DESCRIPTION
        defaultGlobalVariableShouldBeFound("description.in=" + DEFAULT_DESCRIPTION + "," + UPDATED_DESCRIPTION);

        // Get all the globalVariableList where description equals to UPDATED_DESCRIPTION
        defaultGlobalVariableShouldNotBeFound("description.in=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByDescriptionIsNullOrNotNull() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where description is not null
        defaultGlobalVariableShouldBeFound("description.specified=true");

        // Get all the globalVariableList where description is null
        defaultGlobalVariableShouldNotBeFound("description.specified=false");
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByDescriptionContainsSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where description contains DEFAULT_DESCRIPTION
        defaultGlobalVariableShouldBeFound("description.contains=" + DEFAULT_DESCRIPTION);

        // Get all the globalVariableList where description contains UPDATED_DESCRIPTION
        defaultGlobalVariableShouldNotBeFound("description.contains=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByDescriptionNotContainsSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where description does not contain DEFAULT_DESCRIPTION
        defaultGlobalVariableShouldNotBeFound("description.doesNotContain=" + DEFAULT_DESCRIPTION);

        // Get all the globalVariableList where description does not contain UPDATED_DESCRIPTION
        defaultGlobalVariableShouldBeFound("description.doesNotContain=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByTypeIsEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where type equals to DEFAULT_TYPE
        defaultGlobalVariableShouldBeFound("type.equals=" + DEFAULT_TYPE);

        // Get all the globalVariableList where type equals to UPDATED_TYPE
        defaultGlobalVariableShouldNotBeFound("type.equals=" + UPDATED_TYPE);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByTypeIsNotEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where type not equals to DEFAULT_TYPE
        defaultGlobalVariableShouldNotBeFound("type.notEquals=" + DEFAULT_TYPE);

        // Get all the globalVariableList where type not equals to UPDATED_TYPE
        defaultGlobalVariableShouldBeFound("type.notEquals=" + UPDATED_TYPE);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByTypeIsInShouldWork() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where type in DEFAULT_TYPE or UPDATED_TYPE
        defaultGlobalVariableShouldBeFound("type.in=" + DEFAULT_TYPE + "," + UPDATED_TYPE);

        // Get all the globalVariableList where type equals to UPDATED_TYPE
        defaultGlobalVariableShouldNotBeFound("type.in=" + UPDATED_TYPE);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByTypeIsNullOrNotNull() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where type is not null
        defaultGlobalVariableShouldBeFound("type.specified=true");

        // Get all the globalVariableList where type is null
        defaultGlobalVariableShouldNotBeFound("type.specified=false");
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByTypeContainsSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where type contains DEFAULT_TYPE
        defaultGlobalVariableShouldBeFound("type.contains=" + DEFAULT_TYPE);

        // Get all the globalVariableList where type contains UPDATED_TYPE
        defaultGlobalVariableShouldNotBeFound("type.contains=" + UPDATED_TYPE);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByTypeNotContainsSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where type does not contain DEFAULT_TYPE
        defaultGlobalVariableShouldNotBeFound("type.doesNotContain=" + DEFAULT_TYPE);

        // Get all the globalVariableList where type does not contain UPDATED_TYPE
        defaultGlobalVariableShouldBeFound("type.doesNotContain=" + UPDATED_TYPE);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByValueIsEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where value equals to DEFAULT_VALUE
        defaultGlobalVariableShouldBeFound("value.equals=" + DEFAULT_VALUE);

        // Get all the globalVariableList where value equals to UPDATED_VALUE
        defaultGlobalVariableShouldNotBeFound("value.equals=" + UPDATED_VALUE);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByValueIsNotEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where value not equals to DEFAULT_VALUE
        defaultGlobalVariableShouldNotBeFound("value.notEquals=" + DEFAULT_VALUE);

        // Get all the globalVariableList where value not equals to UPDATED_VALUE
        defaultGlobalVariableShouldBeFound("value.notEquals=" + UPDATED_VALUE);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByValueIsInShouldWork() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where value in DEFAULT_VALUE or UPDATED_VALUE
        defaultGlobalVariableShouldBeFound("value.in=" + DEFAULT_VALUE + "," + UPDATED_VALUE);

        // Get all the globalVariableList where value equals to UPDATED_VALUE
        defaultGlobalVariableShouldNotBeFound("value.in=" + UPDATED_VALUE);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByValueIsNullOrNotNull() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where value is not null
        defaultGlobalVariableShouldBeFound("value.specified=true");

        // Get all the globalVariableList where value is null
        defaultGlobalVariableShouldNotBeFound("value.specified=false");
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByValueContainsSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where value contains DEFAULT_VALUE
        defaultGlobalVariableShouldBeFound("value.contains=" + DEFAULT_VALUE);

        // Get all the globalVariableList where value contains UPDATED_VALUE
        defaultGlobalVariableShouldNotBeFound("value.contains=" + UPDATED_VALUE);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByValueNotContainsSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where value does not contain DEFAULT_VALUE
        defaultGlobalVariableShouldNotBeFound("value.doesNotContain=" + DEFAULT_VALUE);

        // Get all the globalVariableList where value does not contain UPDATED_VALUE
        defaultGlobalVariableShouldBeFound("value.doesNotContain=" + UPDATED_VALUE);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByLastModifiedIsEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where lastModified equals to DEFAULT_LAST_MODIFIED
        defaultGlobalVariableShouldBeFound("lastModified.equals=" + DEFAULT_LAST_MODIFIED);

        // Get all the globalVariableList where lastModified equals to UPDATED_LAST_MODIFIED
        defaultGlobalVariableShouldNotBeFound("lastModified.equals=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByLastModifiedIsNotEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where lastModified not equals to DEFAULT_LAST_MODIFIED
        defaultGlobalVariableShouldNotBeFound("lastModified.notEquals=" + DEFAULT_LAST_MODIFIED);

        // Get all the globalVariableList where lastModified not equals to UPDATED_LAST_MODIFIED
        defaultGlobalVariableShouldBeFound("lastModified.notEquals=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByLastModifiedIsInShouldWork() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where lastModified in DEFAULT_LAST_MODIFIED or UPDATED_LAST_MODIFIED
        defaultGlobalVariableShouldBeFound("lastModified.in=" + DEFAULT_LAST_MODIFIED + "," + UPDATED_LAST_MODIFIED);

        // Get all the globalVariableList where lastModified equals to UPDATED_LAST_MODIFIED
        defaultGlobalVariableShouldNotBeFound("lastModified.in=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByLastModifiedIsNullOrNotNull() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where lastModified is not null
        defaultGlobalVariableShouldBeFound("lastModified.specified=true");

        // Get all the globalVariableList where lastModified is null
        defaultGlobalVariableShouldNotBeFound("lastModified.specified=false");
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByLastModifiedIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where lastModified is greater than or equal to DEFAULT_LAST_MODIFIED
        defaultGlobalVariableShouldBeFound("lastModified.greaterThanOrEqual=" + DEFAULT_LAST_MODIFIED);

        // Get all the globalVariableList where lastModified is greater than or equal to UPDATED_LAST_MODIFIED
        defaultGlobalVariableShouldNotBeFound("lastModified.greaterThanOrEqual=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByLastModifiedIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where lastModified is less than or equal to DEFAULT_LAST_MODIFIED
        defaultGlobalVariableShouldBeFound("lastModified.lessThanOrEqual=" + DEFAULT_LAST_MODIFIED);

        // Get all the globalVariableList where lastModified is less than or equal to SMALLER_LAST_MODIFIED
        defaultGlobalVariableShouldNotBeFound("lastModified.lessThanOrEqual=" + SMALLER_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByLastModifiedIsLessThanSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where lastModified is less than DEFAULT_LAST_MODIFIED
        defaultGlobalVariableShouldNotBeFound("lastModified.lessThan=" + DEFAULT_LAST_MODIFIED);

        // Get all the globalVariableList where lastModified is less than UPDATED_LAST_MODIFIED
        defaultGlobalVariableShouldBeFound("lastModified.lessThan=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByLastModifiedIsGreaterThanSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        // Get all the globalVariableList where lastModified is greater than DEFAULT_LAST_MODIFIED
        defaultGlobalVariableShouldNotBeFound("lastModified.greaterThan=" + DEFAULT_LAST_MODIFIED);

        // Get all the globalVariableList where lastModified is greater than SMALLER_LAST_MODIFIED
        defaultGlobalVariableShouldBeFound("lastModified.greaterThan=" + SMALLER_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllGlobalVariablesByUserIsEqualToSomething() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        globalVariable.setUser(user);
        globalVariableRepository.saveAndFlush(globalVariable);
        Long userId = user.getId();

        // Get all the globalVariableList where user equals to userId
        defaultGlobalVariableShouldBeFound("userId.equals=" + userId);

        // Get all the globalVariableList where user equals to (userId + 1)
        defaultGlobalVariableShouldNotBeFound("userId.equals=" + (userId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultGlobalVariableShouldBeFound(String filter) throws Exception {
        restGlobalVariableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(globalVariable.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED))));

        // Check, that the count call also returns 1
        restGlobalVariableMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultGlobalVariableShouldNotBeFound(String filter) throws Exception {
        restGlobalVariableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restGlobalVariableMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingGlobalVariable() throws Exception {
        // Get the globalVariable
        restGlobalVariableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGlobalVariable() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        int databaseSizeBeforeUpdate = globalVariableRepository.findAll().size();

        // Update the globalVariable
        GlobalVariable updatedGlobalVariable = globalVariableRepository.findById(globalVariable.getId()).get();
        // Disconnect from session so that the updates on updatedGlobalVariable are not directly saved in db
        em.detach(updatedGlobalVariable);
        updatedGlobalVariable
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .type(UPDATED_TYPE)
            .value(UPDATED_VALUE)
            .lastModified(UPDATED_LAST_MODIFIED);
        GlobalVariableDTO globalVariableDTO = globalVariableMapper.toDto(updatedGlobalVariable);

        restGlobalVariableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, globalVariableDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(globalVariableDTO))
            )
            .andExpect(status().isOk());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeUpdate);
        GlobalVariable testGlobalVariable = globalVariableList.get(globalVariableList.size() - 1);
        assertThat(testGlobalVariable.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testGlobalVariable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testGlobalVariable.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testGlobalVariable.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testGlobalVariable.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void putNonExistingGlobalVariable() throws Exception {
        int databaseSizeBeforeUpdate = globalVariableRepository.findAll().size();
        globalVariable.setId(count.incrementAndGet());

        // Create the GlobalVariable
        GlobalVariableDTO globalVariableDTO = globalVariableMapper.toDto(globalVariable);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGlobalVariableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, globalVariableDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(globalVariableDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGlobalVariable() throws Exception {
        int databaseSizeBeforeUpdate = globalVariableRepository.findAll().size();
        globalVariable.setId(count.incrementAndGet());

        // Create the GlobalVariable
        GlobalVariableDTO globalVariableDTO = globalVariableMapper.toDto(globalVariable);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalVariableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(globalVariableDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGlobalVariable() throws Exception {
        int databaseSizeBeforeUpdate = globalVariableRepository.findAll().size();
        globalVariable.setId(count.incrementAndGet());

        // Create the GlobalVariable
        GlobalVariableDTO globalVariableDTO = globalVariableMapper.toDto(globalVariable);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalVariableMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(globalVariableDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGlobalVariableWithPatch() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        int databaseSizeBeforeUpdate = globalVariableRepository.findAll().size();

        // Update the globalVariable using partial update
        GlobalVariable partialUpdatedGlobalVariable = new GlobalVariable();
        partialUpdatedGlobalVariable.setId(globalVariable.getId());

        partialUpdatedGlobalVariable
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .type(UPDATED_TYPE)
            .lastModified(UPDATED_LAST_MODIFIED);

        restGlobalVariableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGlobalVariable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGlobalVariable))
            )
            .andExpect(status().isOk());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeUpdate);
        GlobalVariable testGlobalVariable = globalVariableList.get(globalVariableList.size() - 1);
        assertThat(testGlobalVariable.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testGlobalVariable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testGlobalVariable.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testGlobalVariable.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testGlobalVariable.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void fullUpdateGlobalVariableWithPatch() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        int databaseSizeBeforeUpdate = globalVariableRepository.findAll().size();

        // Update the globalVariable using partial update
        GlobalVariable partialUpdatedGlobalVariable = new GlobalVariable();
        partialUpdatedGlobalVariable.setId(globalVariable.getId());

        partialUpdatedGlobalVariable
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .type(UPDATED_TYPE)
            .value(UPDATED_VALUE)
            .lastModified(UPDATED_LAST_MODIFIED);

        restGlobalVariableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGlobalVariable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGlobalVariable))
            )
            .andExpect(status().isOk());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeUpdate);
        GlobalVariable testGlobalVariable = globalVariableList.get(globalVariableList.size() - 1);
        assertThat(testGlobalVariable.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testGlobalVariable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testGlobalVariable.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testGlobalVariable.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testGlobalVariable.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void patchNonExistingGlobalVariable() throws Exception {
        int databaseSizeBeforeUpdate = globalVariableRepository.findAll().size();
        globalVariable.setId(count.incrementAndGet());

        // Create the GlobalVariable
        GlobalVariableDTO globalVariableDTO = globalVariableMapper.toDto(globalVariable);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGlobalVariableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, globalVariableDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(globalVariableDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGlobalVariable() throws Exception {
        int databaseSizeBeforeUpdate = globalVariableRepository.findAll().size();
        globalVariable.setId(count.incrementAndGet());

        // Create the GlobalVariable
        GlobalVariableDTO globalVariableDTO = globalVariableMapper.toDto(globalVariable);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalVariableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(globalVariableDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGlobalVariable() throws Exception {
        int databaseSizeBeforeUpdate = globalVariableRepository.findAll().size();
        globalVariable.setId(count.incrementAndGet());

        // Create the GlobalVariable
        GlobalVariableDTO globalVariableDTO = globalVariableMapper.toDto(globalVariable);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalVariableMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(globalVariableDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GlobalVariable in the database
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGlobalVariable() throws Exception {
        // Initialize the database
        globalVariableRepository.saveAndFlush(globalVariable);

        int databaseSizeBeforeDelete = globalVariableRepository.findAll().size();

        // Delete the globalVariable
        restGlobalVariableMockMvc
            .perform(delete(ENTITY_API_URL_ID, globalVariable.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GlobalVariable> globalVariableList = globalVariableRepository.findAll();
        assertThat(globalVariableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

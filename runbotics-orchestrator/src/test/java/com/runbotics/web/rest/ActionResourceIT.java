package com.runbotics.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.runbotics.IntegrationTest;
import com.runbotics.domain.Action;
import com.runbotics.repository.ActionRepository;
import com.runbotics.service.criteria.ActionCriteria;
import com.runbotics.service.dto.ActionDTO;
import com.runbotics.service.mapper.ActionMapper;
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
 * Integration tests for the {@link ActionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActionResourceIT {

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_SCRIPT = "AAAAAAAAAA";
    private static final String UPDATED_SCRIPT = "BBBBBBBBBB";

    private static final String DEFAULT_FORM = "AAAAAAAAAA";
    private static final String UPDATED_FORM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/actions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ActionRepository actionRepository;

    @Autowired
    private ActionMapper actionMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActionMockMvc;

    private Action action;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Action createEntity(EntityManager em) {
        Action action = new Action().label(DEFAULT_LABEL).script(DEFAULT_SCRIPT).form(DEFAULT_FORM);
        return action;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Action createUpdatedEntity(EntityManager em) {
        Action action = new Action().label(UPDATED_LABEL).script(UPDATED_SCRIPT).form(UPDATED_FORM);
        return action;
    }

    @BeforeEach
    public void initTest() {
        action = createEntity(em);
    }

    @Test
    @Transactional
    void createAction() throws Exception {
        int databaseSizeBeforeCreate = actionRepository.findAll().size();
        // Create the Action
        ActionDTO actionDTO = actionMapper.toDto(action);
        restActionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actionDTO)))
            .andExpect(status().isCreated());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeCreate + 1);
        Action testAction = actionList.get(actionList.size() - 1);
        assertThat(testAction.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testAction.getScript()).isEqualTo(DEFAULT_SCRIPT);
        assertThat(testAction.getForm()).isEqualTo(DEFAULT_FORM);
    }

    @Test
    @Transactional
    void createActionWithExistingId() throws Exception {
        // Create the Action with an existing ID
        action.setId("existing_id");
        ActionDTO actionDTO = actionMapper.toDto(action);

        int databaseSizeBeforeCreate = actionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllActions() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList
        restActionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(action.getId())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].script").value(hasItem(DEFAULT_SCRIPT)))
            .andExpect(jsonPath("$.[*].form").value(hasItem(DEFAULT_FORM.toString())));
    }

    @Test
    @Transactional
    void getAction() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get the action
        restActionMockMvc
            .perform(get(ENTITY_API_URL_ID, action.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(action.getId()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.script").value(DEFAULT_SCRIPT))
            .andExpect(jsonPath("$.form").value(DEFAULT_FORM.toString()));
    }

    @Test
    @Transactional
    void getActionsByIdFiltering() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        String id = action.getId();

        defaultActionShouldBeFound("id.equals=" + id);
        defaultActionShouldNotBeFound("id.notEquals=" + id);
    }

    @Test
    @Transactional
    void getAllActionsByLabelIsEqualToSomething() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where label equals to DEFAULT_LABEL
        defaultActionShouldBeFound("label.equals=" + DEFAULT_LABEL);

        // Get all the actionList where label equals to UPDATED_LABEL
        defaultActionShouldNotBeFound("label.equals=" + UPDATED_LABEL);
    }

    @Test
    @Transactional
    void getAllActionsByLabelIsNotEqualToSomething() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where label not equals to DEFAULT_LABEL
        defaultActionShouldNotBeFound("label.notEquals=" + DEFAULT_LABEL);

        // Get all the actionList where label not equals to UPDATED_LABEL
        defaultActionShouldBeFound("label.notEquals=" + UPDATED_LABEL);
    }

    @Test
    @Transactional
    void getAllActionsByLabelIsInShouldWork() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where label in DEFAULT_LABEL or UPDATED_LABEL
        defaultActionShouldBeFound("label.in=" + DEFAULT_LABEL + "," + UPDATED_LABEL);

        // Get all the actionList where label equals to UPDATED_LABEL
        defaultActionShouldNotBeFound("label.in=" + UPDATED_LABEL);
    }

    @Test
    @Transactional
    void getAllActionsByLabelIsNullOrNotNull() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where label is not null
        defaultActionShouldBeFound("label.specified=true");

        // Get all the actionList where label is null
        defaultActionShouldNotBeFound("label.specified=false");
    }

    @Test
    @Transactional
    void getAllActionsByLabelContainsSomething() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where label contains DEFAULT_LABEL
        defaultActionShouldBeFound("label.contains=" + DEFAULT_LABEL);

        // Get all the actionList where label contains UPDATED_LABEL
        defaultActionShouldNotBeFound("label.contains=" + UPDATED_LABEL);
    }

    @Test
    @Transactional
    void getAllActionsByLabelNotContainsSomething() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where label does not contain DEFAULT_LABEL
        defaultActionShouldNotBeFound("label.doesNotContain=" + DEFAULT_LABEL);

        // Get all the actionList where label does not contain UPDATED_LABEL
        defaultActionShouldBeFound("label.doesNotContain=" + UPDATED_LABEL);
    }

    @Test
    @Transactional
    void getAllActionsByScriptIsEqualToSomething() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where script equals to DEFAULT_SCRIPT
        defaultActionShouldBeFound("script.equals=" + DEFAULT_SCRIPT);

        // Get all the actionList where script equals to UPDATED_SCRIPT
        defaultActionShouldNotBeFound("script.equals=" + UPDATED_SCRIPT);
    }

    @Test
    @Transactional
    void getAllActionsByScriptIsNotEqualToSomething() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where script not equals to DEFAULT_SCRIPT
        defaultActionShouldNotBeFound("script.notEquals=" + DEFAULT_SCRIPT);

        // Get all the actionList where script not equals to UPDATED_SCRIPT
        defaultActionShouldBeFound("script.notEquals=" + UPDATED_SCRIPT);
    }

    @Test
    @Transactional
    void getAllActionsByScriptIsInShouldWork() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where script in DEFAULT_SCRIPT or UPDATED_SCRIPT
        defaultActionShouldBeFound("script.in=" + DEFAULT_SCRIPT + "," + UPDATED_SCRIPT);

        // Get all the actionList where script equals to UPDATED_SCRIPT
        defaultActionShouldNotBeFound("script.in=" + UPDATED_SCRIPT);
    }

    @Test
    @Transactional
    void getAllActionsByScriptIsNullOrNotNull() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where script is not null
        defaultActionShouldBeFound("script.specified=true");

        // Get all the actionList where script is null
        defaultActionShouldNotBeFound("script.specified=false");
    }

    @Test
    @Transactional
    void getAllActionsByScriptContainsSomething() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where script contains DEFAULT_SCRIPT
        defaultActionShouldBeFound("script.contains=" + DEFAULT_SCRIPT);

        // Get all the actionList where script contains UPDATED_SCRIPT
        defaultActionShouldNotBeFound("script.contains=" + UPDATED_SCRIPT);
    }

    @Test
    @Transactional
    void getAllActionsByScriptNotContainsSomething() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        // Get all the actionList where script does not contain DEFAULT_SCRIPT
        defaultActionShouldNotBeFound("script.doesNotContain=" + DEFAULT_SCRIPT);

        // Get all the actionList where script does not contain UPDATED_SCRIPT
        defaultActionShouldBeFound("script.doesNotContain=" + UPDATED_SCRIPT);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultActionShouldBeFound(String filter) throws Exception {
        restActionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(action.getId())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].script").value(hasItem(DEFAULT_SCRIPT)))
            .andExpect(jsonPath("$.[*].form").value(hasItem(DEFAULT_FORM.toString())));

        // Check, that the count call also returns 1
        restActionMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultActionShouldNotBeFound(String filter) throws Exception {
        restActionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restActionMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingAction() throws Exception {
        // Get the action
        restActionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAction() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        int databaseSizeBeforeUpdate = actionRepository.findAll().size();

        // Update the action
        Action updatedAction = actionRepository.findById(action.getId()).get();
        // Disconnect from session so that the updates on updatedAction are not directly saved in db
        em.detach(updatedAction);
        updatedAction.label(UPDATED_LABEL).script(UPDATED_SCRIPT).form(UPDATED_FORM);
        ActionDTO actionDTO = actionMapper.toDto(updatedAction);

        restActionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, actionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionDTO))
            )
            .andExpect(status().isOk());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeUpdate);
        Action testAction = actionList.get(actionList.size() - 1);
        assertThat(testAction.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testAction.getScript()).isEqualTo(UPDATED_SCRIPT);
        assertThat(testAction.getForm()).isEqualTo(UPDATED_FORM);
    }

    @Test
    @Transactional
    void putNonExistingAction() throws Exception {
        int databaseSizeBeforeUpdate = actionRepository.findAll().size();
        action.setId(UUID.randomUUID().toString());

        // Create the Action
        ActionDTO actionDTO = actionMapper.toDto(action);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, actionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAction() throws Exception {
        int databaseSizeBeforeUpdate = actionRepository.findAll().size();
        action.setId(UUID.randomUUID().toString());

        // Create the Action
        ActionDTO actionDTO = actionMapper.toDto(action);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAction() throws Exception {
        int databaseSizeBeforeUpdate = actionRepository.findAll().size();
        action.setId(UUID.randomUUID().toString());

        // Create the Action
        ActionDTO actionDTO = actionMapper.toDto(action);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActionWithPatch() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        int databaseSizeBeforeUpdate = actionRepository.findAll().size();

        // Update the action using partial update
        Action partialUpdatedAction = new Action();
        partialUpdatedAction.setId(action.getId());

        partialUpdatedAction.label(UPDATED_LABEL).form(UPDATED_FORM);

        restActionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAction))
            )
            .andExpect(status().isOk());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeUpdate);
        Action testAction = actionList.get(actionList.size() - 1);
        assertThat(testAction.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testAction.getScript()).isEqualTo(DEFAULT_SCRIPT);
        assertThat(testAction.getForm()).isEqualTo(UPDATED_FORM);
    }

    @Test
    @Transactional
    void fullUpdateActionWithPatch() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        int databaseSizeBeforeUpdate = actionRepository.findAll().size();

        // Update the action using partial update
        Action partialUpdatedAction = new Action();
        partialUpdatedAction.setId(action.getId());

        partialUpdatedAction.label(UPDATED_LABEL).script(UPDATED_SCRIPT).form(UPDATED_FORM);

        restActionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAction))
            )
            .andExpect(status().isOk());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeUpdate);
        Action testAction = actionList.get(actionList.size() - 1);
        assertThat(testAction.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testAction.getScript()).isEqualTo(UPDATED_SCRIPT);
        assertThat(testAction.getForm()).isEqualTo(UPDATED_FORM);
    }

    @Test
    @Transactional
    void patchNonExistingAction() throws Exception {
        int databaseSizeBeforeUpdate = actionRepository.findAll().size();
        action.setId(UUID.randomUUID().toString());

        // Create the Action
        ActionDTO actionDTO = actionMapper.toDto(action);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, actionDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAction() throws Exception {
        int databaseSizeBeforeUpdate = actionRepository.findAll().size();
        action.setId(UUID.randomUUID().toString());

        // Create the Action
        ActionDTO actionDTO = actionMapper.toDto(action);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAction() throws Exception {
        int databaseSizeBeforeUpdate = actionRepository.findAll().size();
        action.setId(UUID.randomUUID().toString());

        // Create the Action
        ActionDTO actionDTO = actionMapper.toDto(action);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(actionDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Action in the database
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAction() throws Exception {
        // Initialize the database
        actionRepository.saveAndFlush(action);

        int databaseSizeBeforeDelete = actionRepository.findAll().size();

        // Delete the action
        restActionMockMvc
            .perform(delete(ENTITY_API_URL_ID, action.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Action> actionList = actionRepository.findAll();
        assertThat(actionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

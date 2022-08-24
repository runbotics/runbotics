package com.runbotics.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.runbotics.IntegrationTest;
import com.runbotics.domain.DocumentationPage;
import com.runbotics.repository.DocumentationPageRepository;
import com.runbotics.service.criteria.DocumentationPageCriteria;
import com.runbotics.service.dto.DocumentationPageDTO;
import com.runbotics.service.mapper.DocumentationPageMapper;
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
 * Integration tests for the {@link DocumentationPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DocumentationPageResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/documentation-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DocumentationPageRepository documentationPageRepository;

    @Autowired
    private DocumentationPageMapper documentationPageMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDocumentationPageMockMvc;

    private DocumentationPage documentationPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocumentationPage createEntity(EntityManager em) {
        DocumentationPage documentationPage = new DocumentationPage().title(DEFAULT_TITLE).content(DEFAULT_CONTENT);
        return documentationPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocumentationPage createUpdatedEntity(EntityManager em) {
        DocumentationPage documentationPage = new DocumentationPage().title(UPDATED_TITLE).content(UPDATED_CONTENT);
        return documentationPage;
    }

    @BeforeEach
    public void initTest() {
        documentationPage = createEntity(em);
    }

    @Test
    @Transactional
    void createDocumentationPage() throws Exception {
        int databaseSizeBeforeCreate = documentationPageRepository.findAll().size();
        // Create the DocumentationPage
        DocumentationPageDTO documentationPageDTO = documentationPageMapper.toDto(documentationPage);
        restDocumentationPageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentationPageDTO))
            )
            .andExpect(status().isCreated());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeCreate + 1);
        DocumentationPage testDocumentationPage = documentationPageList.get(documentationPageList.size() - 1);
        assertThat(testDocumentationPage.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testDocumentationPage.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    void createDocumentationPageWithExistingId() throws Exception {
        // Create the DocumentationPage with an existing ID
        documentationPage.setId(1L);
        DocumentationPageDTO documentationPageDTO = documentationPageMapper.toDto(documentationPage);

        int databaseSizeBeforeCreate = documentationPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocumentationPageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentationPageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDocumentationPages() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        // Get all the documentationPageList
        restDocumentationPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documentationPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())));
    }

    @Test
    @Transactional
    void getDocumentationPage() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        // Get the documentationPage
        restDocumentationPageMockMvc
            .perform(get(ENTITY_API_URL_ID, documentationPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(documentationPage.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()));
    }

    @Test
    @Transactional
    void getDocumentationPagesByIdFiltering() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        Long id = documentationPage.getId();

        defaultDocumentationPageShouldBeFound("id.equals=" + id);
        defaultDocumentationPageShouldNotBeFound("id.notEquals=" + id);

        defaultDocumentationPageShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultDocumentationPageShouldNotBeFound("id.greaterThan=" + id);

        defaultDocumentationPageShouldBeFound("id.lessThanOrEqual=" + id);
        defaultDocumentationPageShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllDocumentationPagesByTitleIsEqualToSomething() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        // Get all the documentationPageList where title equals to DEFAULT_TITLE
        defaultDocumentationPageShouldBeFound("title.equals=" + DEFAULT_TITLE);

        // Get all the documentationPageList where title equals to UPDATED_TITLE
        defaultDocumentationPageShouldNotBeFound("title.equals=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllDocumentationPagesByTitleIsNotEqualToSomething() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        // Get all the documentationPageList where title not equals to DEFAULT_TITLE
        defaultDocumentationPageShouldNotBeFound("title.notEquals=" + DEFAULT_TITLE);

        // Get all the documentationPageList where title not equals to UPDATED_TITLE
        defaultDocumentationPageShouldBeFound("title.notEquals=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllDocumentationPagesByTitleIsInShouldWork() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        // Get all the documentationPageList where title in DEFAULT_TITLE or UPDATED_TITLE
        defaultDocumentationPageShouldBeFound("title.in=" + DEFAULT_TITLE + "," + UPDATED_TITLE);

        // Get all the documentationPageList where title equals to UPDATED_TITLE
        defaultDocumentationPageShouldNotBeFound("title.in=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllDocumentationPagesByTitleIsNullOrNotNull() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        // Get all the documentationPageList where title is not null
        defaultDocumentationPageShouldBeFound("title.specified=true");

        // Get all the documentationPageList where title is null
        defaultDocumentationPageShouldNotBeFound("title.specified=false");
    }

    @Test
    @Transactional
    void getAllDocumentationPagesByTitleContainsSomething() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        // Get all the documentationPageList where title contains DEFAULT_TITLE
        defaultDocumentationPageShouldBeFound("title.contains=" + DEFAULT_TITLE);

        // Get all the documentationPageList where title contains UPDATED_TITLE
        defaultDocumentationPageShouldNotBeFound("title.contains=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllDocumentationPagesByTitleNotContainsSomething() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        // Get all the documentationPageList where title does not contain DEFAULT_TITLE
        defaultDocumentationPageShouldNotBeFound("title.doesNotContain=" + DEFAULT_TITLE);

        // Get all the documentationPageList where title does not contain UPDATED_TITLE
        defaultDocumentationPageShouldBeFound("title.doesNotContain=" + UPDATED_TITLE);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultDocumentationPageShouldBeFound(String filter) throws Exception {
        restDocumentationPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documentationPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())));

        // Check, that the count call also returns 1
        restDocumentationPageMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultDocumentationPageShouldNotBeFound(String filter) throws Exception {
        restDocumentationPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restDocumentationPageMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingDocumentationPage() throws Exception {
        // Get the documentationPage
        restDocumentationPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDocumentationPage() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        int databaseSizeBeforeUpdate = documentationPageRepository.findAll().size();

        // Update the documentationPage
        DocumentationPage updatedDocumentationPage = documentationPageRepository.findById(documentationPage.getId()).get();
        // Disconnect from session so that the updates on updatedDocumentationPage are not directly saved in db
        em.detach(updatedDocumentationPage);
        updatedDocumentationPage.title(UPDATED_TITLE).content(UPDATED_CONTENT);
        DocumentationPageDTO documentationPageDTO = documentationPageMapper.toDto(updatedDocumentationPage);

        restDocumentationPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, documentationPageDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentationPageDTO))
            )
            .andExpect(status().isOk());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeUpdate);
        DocumentationPage testDocumentationPage = documentationPageList.get(documentationPageList.size() - 1);
        assertThat(testDocumentationPage.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testDocumentationPage.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void putNonExistingDocumentationPage() throws Exception {
        int databaseSizeBeforeUpdate = documentationPageRepository.findAll().size();
        documentationPage.setId(count.incrementAndGet());

        // Create the DocumentationPage
        DocumentationPageDTO documentationPageDTO = documentationPageMapper.toDto(documentationPage);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentationPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, documentationPageDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentationPageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDocumentationPage() throws Exception {
        int databaseSizeBeforeUpdate = documentationPageRepository.findAll().size();
        documentationPage.setId(count.incrementAndGet());

        // Create the DocumentationPage
        DocumentationPageDTO documentationPageDTO = documentationPageMapper.toDto(documentationPage);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentationPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentationPageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDocumentationPage() throws Exception {
        int databaseSizeBeforeUpdate = documentationPageRepository.findAll().size();
        documentationPage.setId(count.incrementAndGet());

        // Create the DocumentationPage
        DocumentationPageDTO documentationPageDTO = documentationPageMapper.toDto(documentationPage);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentationPageMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(documentationPageDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDocumentationPageWithPatch() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        int databaseSizeBeforeUpdate = documentationPageRepository.findAll().size();

        // Update the documentationPage using partial update
        DocumentationPage partialUpdatedDocumentationPage = new DocumentationPage();
        partialUpdatedDocumentationPage.setId(documentationPage.getId());

        partialUpdatedDocumentationPage.content(UPDATED_CONTENT);

        restDocumentationPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocumentationPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDocumentationPage))
            )
            .andExpect(status().isOk());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeUpdate);
        DocumentationPage testDocumentationPage = documentationPageList.get(documentationPageList.size() - 1);
        assertThat(testDocumentationPage.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testDocumentationPage.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void fullUpdateDocumentationPageWithPatch() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        int databaseSizeBeforeUpdate = documentationPageRepository.findAll().size();

        // Update the documentationPage using partial update
        DocumentationPage partialUpdatedDocumentationPage = new DocumentationPage();
        partialUpdatedDocumentationPage.setId(documentationPage.getId());

        partialUpdatedDocumentationPage.title(UPDATED_TITLE).content(UPDATED_CONTENT);

        restDocumentationPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocumentationPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDocumentationPage))
            )
            .andExpect(status().isOk());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeUpdate);
        DocumentationPage testDocumentationPage = documentationPageList.get(documentationPageList.size() - 1);
        assertThat(testDocumentationPage.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testDocumentationPage.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void patchNonExistingDocumentationPage() throws Exception {
        int databaseSizeBeforeUpdate = documentationPageRepository.findAll().size();
        documentationPage.setId(count.incrementAndGet());

        // Create the DocumentationPage
        DocumentationPageDTO documentationPageDTO = documentationPageMapper.toDto(documentationPage);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentationPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, documentationPageDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(documentationPageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDocumentationPage() throws Exception {
        int databaseSizeBeforeUpdate = documentationPageRepository.findAll().size();
        documentationPage.setId(count.incrementAndGet());

        // Create the DocumentationPage
        DocumentationPageDTO documentationPageDTO = documentationPageMapper.toDto(documentationPage);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentationPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(documentationPageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDocumentationPage() throws Exception {
        int databaseSizeBeforeUpdate = documentationPageRepository.findAll().size();
        documentationPage.setId(count.incrementAndGet());

        // Create the DocumentationPage
        DocumentationPageDTO documentationPageDTO = documentationPageMapper.toDto(documentationPage);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentationPageMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(documentationPageDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DocumentationPage in the database
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDocumentationPage() throws Exception {
        // Initialize the database
        documentationPageRepository.saveAndFlush(documentationPage);

        int databaseSizeBeforeDelete = documentationPageRepository.findAll().size();

        // Delete the documentationPage
        restDocumentationPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, documentationPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DocumentationPage> documentationPageList = documentationPageRepository.findAll();
        assertThat(documentationPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

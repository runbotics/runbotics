package com.runbotics.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DocumentationPageDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentationPageDTO.class);
        DocumentationPageDTO documentationPageDTO1 = new DocumentationPageDTO();
        documentationPageDTO1.setId(1L);
        DocumentationPageDTO documentationPageDTO2 = new DocumentationPageDTO();
        assertThat(documentationPageDTO1).isNotEqualTo(documentationPageDTO2);
        documentationPageDTO2.setId(documentationPageDTO1.getId());
        assertThat(documentationPageDTO1).isEqualTo(documentationPageDTO2);
        documentationPageDTO2.setId(2L);
        assertThat(documentationPageDTO1).isNotEqualTo(documentationPageDTO2);
        documentationPageDTO1.setId(null);
        assertThat(documentationPageDTO1).isNotEqualTo(documentationPageDTO2);
    }
}

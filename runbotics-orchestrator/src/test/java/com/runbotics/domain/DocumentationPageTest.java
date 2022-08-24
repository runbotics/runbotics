package com.runbotics.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DocumentationPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentationPage.class);
        DocumentationPage documentationPage1 = new DocumentationPage();
        documentationPage1.setId(1L);
        DocumentationPage documentationPage2 = new DocumentationPage();
        documentationPage2.setId(documentationPage1.getId());
        assertThat(documentationPage1).isEqualTo(documentationPage2);
        documentationPage2.setId(2L);
        assertThat(documentationPage1).isNotEqualTo(documentationPage2);
        documentationPage1.setId(null);
        assertThat(documentationPage1).isNotEqualTo(documentationPage2);
    }
}

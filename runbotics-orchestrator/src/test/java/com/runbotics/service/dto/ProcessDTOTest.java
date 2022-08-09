package com.runbotics.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProcessDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProcessDTO.class);
        ProcessDTO processDTO1 = new ProcessDTO();
        processDTO1.setId(1L);
        ProcessDTO processDTO2 = new ProcessDTO();
        assertThat(processDTO1).isNotEqualTo(processDTO2);
        processDTO2.setId(processDTO1.getId());
        assertThat(processDTO1).isEqualTo(processDTO2);
        processDTO2.setId(2L);
        assertThat(processDTO1).isNotEqualTo(processDTO2);
        processDTO1.setId(null);
        assertThat(processDTO1).isNotEqualTo(processDTO2);
    }
}

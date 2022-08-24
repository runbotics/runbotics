package com.runbotics.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProcessInstanceEventDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProcessInstanceEventDTO.class);
        ProcessInstanceEventDTO processInstanceEventDTO1 = new ProcessInstanceEventDTO();
        processInstanceEventDTO1.setId(1L);
        ProcessInstanceEventDTO processInstanceEventDTO2 = new ProcessInstanceEventDTO();
        assertThat(processInstanceEventDTO1).isNotEqualTo(processInstanceEventDTO2);
        processInstanceEventDTO2.setId(processInstanceEventDTO1.getId());
        assertThat(processInstanceEventDTO1).isEqualTo(processInstanceEventDTO2);
        processInstanceEventDTO2.setId(2L);
        assertThat(processInstanceEventDTO1).isNotEqualTo(processInstanceEventDTO2);
        processInstanceEventDTO1.setId(null);
        assertThat(processInstanceEventDTO1).isNotEqualTo(processInstanceEventDTO2);
    }
}

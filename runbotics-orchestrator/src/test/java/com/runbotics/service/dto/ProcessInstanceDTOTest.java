package com.runbotics.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ProcessInstanceDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProcessInstanceDTO.class);
        ProcessInstanceDTO processInstanceDTO1 = new ProcessInstanceDTO();
        processInstanceDTO1.setId(UUID.randomUUID());
        ProcessInstanceDTO processInstanceDTO2 = new ProcessInstanceDTO();
        assertThat(processInstanceDTO1).isNotEqualTo(processInstanceDTO2);
        processInstanceDTO2.setId(processInstanceDTO1.getId());
        assertThat(processInstanceDTO1).isEqualTo(processInstanceDTO2);
        processInstanceDTO2.setId(UUID.randomUUID());
        assertThat(processInstanceDTO1).isNotEqualTo(processInstanceDTO2);
        processInstanceDTO1.setId(null);
        assertThat(processInstanceDTO1).isNotEqualTo(processInstanceDTO2);
    }
}

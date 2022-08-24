package com.runbotics.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GlobalVariableDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GlobalVariableDTO.class);
        GlobalVariableDTO globalVariableDTO1 = new GlobalVariableDTO();
        globalVariableDTO1.setId(1L);
        GlobalVariableDTO globalVariableDTO2 = new GlobalVariableDTO();
        assertThat(globalVariableDTO1).isNotEqualTo(globalVariableDTO2);
        globalVariableDTO2.setId(globalVariableDTO1.getId());
        assertThat(globalVariableDTO1).isEqualTo(globalVariableDTO2);
        globalVariableDTO2.setId(2L);
        assertThat(globalVariableDTO1).isNotEqualTo(globalVariableDTO2);
        globalVariableDTO1.setId(null);
        assertThat(globalVariableDTO1).isNotEqualTo(globalVariableDTO2);
    }
}

package com.runbotics.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GlobalVariableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GlobalVariable.class);
        GlobalVariable globalVariable1 = new GlobalVariable();
        globalVariable1.setId(1L);
        GlobalVariable globalVariable2 = new GlobalVariable();
        globalVariable2.setId(globalVariable1.getId());
        assertThat(globalVariable1).isEqualTo(globalVariable2);
        globalVariable2.setId(2L);
        assertThat(globalVariable1).isNotEqualTo(globalVariable2);
        globalVariable1.setId(null);
        assertThat(globalVariable1).isNotEqualTo(globalVariable2);
    }
}

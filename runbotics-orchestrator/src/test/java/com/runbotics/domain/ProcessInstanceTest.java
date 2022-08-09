package com.runbotics.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ProcessInstanceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProcessInstance.class);
        ProcessInstance processInstance1 = new ProcessInstance();
        processInstance1.setId(UUID.randomUUID());
        ProcessInstance processInstance2 = new ProcessInstance();
        processInstance2.setId(processInstance1.getId());
        assertThat(processInstance1).isEqualTo(processInstance2);
        processInstance2.setId(UUID.randomUUID());
        assertThat(processInstance1).isNotEqualTo(processInstance2);
        processInstance1.setId(null);
        assertThat(processInstance1).isNotEqualTo(processInstance2);
    }
}

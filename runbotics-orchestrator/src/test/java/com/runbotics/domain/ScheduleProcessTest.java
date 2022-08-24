package com.runbotics.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ScheduleProcessTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ScheduleProcess.class);
        ScheduleProcess scheduleProcess1 = new ScheduleProcess();
        scheduleProcess1.setId(1L);
        ScheduleProcess scheduleProcess2 = new ScheduleProcess();
        scheduleProcess2.setId(scheduleProcess1.getId());
        assertThat(scheduleProcess1).isEqualTo(scheduleProcess2);
        scheduleProcess2.setId(2L);
        assertThat(scheduleProcess1).isNotEqualTo(scheduleProcess2);
        scheduleProcess1.setId(null);
        assertThat(scheduleProcess1).isNotEqualTo(scheduleProcess2);
    }
}

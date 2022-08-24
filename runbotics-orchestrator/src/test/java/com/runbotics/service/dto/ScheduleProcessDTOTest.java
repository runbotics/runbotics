package com.runbotics.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ScheduleProcessDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ScheduleProcessDTO.class);
        ScheduleProcessDTO scheduleProcessDTO1 = new ScheduleProcessDTO();
        scheduleProcessDTO1.setId(1L);
        ScheduleProcessDTO scheduleProcessDTO2 = new ScheduleProcessDTO();
        assertThat(scheduleProcessDTO1).isNotEqualTo(scheduleProcessDTO2);
        scheduleProcessDTO2.setId(scheduleProcessDTO1.getId());
        assertThat(scheduleProcessDTO1).isEqualTo(scheduleProcessDTO2);
        scheduleProcessDTO2.setId(2L);
        assertThat(scheduleProcessDTO1).isNotEqualTo(scheduleProcessDTO2);
        scheduleProcessDTO1.setId(null);
        assertThat(scheduleProcessDTO1).isNotEqualTo(scheduleProcessDTO2);
    }
}

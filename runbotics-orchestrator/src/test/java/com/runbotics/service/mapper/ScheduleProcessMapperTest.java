package com.runbotics.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ScheduleProcessMapperTest {

    private ScheduleProcessMapper scheduleProcessMapper;

    @BeforeEach
    public void setUp() {
        scheduleProcessMapper = new ScheduleProcessMapperImpl();
    }
}

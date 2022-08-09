package com.runbotics.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProcessInstanceEventMapperTest {

    private ProcessInstanceEventMapper processInstanceEventMapper;

    @BeforeEach
    public void setUp() {
        processInstanceEventMapper = new ProcessInstanceEventMapperImpl();
    }
}

package com.runbotics.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProcessInstanceMapperTest {

    private ProcessInstanceMapper processInstanceMapper;

    @BeforeEach
    public void setUp() {
        processInstanceMapper = new ProcessInstanceMapperImpl();
    }
}

package com.runbotics.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProcessMapperTest {

    private ProcessMapper processMapper;

    @BeforeEach
    public void setUp() {
        processMapper = new ProcessMapperImpl();
    }
}

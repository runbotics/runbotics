package com.runbotics.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DocumentationPageMapperTest {

    private DocumentationPageMapper documentationPageMapper;

    @BeforeEach
    public void setUp() {
        documentationPageMapper = new DocumentationPageMapperImpl();
    }
}

package com.runbotics.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ActionDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActionDTO.class);
        ActionDTO actionDTO1 = new ActionDTO();
        actionDTO1.setId("id1");
        ActionDTO actionDTO2 = new ActionDTO();
        assertThat(actionDTO1).isNotEqualTo(actionDTO2);
        actionDTO2.setId(actionDTO1.getId());
        assertThat(actionDTO1).isEqualTo(actionDTO2);
        actionDTO2.setId("id2");
        assertThat(actionDTO1).isNotEqualTo(actionDTO2);
        actionDTO1.setId(null);
        assertThat(actionDTO1).isNotEqualTo(actionDTO2);
    }
}

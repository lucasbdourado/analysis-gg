package com.analysisgg.modules.riotapi.domain.valueobject;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PuuidTest {

    @Test
    void shouldCreatePuuidWithValidValue() {
        Puuid puuid = new Puuid("12345-abcde");
        assertThat(puuid.value()).isEqualTo("12345-abcde");
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   ", "\t", "\n"})
    void shouldRejectBlankPuuid(String value) {
        assertThatThrownBy(() -> new Puuid(value))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void shouldRejectNullPuuid() {
        assertThatThrownBy(() -> new Puuid(null))
                .isInstanceOf(IllegalArgumentException.class);
    }
}

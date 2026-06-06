package com.analysisgg.modules.riotapi.domain.valueobject;

import com.analysisgg.modules.riotapi.domain.exception.InvalidRiotIdException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RiotIdTest {

    @Test
    void shouldCreateRiotIdWithValidInputs() {
        RiotId riotId = new RiotId("T1 Faker", "KR1");
        assertThat(riotId.gameName()).isEqualTo("T1 Faker");
        assertThat(riotId.tagLine()).isEqualTo("KR1");
    }

    @ParameterizedTest
    @ValueSource(strings = {"Faker", "a_b-c.d", "123", "a b c d e f g h"})
    void shouldAcceptValidGameNames(String gameName) {
        RiotId riotId = new RiotId(gameName, "12345");
        assertThat(riotId.gameName()).isEqualTo(gameName);
    }

    @ParameterizedTest
    @ValueSource(strings = {"ab", "a" + "a" + "a" + "a" + "a" + "a" + "a" + "a" + "a" + "a" + "a" + "a" + "a" + "a" + "a" + "a" + "a", "name@tag", "name!tag"})
    void shouldRejectInvalidGameNames(String gameName) {
        assertThatThrownBy(() -> new RiotId(gameName, "12345"))
                .isInstanceOf(InvalidRiotIdException.class);
    }

    @ParameterizedTest
    @ValueSource(strings = {"123", "1234", "12345", "ABCDE", "abc"})
    void shouldAcceptValidTagLines(String tagLine) {
        RiotId riotId = new RiotId("Faker", tagLine);
        assertThat(riotId.tagLine()).isEqualTo(tagLine);
    }

    @ParameterizedTest
    @ValueSource(strings = {"12", "123456", "abc-d", "abc#d"})
    void shouldRejectInvalidTagLines(String tagLine) {
        assertThatThrownBy(() -> new RiotId("Faker", tagLine))
                .isInstanceOf(InvalidRiotIdException.class);
    }

    @Test
    void shouldRejectNullInputs() {
        assertThatThrownBy(() -> new RiotId(null, "123"))
                .isInstanceOf(InvalidRiotIdException.class);
        assertThatThrownBy(() -> new RiotId("Faker", null))
                .isInstanceOf(InvalidRiotIdException.class);
    }

    @Test
    void shouldParseValidRiotIdString() {
        RiotId riotId = RiotId.parse("T1 Faker#KR1");
        assertThat(riotId.gameName()).isEqualTo("T1 Faker");
        assertThat(riotId.tagLine()).isEqualTo("KR1");
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "Faker", "Faker#", "#KR1", "Faker#KR#1", "Faker#KR12345"})
    void shouldRejectInvalidRiotIdStringsOnParse(String riotIdStr) {
        assertThatThrownBy(() -> RiotId.parse(riotIdStr))
                .isInstanceOf(InvalidRiotIdException.class);
    }

    @Test
    void shouldRejectNullStringOnParse() {
        assertThatThrownBy(() -> RiotId.parse(null))
                .isInstanceOf(InvalidRiotIdException.class);
    }

    @Test
    void shouldFormatToStringCorrectly() {
        RiotId riotId = new RiotId("T1 Faker", "KR1");
        assertThat(riotId.toString()).isEqualTo("T1 Faker#KR1");
    }
}

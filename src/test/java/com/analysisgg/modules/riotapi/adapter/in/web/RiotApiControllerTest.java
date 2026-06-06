package com.analysisgg.modules.riotapi.adapter.in.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.analysisgg.modules.riotapi.application.usecase.SyncPlayerProfileUseCase;
import com.analysisgg.modules.riotapi.domain.exception.*;
import com.analysisgg.modules.riotapi.domain.model.PlayerAnalytics;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.ResourceAccessException;

@WebMvcTest(RiotApiController.class)
class RiotApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SyncPlayerProfileUseCase syncPlayerProfileUseCase;

    @MockBean
    private RiotApiWebMapper mapper;

    @Test
    void shouldReturnPlayerAnalyticsResponseOnSuccess() throws Exception {
        RiotId riotId = new RiotId("Ahri", "123");
        Region region = new Region("br1");
        int count = 20;

        PlayerAnalytics analytics = new PlayerAnalytics(
                "puuid-123", "Ahri", "123", "br1", Collections.emptyList()
        );
        PlayerAnalyticsResponse responseDto = new PlayerAnalyticsResponse(
                "puuid-123", "Ahri", "123", "br1", Collections.emptyList()
        );

        when(syncPlayerProfileUseCase.execute(eq(riotId), eq(region), eq(count)))
                .thenReturn(analytics);
        when(mapper.toResponse(analytics)).thenReturn(responseDto);

        mockMvc.perform(get("/api/summoner/Ahri/123")
                        .param("region", "br1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.puuid").value("puuid-123"))
                .andExpect(jsonPath("$.gameName").value("Ahri"))
                .andExpect(jsonPath("$.tagLine").value("123"))
                .andExpect(jsonPath("$.region").value("br1"))
                .andExpect(jsonPath("$.matches").isEmpty());

        verify(syncPlayerProfileUseCase).execute(riotId, region, count);
        verify(mapper).toResponse(analytics);
    }

    @Test
    void shouldReturnBadRequestWhenGameNameIsInvalid() throws Exception {
        // gameName too short (less than 3 chars)
        mockMvc.perform(get("/api/summoner/Ah/123")
                        .param("region", "br1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").exists());

        verifyNoInteractions(syncPlayerProfileUseCase);
    }

    @Test
    void shouldReturnBadRequestWhenTagLineIsInvalid() throws Exception {
        // tagLine too short (less than 3 chars)
        mockMvc.perform(get("/api/summoner/Ahri/12")
                        .param("region", "br1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").exists());

        verifyNoInteractions(syncPlayerProfileUseCase);
    }

    @Test
    void shouldReturnBadRequestWhenRegionIsUnsupported() throws Exception {
        mockMvc.perform(get("/api/summoner/Ahri/123")
                        .param("region", "invalid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").exists());

        verifyNoInteractions(syncPlayerProfileUseCase);
    }

    @Test
    void shouldReturnBadRequestWhenRegionIsMissing() throws Exception {
        mockMvc.perform(get("/api/summoner/Ahri/123"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(syncPlayerProfileUseCase);
    }

    @Test
    void shouldClampCountParameterToMinimumOfOne() throws Exception {
        RiotId riotId = new RiotId("Ahri", "123");
        Region region = new Region("br1");

        when(syncPlayerProfileUseCase.execute(eq(riotId), eq(region), eq(1)))
                .thenReturn(new PlayerAnalytics("puuid-123", "Ahri", "123", "br1", Collections.emptyList()));

        mockMvc.perform(get("/api/summoner/Ahri/123")
                        .param("region", "br1")
                        .param("count", "0"))
                .andExpect(status().isOk());

        verify(syncPlayerProfileUseCase).execute(riotId, region, 1);
    }

    @Test
    void shouldClampCountParameterToMaximumOfOneHundred() throws Exception {
        RiotId riotId = new RiotId("Ahri", "123");
        Region region = new Region("br1");

        when(syncPlayerProfileUseCase.execute(eq(riotId), eq(region), eq(100)))
                .thenReturn(new PlayerAnalytics("puuid-123", "Ahri", "123", "br1", Collections.emptyList()));

        mockMvc.perform(get("/api/summoner/Ahri/123")
                        .param("region", "br1")
                        .param("count", "150"))
                .andExpect(status().isOk());

        verify(syncPlayerProfileUseCase).execute(riotId, region, 100);
    }

    @Test
    void shouldReturnNotFoundWhenPlayerNotFound() throws Exception {
        when(syncPlayerProfileUseCase.execute(any(), any(), anyInt()))
                .thenThrow(new PlayerNotFoundException("Player not found in Riot servers"));

        mockMvc.perform(get("/api/summoner/Ahri/123")
                        .param("region", "br1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Player not found in Riot servers"));
    }

    @Test
    void shouldReturnTooManyRequestsWhenRateLimited() throws Exception {
        when(syncPlayerProfileUseCase.execute(any(), any(), anyInt()))
                .thenThrow(new RateLimitExceededException("Rate limit exceeded"));

        mockMvc.perform(get("/api/summoner/Ahri/123")
                        .param("region", "br1"))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.error").value("Too Many Requests"))
                .andExpect(jsonPath("$.message").value("Rate limit exceeded"));
    }

    @Test
    void shouldReturnGatewayTimeoutWhenResourceAccessExceptionOccurs() throws Exception {
        when(syncPlayerProfileUseCase.execute(any(), any(), anyInt()))
                .thenThrow(new ResourceAccessException("I/O error on GET request: Connection timed out"));

        mockMvc.perform(get("/api/summoner/Ahri/123")
                        .param("region", "br1"))
                .andExpect(status().isGatewayTimeout())
                .andExpect(jsonPath("$.error").value("Gateway Timeout"))
                .andExpect(jsonPath("$.message").value("The connection to Riot API timed out."));
    }

    @Test
    void shouldReturnGatewayTimeoutWhenRiotApiTimeoutOccurs() throws Exception {
        when(syncPlayerProfileUseCase.execute(any(), any(), anyInt()))
                .thenThrow(new RiotApiException("Riot API request timed out"));

        mockMvc.perform(get("/api/summoner/Ahri/123")
                        .param("region", "br1"))
                .andExpect(status().isGatewayTimeout())
                .andExpect(jsonPath("$.error").value("Gateway Timeout"))
                .andExpect(jsonPath("$.message").value("Riot API request timed out"));
    }

    @Test
    void shouldReturnInternalServerErrorWhenGeneralRiotApiExceptionOccurs() throws Exception {
        when(syncPlayerProfileUseCase.execute(any(), any(), anyInt()))
                .thenThrow(new RiotApiException("Riot API returned 500 Internal Server Error"));

        mockMvc.perform(get("/api/summoner/Ahri/123")
                        .param("region", "br1"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Internal Server Error"))
                .andExpect(jsonPath("$.message").value("Riot API returned 500 Internal Server Error"));
    }

    @Test
    void shouldReturnInternalServerErrorWhenUnhandledExceptionOccurs() throws Exception {
        when(syncPlayerProfileUseCase.execute(any(), any(), anyInt()))
                .thenThrow(new RuntimeException("Unexpected DB error"));

        mockMvc.perform(get("/api/summoner/Ahri/123")
                        .param("region", "br1"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Internal Server Error"))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred."));
    }
}

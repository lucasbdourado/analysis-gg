package com.analysisgg.modules.riotapi;

import com.analysisgg.modules.riotapi.application.port.PlayerProfileCachePort;
import com.analysisgg.modules.riotapi.application.port.RiotApiClientPort;
import com.analysisgg.modules.riotapi.application.usecase.SyncPlayerProfileUseCase;
import com.analysisgg.modules.riotapi.application.usecase.GetMatchDetailUseCase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RiotApiModuleConfiguration {

    @Bean
    public SyncPlayerProfileUseCase syncPlayerProfileUseCase(
            RiotApiClientPort riotApiClientPort,
            PlayerProfileCachePort playerProfileCachePort
    ) {
        return new SyncPlayerProfileUseCase(riotApiClientPort, playerProfileCachePort);
    }

    @Bean
    public GetMatchDetailUseCase getMatchDetailUseCase(
            RiotApiClientPort riotApiClientPort,
            PlayerProfileCachePort playerProfileCachePort
    ) {
        return new GetMatchDetailUseCase(riotApiClientPort, playerProfileCachePort);
    }
}

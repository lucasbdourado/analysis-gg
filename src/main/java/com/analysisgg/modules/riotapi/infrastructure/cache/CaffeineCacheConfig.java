package com.analysisgg.modules.riotapi.infrastructure.cache;

import com.analysisgg.modules.riotapi.adapter.out.cache.MatchSummaryCacheKey;
import com.analysisgg.modules.riotapi.adapter.out.cache.ProfileCacheKey;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.RiotAccount;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.concurrent.TimeUnit;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CaffeineCacheConfig {

    @Bean
    public Cache<ProfileCacheKey, RiotAccount> playerProfileCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(15, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build();
    }

    @Bean
    public Cache<MatchSummaryCacheKey, MatchSummary> matchSummaryCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(24, TimeUnit.HOURS)
                .maximumSize(10000)
                .build();
    }
}

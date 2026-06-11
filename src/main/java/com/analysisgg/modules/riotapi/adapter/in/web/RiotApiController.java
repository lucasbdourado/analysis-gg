package com.analysisgg.modules.riotapi.adapter.in.web;

import com.analysisgg.modules.riotapi.application.usecase.SyncPlayerProfileUseCase;
import com.analysisgg.modules.riotapi.application.usecase.GetMatchDetailUseCase;
import com.analysisgg.modules.riotapi.domain.model.PlayerAnalytics;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class RiotApiController {

    private final SyncPlayerProfileUseCase syncPlayerProfileUseCase;
    private final GetMatchDetailUseCase getMatchDetailUseCase;
    private final RiotApiWebMapper mapper;

    public RiotApiController(
            SyncPlayerProfileUseCase syncPlayerProfileUseCase,
            GetMatchDetailUseCase getMatchDetailUseCase,
            RiotApiWebMapper mapper
    ) {
        this.syncPlayerProfileUseCase = syncPlayerProfileUseCase;
        this.getMatchDetailUseCase = getMatchDetailUseCase;
        this.mapper = mapper;
    }

    @GetMapping("/api/summoner/{gameName}/{tagLine}")
    public ResponseEntity<PlayerAnalyticsResponse> getPlayerAnalytics(
            @PathVariable String gameName,
            @PathVariable String tagLine,
            @RequestParam String region,
            @RequestParam(required = false, defaultValue = "20") Integer count,
            @RequestParam(required = false) Integer queue
    ) {
        RiotId riotId = new RiotId(gameName, tagLine);
        Region regionVo = new Region(region);
        
        int clampedCount = Math.max(1, Math.min(100, count != null ? count : 20));

        PlayerAnalytics analytics;
        if (queue != null) {
            analytics = syncPlayerProfileUseCase.execute(riotId, regionVo, clampedCount, queue);
        } else {
            analytics = syncPlayerProfileUseCase.execute(riotId, regionVo, clampedCount);
        }
        
        return ResponseEntity.ok(mapper.toResponse(analytics));
    }

    @GetMapping("/api/match/{matchId}")
    public ResponseEntity<MatchResponse> getMatchDetail(
            @PathVariable String matchId,
            @RequestParam String region,
            @RequestParam String name,
            @RequestParam String tag
    ) {
        RiotId riotId = new RiotId(name, tag);
        Region regionVo = new Region(region);
        MatchSummary match = getMatchDetailUseCase.execute(matchId, regionVo, riotId);
        return ResponseEntity.ok(mapper.toMatchResponse(match));
    }
}

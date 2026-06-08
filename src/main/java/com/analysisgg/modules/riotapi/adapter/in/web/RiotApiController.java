package com.analysisgg.modules.riotapi.adapter.in.web;

import com.analysisgg.modules.riotapi.application.usecase.SyncPlayerProfileUseCase;
import com.analysisgg.modules.riotapi.domain.model.PlayerAnalytics;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summoner")
public class RiotApiController {

    private final SyncPlayerProfileUseCase syncPlayerProfileUseCase;
    private final RiotApiWebMapper mapper;

    public RiotApiController(
            SyncPlayerProfileUseCase syncPlayerProfileUseCase,
            RiotApiWebMapper mapper
    ) {
        this.syncPlayerProfileUseCase = syncPlayerProfileUseCase;
        this.mapper = mapper;
    }

    @GetMapping("/{gameName}/{tagLine}")
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
}

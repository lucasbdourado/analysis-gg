# Analysis.GG — Future Feature Ideas

## Context

The current MVP of Analysis.GG has already been implemented. The product is a web-based League of Legends analysis tool focused on helping ranked players understand their performance, identify recurring patterns, and improve over time.

The original PRD defines Analysis.GG as more than a raw statistics dashboard. Its goal is to help players find negative patterns, understand consistency issues, analyze performance by time/day/champion, and compare their metrics with stronger players.

After the MVP, the next direction should be to differentiate Analysis.GG from products like OP.GG, U.GG, and similar platforms. Instead of competing mainly on match history, builds, runes, tier lists, or generic statistics, Analysis.GG should evolve into a personal ranked performance coach.

## Product Direction

The main product direction for future features is:

> Analysis.GG should not only show what happened in the player's matches. It should explain what patterns are affecting the player's climb and suggest what the player should focus on next.

The product should move from:

> “Here are your stats.”

To:

> “Here is what is probably stopping you from climbing, when it happens, and what you should focus on next.”

## Differentiation Strategy

Most League of Legends analytics tools focus on:

* Match history
* Champion statistics
* Win rates
* Builds
* Runes
* Tier lists
* Meta trends
* Individual post-match stats

Analysis.GG should focus on:

* Personal performance patterns
* Session behavior
* Champion pool quality
* Self-comparison
* Game phase weaknesses
* Practical improvement plans
* Ranked consistency

The key differentiation is to make the product feel like a coach, not just a statistics dashboard.

---

# Feature Ideas

## 1. Automatic Session Review

### Summary

Generate an automatic summary after a group of matches, helping the player understand how the session went.

### Goal

Give the player a clear post-session review with the most important takeaways.

### Example Output

> You played 5 matches: 3 wins and 2 losses.
> Your best champion was Ahri.
> Your strongest point was early-game farming.
> Your weakest point was dying before objectives.
> Recommendation: stop the session now or play one more match using the same champion pool.

### Possible Data Used

* Matches played in the same day
* Matches added after the latest sync
* Win/loss count
* Champion performance
* KDA
* Death count
* CS/min
* Queue type
* Match duration
* Time between matches

### MVP Version

The first version can be simple:

* Group matches by day or by latest sync.
* Show wins, losses, win rate, best champion, worst champion, and general recommendation.
* Avoid complex conclusions until more pattern analysis exists.

### Why It Matters

This feature gives the user a clear summary without requiring them to manually inspect every match.

### Implementation Difficulty

Easy.

This should be one of the first post-MVP features because it can reuse existing match data and simple aggregations.

---

## 2. Compare Against “Your Best Self”

### Summary

Compare the player’s current performance against their own best performances, instead of only comparing against high elo averages.

### Goal

Help the player understand what changes when they play well.

### Example Output

> In your wins with Jinx, you average 7.1 CS/min and 4.2 deaths.
> In your losses with Jinx, you average 5.8 CS/min and 7.3 deaths.
> Your biggest difference with Jinx appears to be mid-game survival.

### Possible Comparisons

* Wins vs losses
* Current period vs best period
* Current 20 matches vs best 20-match window
* Champion wins vs champion losses
* Role performance when winning vs losing
* Good sessions vs bad sessions

### Possible Metrics

* CS/min
* KDA
* Deaths
* Kill participation
* Vision score
* Damage dealt
* Gold earned
* Match duration
* Champion win rate

### MVP Version

Start with:

* Wins vs losses comparison.
* Champion-specific comparison when there is enough sample size.
* Current recent matches vs historical average.

### Required Rules

* Do not generate conclusions with too little data.
* Define minimum sample size before showing insights.
* If data is insufficient, show a friendly fallback.

### Why It Matters

This feature is personal and actionable. It helps the player see what their own good performance looks like.

### Implementation Difficulty

Easy to medium.

It does not require external data, only the player’s own match history.

---

## 3. “You Play Better When...”

### Summary

Identify contextual patterns that correlate with better or worse ranked performance.

### Goal

Help the player understand the conditions where they perform best or worst.

### Example Output

> You have a 64% win rate in the first 2 matches of a session, but your win rate drops to 38% after the fourth match.

### Possible Insights

* You play better on specific weekdays.
* You play worse after two consecutive losses.
* You perform better in shorter sessions.
* You win more with a smaller champion pool.
* You perform better in Solo/Duo than Flex.
* You perform worse when switching champions too often.
* You play better during certain time periods, if match time is available.

### Possible Data Used

* Match date
* Match time
* Queue type
* Champion selected
* Win/loss
* Session length
* Loss streaks
* Champion diversity
* Role/lane

### MVP Version

Start with simple patterns:

* Win rate by match number inside the session.
* Win rate after a loss.
* Win rate by weekday.
* Win rate by queue type.
* Win rate when using top 3 champions vs other champions.

### Required Rules

* Always use sample size validation.
* Avoid strong conclusions when the sample is small.
* Prefer wording like “appears to” or “in your recent data” instead of absolute statements.

### Why It Matters

This makes the product feel intelligent and personal. It helps the player make better decisions before queueing.

### Implementation Difficulty

Medium.

The calculations are not too complex, but the product needs careful rules to avoid misleading conclusions.

---

## 4. Champion Pool Coach

### Summary

Recommend and classify the player’s champion pool based on actual performance.

### Goal

Help the player decide which champions to prioritize, keep, reduce, or pause.

### Example Output

> Your recommended pool is Ahri, Viktor, and Orianna.
> You perform better with control mages than assassins.
> Consider pausing Akali for now because your win rate and consistency are low.

### Possible Champion Categories

* Main recommended
* Backup safe pick
* Situational pick
* Consistent champion
* High potential champion
* Low sample champion
* Inconsistent champion
* Champion to pause

### Possible Metrics

* Number of matches
* Win rate
* KDA
* CS/min
* Deaths per match
* Kill participation
* Damage contribution
* Vision score
* Performance consistency
* Recent trend
* Queue type

### MVP Version

Start with rule-based classification:

* High win rate + enough games = recommended.
* Good stats + low games = promising but low sample.
* Many games + low win rate + poor stats = consider pausing.
* Stable performance across games = consistent.
* High variance = inconsistent.

### Required Rules

* Do not recommend based only on win rate.
* Consider minimum match count.
* Separate “low sample” champions from truly strong champions.
* Consider recent performance separately from historical performance.

### Why It Matters

Champion pool discipline is one of the most practical ways for a ranked player to improve. This feature helps the user make better champion decisions before playing.

### Implementation Difficulty

Medium to high.

The first version can be rule-based, but a strong version requires careful scoring and classification.

---

## 5. Game Phase Map

### Summary

Analyze the player’s performance by phase of the game: early game, mid game, and late game.

### Goal

Identify when the player loses impact during the match.

### Game Phases

* Early game: 0–14 minutes
* Mid game: 14–25 minutes
* Late game: 25+ minutes

### Example Output

> Your early game is consistent, but your mid game appears to be your weakest phase.
> Between 15 and 22 minutes, your deaths increase and your CS/min drops significantly.

### Possible Insights

* Strong laning phase, weak mid game.
* Good early advantage, poor conversion.
* Too many deaths after lane phase.
* Farm drops heavily after 15 minutes.
* Low objective participation in mid game.
* Late-game positioning issues.
* Player performs better when games end early.

### Possible Data Used

* Timeline data from Riot API
* Death timestamps
* CS by minute
* Gold by minute
* XP by minute
* Objective events
* Vision events, if available
* Damage or combat data, if available

### MVP Version

If timeline data is already available:

* Count deaths by phase.
* Estimate CS/min by phase.
* Compare phase performance in wins vs losses.
* Show weakest phase.

If timeline data is not available:

* Start with a limited version based on final match stats and match duration.
* Mark it as a future enhancement that requires timeline ingestion.

### Required Rules

* This feature should depend on the quality of timeline/event data.
* Avoid pretending to know phase-specific behavior if only final match stats exist.
* Clearly separate estimated insights from event-based insights.

### Why It Matters

This feature helps the user understand not only what is wrong, but when it happens.

### Implementation Difficulty

High.

The difficulty depends heavily on whether the MVP already stores timeline data.

---

## 6. Weekly Training Plan

### Summary

Generate a simple improvement plan for the player based on their most relevant recurring patterns.

### Goal

Turn analysis into action.

### Example Output

> Weekly focus: reduce mid-game deaths.
> Goal 1: die at most once between 14 and 25 minutes.
> Goal 2: maintain at least 6.5 CS/min until 20 minutes.
> Goal 3: play only 3 champions this week.
> Goal 4: stop ranked after 2 consecutive losses.

### Possible Plan Areas

* Champion pool discipline
* Early-game farming
* Mid-game deaths
* Objective setup
* Vision habits
* Session control
* Queue selection
* Ranked volume
* Role/champion consistency

### MVP Version

Start with a simple plan generator based on the top detected issue.

Example logic:

* If session performance drops after many games, suggest session limit.
* If champion pool is too wide, suggest reducing pool.
* If deaths are high, suggest death limit goal.
* If CS/min is low, suggest farming target.
* If performance is worse after losses, suggest stopping rule.

### Required Rules

* The plan should contain a small number of goals.
* Goals must be measurable.
* Goals should be realistic.
* The system should track whether the player improved in the next sessions.
* Avoid overwhelming the user with too many recommendations.

### Why It Matters

This feature creates retention. The player returns not only to see stats, but to check whether they improved.

### Implementation Difficulty

Very high.

This feature is strongest when it uses the results of the other features, especially Session Review, Champion Pool Coach, Self Comparison, and Game Phase Map.

---

# Recommended Implementation Order

## 1. Automatic Session Review

Start here because it is the easiest and gives immediate value.

## 2. Compare Against “Your Best Self”

This is also highly valuable and does not depend on external benchmark data.

## 3. “You Play Better When...”

This adds behavioral intelligence and helps the player understand queue/session patterns.

## 4. Champion Pool Coach

This helps the player make practical champion decisions and creates a strong product difference.

## 5. Game Phase Map

This is powerful but depends on timeline or event data.

## 6. Weekly Training Plan

This should come after the product can detect enough reliable patterns.

---

# Suggested Roadmap

## Phase 1 — Fast Differentiation

Focus on features that reuse existing MVP data.

Features:

* Automatic Session Review
* Compare Against “Your Best Self”

Goal:

* Make the dashboard feel smarter quickly.
* Add personalized insights without large architectural changes.

## Phase 2 — Behavioral Analysis

Focus on user behavior and ranked decision-making.

Features:

* “You Play Better When...”
* Champion Pool Coach

Goal:

* Help the player understand how their habits, sessions, and champion choices affect performance.

## Phase 3 — Deeper Performance Intelligence

Focus on match phase analysis and structured improvement.

Features:

* Game Phase Map
* Weekly Training Plan

Goal:

* Turn Analysis.GG into a true ranked improvement coach.

---

# Product Area Proposal

Create a new product area called:

## Performance Coach

This area can contain:

* Session Review
* Best Self Comparison
* Behavior Patterns
* Champion Pool Coach
* Game Phase Map
* Weekly Training Plan

The main dashboard should not become overloaded. It should show only the most important coach insights as cards, with a button to open the full Performance Coach page.

Example dashboard cards:

* Your strongest pattern: good early-game consistency.
* Your biggest weakness: performance drops after long sessions.
* Recommended focus: reduce champion pool to 3 champions this week.

---

# Important Product Rules

## Rule 1: Avoid misleading insights

The system should not generate strong conclusions from small samples.

Example:

> Not enough matches to generate a reliable champion pool recommendation yet.

## Rule 2: Prefer actionable recommendations

Every insight should answer:

* What happened?
* Why does it matter?
* What should the player do next?

## Rule 3: Keep recommendations simple

The user should not receive 10 goals at once.

Prefer:

* 1 main problem
* 1 main recommendation
* 2 or 3 measurable goals

## Rule 4: Separate facts from interpretation

Example:

Fact:

> Your win rate drops from 61% to 39% after the third match of a session.

Interpretation:

> This may indicate fatigue or tilt during longer sessions.

## Rule 5: Track improvement over time

The best version of Analysis.GG should not only detect problems. It should verify whether the player improved after following recommendations.

---

# First Feature Recommendation

The first feature to implement should be:

## Automatic Session Review

Reason:

* Easier to implement.
* Uses existing match data.
* Gives immediate value.
* Creates the foundation for behavior analysis.
* Can later feed the Weekly Training Plan.

Suggested first version:

* Detect recent session.
* Show matches played, wins, losses, win rate.
* Show best champion of the session.
* Show worst champion of the session.
* Show average KDA, deaths, CS/min if available.
* Show one simple recommendation.

---

# Long-Term Vision

The long-term vision is for Analysis.GG to become a personal ranked improvement assistant.

The product should help the player answer:

* Why am I losing?
* When do I play worse?
* Which champions should I focus on?
* What changes when I play well?
* In which phase of the game do I lose impact?
* What should I train this week?
* Did I improve after following the recommendation?

This direction keeps Analysis.GG aligned with the original PRD while giving the product a stronger and more differentiated identity.

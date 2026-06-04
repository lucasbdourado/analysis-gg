# Technology Reference: Spring Boot

## Status

Status: Captured

Last updated: 2026-06-04

Captured by: Antigravity

## Technology Decision Reference

Related technology definition: [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md)

Decision area: Backend Web Framework / REST API Server

Decision status: Confirmed by user

## Why This Technology Was Selected

Spring Boot is the standard framework for building RESTful microservices and applications in Java:
- Out-of-the-box dependency injection and modular configuration.
- Built-in embedded servlet container (Tomcat) making executable JARs simple.
- Auto-configuration of static resource handlers which makes it trivial to serve bundled React SPA assets directly from the classpath (`/static` or `/public`).
- High integration with logging libraries and configuration management through YAML profiles.

## Official Documentation Sources

| Source | URL or Context7 Library ID | Notes |
| --- | --- | --- |
| Context7 | /spring-projects/spring-boot | Context7 library ID resolved successfully |
| Reference Documentation | https://docs.spring.io/spring-boot/docs/current/reference/html/ | Official Spring Boot docs |

## Context7 Notes

By default, Spring Boot serves static assets from `/static`, `/public`, or `/resources` on the classpath at the root URL path `/**`. SPA routing fallbacks can be handled using custom `WebMvcConfigurer` configurations to forward non-API routes to `index.html`.

## Relevant Concepts for This Project

- **DispatcherServlet**: Handles incoming REST API calls.
- **ResourceHttpRequestHandler**: Automatically serves index.html and assets in target/classes/static.
- **Auto-configuration**: Configures Web MVC, Jackson JSON serializer, and properties binding out of the box.

## Usage Guidelines for This Project

- Run the backend on port `8080` (default).
- All REST controllers should use the `@RestController` annotation and be mapped under `/api/**` (e.g. `@RequestMapping("/api/v1")`).
- Put React bundle assets in `src/main/resources/static/` during the build process so Spring Boot can serve them under `/**`.
- Implement a custom error or routing handler to route all unmatched non-API browser paths to `index.html` to allow client-side React router navigation (SPA routing support).

## Examples or Patterns to Follow

```java
package com.analysisgg.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import java.io.IOException;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map all requests that are not REST endpoints to static folder
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        // If path is API or resource exists, return it. Otherwise redirect to index.html for SPA router.
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        return new ClassPathResource("/static/index.html");
                    }
                });
    }
}
```

## Risks or Caveats

- **CORS blockages during development**: In development mode, React Vite server runs on port 5173 and Spring Boot runs on 8080. A CORS policy or local Vite proxy configuration (`vite.config.ts`) must map `/api` to `localhost:8080` to prevent CORS blocks.
- **API and SPA path conflict**: Ensure that any endpoint prefix (e.g. `/api`) is never matched by SPA routes to prevent infinite index.html redirect loops.

## Related Harness Documents

| Document | Path | Relationship |
| --- | --- | --- |
| Technology Definition | [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md) | Source decision |

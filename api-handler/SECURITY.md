# Handling Secrets and Credentials

Do not commit real secrets, keys, or credentials into the repository. Follow these guidelines:

- Keep local secrets out of source control by using `src/main/resources/application.properties` locally and adding it to `.gitignore`.
- Instead commit an example file `src/main/resources/application.properties.example` with placeholders.
- For CI / remote deployments, store secrets in the CI provider secret store or use environment variables.

Recommended: Use environment variables and reference them in Spring Boot via `${ENV_VAR:default}` in `application.properties` or use Spring Cloud Config / Vault for production.

Examples:

```properties
app.jwtSecret=${JWT_SECRET}
spring.datasource.password=${DB_PASSWORD}
```

If you need help wiring environment-based configuration or a secure secret provider, ask and I can add a sample.

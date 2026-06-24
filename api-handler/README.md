# Travel Booking Web App Backend

This is a Spring Boot backend for a travel booking web application.

Getting started

1. Build and run tests:

```bash
mvn -U clean test
```

2. Run the application:

```bash
mvn spring-boot:run
```

3. Default sample accounts (created on startup):
- `admin@example.com` / `password` (ROLE_ADMIN)
- `agent@example.com` / `password` (ROLE_TRAVEL_AGENT)
- `user@example.com` / `password` (ROLE_CUSTOMER)

APIs available under `/api/*`. Swagger UI available at `/swagger-ui.html` when running.

Use H2 in-memory DB by default; change `application.properties` for MySQL/Postgres.

Project structure follows layered architecture: controller, service, repository, entity, dto, security.

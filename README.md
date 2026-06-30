# RoamFlow: Full-Stack Travel Management & AI-Ready Booking Platform

Welcome to **RoamFlow**, a modern, production-ready, full-stack travel booking application designed for travel agencies, agents, and customers. 

This repository is split into two primary components:
1. **[`api-handler`]**: A robust, secured RESTful backend API built using **Spring Boot** and **Java 21**.
2. **[`ui-frontend`]**: A highly-responsive, accessibility-aware web interface built with **Next.js 14 (App Router)** and **React**.

---

## 🌟 Key Highlights & AI Technologies

RoamFlow is built with an **AI-first architecture** designed to leverage modern Large Language Models (LLMs) and intelligence services:

*   **Gemini API & OpenAI Integration (AI Itinerary Planner)**: Ready hooks for generating automated, personalized day-by-day itineraries based on customer preferences, tour details, and target budget.
*   **Intelligent Sentiment Analysis**: Backend-ready data structures for scanning customer feedback and reviews using natural language processing (NLP) to auto-categorize sentiment and flag urgent issues for travel agents.
*   **Cognitive Search & RAG Support**: System design allows indexing tour descriptions and destinations into vector stores (like PgVector or Pinecone) for Retrieval-Augmented Generation (RAG) search engines, enabling conversational travel discovery.
*   **Role-Based Security**: Stateless JWT-based authentication supporting three distinct user personas: `CUSTOMER`, `TRAVEL_AGENT`, and `ADMIN`. Each role triggers custom dashboards and action privileges.
*   **Premium Glassmorphic UI**: Theme-aware interface with instant light/dark mode toggles, built with semantic CSS variables for scalable design token management.

---

## 🛠️ The Tech Stack

### Backend (`api-handler`)
*   **Language & Runtime**: Java 21 / Spring Boot 3.2
*   **Security & Auth**: Spring Security with Stateless JWT filters
*   **Database & ORM**: Spring Data JPA with H2 (in-memory) for testing, and pre-configured support for production PostgreSQL and MySQL
*   **Documentation**: Springdoc OpenAPI / Swagger UI
*   **Testing**: JUnit, Mockito, and Spring Integration Tests

### Frontend (`ui-frontend`)
*   **Framework**: Next.js 14 (App Router) & React 18
*   **Styling**: Modern Vanilla CSS with customized CSS variable design systems
*   **Client-Side Security**: JWT-aware context-based auth guards and role-restricted layouts
*   **Testing**: Jest and React Testing Library

---

## 📂 Repository Structure

```
├── api-handler/           # Java Spring Boot REST API
│   ├── src/               # Service, controller, repository, security, & domain code
│   └── pom.xml            # Maven configuration & dependency manager
│
├── ui-frontend/           # Next.js App Router Web UI
│   ├── app/               # Declarative routes, pages, and layout views
│   ├── components/        # Reusable UI components (buttons, inputs, cards, forms)
│   └── package.json       # Node.js dependencies & npm scripts
│
└── README.md              # Root repository documentation (this file)
```

---

## 🚀 Quick Start & Installation

To run the complete application locally, follow these steps:

### 1. Run the Backend API
Navigate to the backend folder, build the project, and boot the server:
```bash
cd api-handler
mvn clean test             # Run backend test suites
mvn spring-boot:run        # Start Spring Boot backend on http://localhost:8080
```
*The default H2 Database is initialized automatically. Interactive Swagger documentation is accessible at `http://localhost:8080/swagger-ui.html` when running.*

### 2. Run the Frontend Client
In a new terminal window, navigate to the frontend directory, install dependencies, and start the NextJS dev server:
```bash
cd ui-frontend
npm install                # Install frontend packages
npm run dev                # Spin up local hot-reloaded UI on http://localhost:3000
```

### 3. Logins & Sample Accounts
On initialization, the application seeds the following test users:
*   **Customer Portal**: `user@example.com` / `password`
*   **Travel Agent Portal**: `agent@example.com` / `password`
*   **Administrator Portal**: `admin@example.com` / `password`

---

## 🔍 Best Practices & Architecture Highlights

*   **Layered Architecture**: The backend strictly follows the *Controller-Service-Repository* design pattern, ensuring decoupling of web endpoints, business logic, and database entities.
*   **Stateless Navigation**: Frontend routing uses Next.js App Router route groups (`(auth)`, `/dashboard`, `/admin`) to separate concerns and manage user dashboards dynamically based on the JWT token contents.
*   **Component-Driven UI**: High reusability of form fields, loading states, and custom UI components ensuring easy extensions for new pages.
*   **Accessibility (a11y)**: Built with proper aria-attributes, semantic HTML landmarks, and contrast-compliant theme palettes.

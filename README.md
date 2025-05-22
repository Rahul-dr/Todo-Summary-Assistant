# Summary Assistant

A Spring Boot backend application that integrates OpenAI's GPT API for text summarization and sends notifications to Slack. The frontend for interacting with this backend is a separate React app named `todo-frontend`.

## 📋 Table of Contents

- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
  - [Backend - Summary Assistant](#backend---summary-assistant)
  - [Frontend - todo-frontend](#frontend---todo-frontend)
- [Slack Setup](#slack-setup)
- [OpenAI LLM Setup](#openai-llm-setup)
- [Configuration](#configuration)
- [Design and Architecture](#design-and-architecture)
- [Notes](#notes)

## 🔍 Overview

Summary Assistant is a backend service that accepts text input, summarizes it using OpenAI's GPT model, and posts the summary to a Slack channel via Slack's Webhook API. It uses PostgreSQL for data persistence and Spring Boot to manage the application lifecycle.

The frontend app, `todo-frontend`, is a React-based client that interacts with this backend for user input and displays summaries.

## 📁 Project Structure

```
your-repository/
├── summary-assistant/     # Backend (Spring Boot)
│   ├── src/
│   ├── pom.xml
│   └── ...
├── todo-frontend/         # Frontend (React)
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

**Backend**: Located in `summary-assistant/` folder - Spring Boot application
**Frontend**: Located in `todo-frontend/` folder - React application

## 🚀 Setup Instructions

### Backend - Summary Assistant

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/summary-assistant.git
   cd summary-assistant/summary-assistant
   ```
   
   > **Note**: Navigate to the `summary-assistant/` folder which contains the Spring Boot backend code.

2. **Install PostgreSQL**
   
   Ensure PostgreSQL is installed and running on your machine.

3. **Create the database:**
   ```sql
   CREATE DATABASE tododb;
   ```

4. **Configure application properties:**
   
   Open `summary-assistant/src/main/resources/application.properties` and update the following with your credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/tododb
   spring.datasource.username=your_postgres_username
   spring.datasource.password=your_postgres_password
   openai.api.key=your_openai_api_key
   slack.webhook.url=your_slack_webhook_url
   ```

5. **Build and run the application:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   
   The backend server will run on `http://localhost:8080`.

### Frontend - todo-frontend

1. **Navigate to your frontend directory:**
   ```bash
   cd ../todo-frontend
   ```
   
   > **Note**: Navigate to the `todo-frontend/` folder which contains the React frontend code.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure frontend environment variables:**
   
   Create a `.env` file in the `todo-frontend/` directory or use `.env.example` and set the backend API URL:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080/api
   ```

4. **Run the frontend app:**
   ```bash
   npm start
   ```
   
   The React frontend will run on `http://localhost:3000`.

## 💬 Slack Setup

1. Create a Slack workspace or use an existing one.
2. In Slack, add an **Incoming Webhook** app.
3. Create a new webhook URL for the channel where you want to post summaries.
4. Copy the webhook URL and set it in your backend `application.properties` as `slack.webhook.url`.

## 🤖 OpenAI LLM Setup

1. Sign up at [OpenAI](https://openai.com) if you don't have an account.
2. Generate an API key from your OpenAI dashboard.
3. Add the API key in `application.properties` under `openai.api.key`.
4. For development/testing without calling the real API, set `openai.mock.enabled=true` in `application.properties`.
5. Set it to `false` to enable real API calls.

## ⚙️ Configuration

Example `application.properties` for backend:

```properties
# Application Name
spring.application.name=summary-assistant

# PostgreSQL config
spring.datasource.url=jdbc:postgresql://localhost:5432/tododb
spring.datasource.username=postgres
spring.datasource.password=your_password

# JPA config
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Server port
server.port=8080

# OpenAI API Key
openai.api.key=sk-your-openai-api-key

# Slack Webhook URL
slack.webhook.url=https://hooks.slack.com/services/your/slack/webhook

# Enable mock OpenAI API (true = mock, false = real)
openai.mock.enabled=true
```

## 🏗️ Design and Architecture

- **Spring Boot**: Handles REST API endpoints, business logic, and application configuration.
- **PostgreSQL**: Used for persisting data.
- **OpenAI GPT API**: Summarizes the text inputs.
- **Slack Webhook API**: Sends summarized messages to Slack channels.
- **Modular Services**: Separate services for OpenAI integration and Slack communication for easier maintenance.
- **Configurable Behavior**: Switch between mock and real OpenAI API calls via configuration for testing or production.
- **Frontend (todo-frontend)**: React app interacting with backend APIs for user interface and input.

package todo.summary_assistant.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import todo.summary_assistant.entity.Todo;
import todo.summary_assistant.repository.TodoRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SummaryService {

    private final TodoRepository todoRepo;
    private final RestTemplate restTemplate;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${slack.webhook.url}")
    private String slackWebhookUrl;

    // Add this property to switch between mock and real API
    @Value("${openai.mock.enabled:true}")
    private boolean mockEnabled;

    @Autowired
    public SummaryService(TodoRepository todoRepo, RestTemplate restTemplate) {
        this.todoRepo = todoRepo;
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<String> summarizeAndSend() {
        List<Todo> todos = todoRepo.findAll().stream()
                .filter(todo -> !todo.isCompleted())
                .collect(Collectors.toList());

        if (todos.isEmpty()) {
            return ResponseEntity.ok("No pending todos to summarize.");
        }

        String todoText = todos.stream()
                .map(Todo::getTitle)
                .collect(Collectors.joining("\n- ", "- ", ""));

        String summary;
        try {
            if (mockEnabled) {
                summary = generateMockSummary(todoText);
            } else {
                summary = generateSummaryWithOpenAI(todoText);
            }
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS ||
                    e.getResponseBodyAsString().contains("insufficient_quota")) {
                return ResponseEntity.status(429)
                        .body("OpenAI API quota exceeded. Please check your billing details or try again later.");
            }
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Failed to generate summary: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Failed to generate summary: " + e.getMessage());
        }

        try {
            postToSlack(summary);
            return ResponseEntity.ok("Summary sent to Slack successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Failed to send to Slack: " + e.getMessage());
        }
    }

    // Mock summary generator for testing
    private String generateMockSummary(String todoText) {
        List<String> todos = List.of(todoText.split("\n"));
        int totalTodos = todos.size();

        String summary = "📋 **Todo Summary Report**\n\n";
        summary += "You have " + totalTodos + " pending task" + (totalTodos > 1 ? "s" : "") + " to complete:\n\n";

        for (String todo : todos) {
            if (!todo.trim().isEmpty()) {
                summary += todo.trim() + "\n";
            }
        }

        summary += "\n💡 **Priority Recommendation:** ";
        if (totalTodos <= 2) {
            summary += "Great job keeping your task list manageable! Focus on completing these items today.";
        } else if (totalTodos <= 5) {
            summary += "You have a moderate workload. Consider prioritizing the most important tasks first.";
        } else {
            summary += "You have quite a few tasks. Consider breaking them down into smaller, manageable chunks and tackle the most urgent ones first.";
        }

        summary += "\n\n✅ Stay organized and productive!";

        return summary;
    }

    private String generateSummaryWithOpenAI(String content) {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openaiApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                        Map.of("role", "system", "content", "You are a helpful assistant that summarizes to-do lists."),
                        Map.of("role", "user", "content", "Summarize this list of pending tasks in a concise and organized way:\n" + content)
                ),
                "max_tokens", 150,
                "temperature", 0.7
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("OpenAI API error: " + response.getStatusCode());
            }

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new RuntimeException("Empty response from OpenAI API");
            }

            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new RuntimeException("No choices in OpenAI API response");
            }

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            if (message == null) {
                throw new RuntimeException("No message in OpenAI API response");
            }

            return (String) message.get("content");

        } catch (HttpClientErrorException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error calling OpenAI API: " + e.getMessage(), e);
        }
    }

    private void postToSlack(String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String escapedMessage = message.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");

        String payload = "{\"text\": \"" + escapedMessage + "\"}";
        HttpEntity<String> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(slackWebhookUrl, request, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Slack API error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error posting to Slack: " + e.getMessage(), e);
        }
    }
}
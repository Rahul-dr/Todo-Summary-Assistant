package todo.summary_assistant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import todo.summary_assistant.entity.Todo;
import todo.summary_assistant.repository.TodoRepository;
import todo.summary_assistant.service.SummaryService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TodoController {

    private final TodoRepository todoRepo;
    private final SummaryService summaryService;

    @Autowired
    public TodoController(TodoRepository todoRepo, SummaryService summaryService) {
        this.todoRepo = todoRepo;
        this.summaryService = summaryService;
    }

    @GetMapping("/todos")
    public List<Todo> getAllTodos() {
        return todoRepo.findAll();
    }

    @PostMapping("/todos")
    public Todo createTodo(@RequestBody Todo todo) {
        return todoRepo.save(todo);
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/summarize")
    public ResponseEntity<String> summarizeAndSendToSlack() {
        return summaryService.summarizeAndSend();
    }
}
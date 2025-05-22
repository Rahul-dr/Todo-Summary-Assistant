// repository/TodoRepository.java
package todo.summary_assistant.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import todo.summary_assistant.entity.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {}

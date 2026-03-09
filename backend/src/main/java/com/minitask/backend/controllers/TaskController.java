package com.minitask.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.minitask.backend.models.Task;
import com.minitask.backend.models.TaskPriority;
import com.minitask.backend.models.TaskStatus;
import com.minitask.backend.models.User;
import com.minitask.backend.payload.request.TaskRequest;
import com.minitask.backend.payload.response.MessageResponse;
import com.minitask.backend.repository.TaskRepository;
import com.minitask.backend.repository.UserRepository;
import com.minitask.backend.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired TaskRepository taskRepository;
    @Autowired UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<Page<Task>> getTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        User currentUser = getCurrentUser();
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        TaskStatus taskStatus = status != null ? TaskStatus.valueOf(status.toUpperCase()) : null;
        TaskPriority taskPriority = priority != null ? TaskPriority.valueOf(priority.toUpperCase()) : null;

        Page<Task> tasks;

        if (isAdmin) {
            if (taskStatus != null && taskPriority != null) {
                tasks = taskRepository.findByStatusAndPriority(taskStatus, taskPriority, pageable);
            } else if (taskStatus != null) {
                tasks = taskRepository.findByStatus(taskStatus, pageable);
            } else if (taskPriority != null) {
                tasks = taskRepository.findByPriority(taskPriority, pageable);
            } else {
                tasks = taskRepository.findAll(pageable);
            }
        } else {
            if (taskStatus != null && taskPriority != null) {
                tasks = taskRepository.findByUserIdAndStatusAndPriority(currentUser.getId(), taskStatus, taskPriority, pageable);
            } else if (taskStatus != null) {
                tasks = taskRepository.findByUserIdAndStatus(currentUser.getId(), taskStatus, pageable);
            } else if (taskPriority != null) {
                tasks = taskRepository.findByUserIdAndPriority(currentUser.getId(), taskPriority, pageable);
            } else {
                tasks = taskRepository.findByUserId(currentUser.getId(), pageable);
            }
        }

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        Optional<Task> taskData = taskRepository.findById(id);
        if (taskData.isPresent()) {
            Task task = taskData.get();
            User currentUser = getCurrentUser();
            if (!currentUser.getRole().name().equals("ADMIN") && !task.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to view this task"));
            }
            return ResponseEntity.ok(task);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createTask(@Valid @RequestBody TaskRequest taskRequest) {
        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setStatus(TaskStatus.valueOf(taskRequest.getStatus().toUpperCase()));
        task.setPriority(TaskPriority.valueOf(taskRequest.getPriority().toUpperCase()));
        task.setDueDate(taskRequest.getDueDate());
        task.setUser(getCurrentUser());

        taskRepository.save(task);
        return ResponseEntity.ok(new MessageResponse("Task created successfully!"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest taskRequest) {
        Optional<Task> taskData = taskRepository.findById(id);
        if (taskData.isPresent()) {
            Task task = taskData.get();
            User currentUser = getCurrentUser();
            
            if (!currentUser.getRole().name().equals("ADMIN") && !task.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to update this task"));
            }

            task.setTitle(taskRequest.getTitle());
            task.setDescription(taskRequest.getDescription());
            task.setStatus(TaskStatus.valueOf(taskRequest.getStatus().toUpperCase()));
            task.setPriority(TaskPriority.valueOf(taskRequest.getPriority().toUpperCase()));
            task.setDueDate(taskRequest.getDueDate());

            taskRepository.save(task);
            return ResponseEntity.ok(new MessageResponse("Task updated successfully!"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        Optional<Task> taskData = taskRepository.findById(id);
        if (taskData.isPresent()) {
            Task task = taskData.get();
            User currentUser = getCurrentUser();
            
            if (!currentUser.getRole().name().equals("ADMIN") && !task.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to delete this task"));
            }

            taskRepository.deleteById(id);
            return ResponseEntity.ok(new MessageResponse("Task deleted successfully!"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

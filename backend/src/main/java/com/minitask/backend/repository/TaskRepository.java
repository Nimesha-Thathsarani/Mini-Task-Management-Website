package com.minitask.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.minitask.backend.models.Task;
import com.minitask.backend.models.TaskPriority;
import com.minitask.backend.models.TaskStatus;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByUserId(Long userId, Pageable pageable);
    Page<Task> findByUserIdAndStatus(Long userId, TaskStatus status, Pageable pageable);
    Page<Task> findByUserIdAndPriority(Long userId, TaskPriority priority, Pageable pageable);
    Page<Task> findByUserIdAndStatusAndPriority(Long userId, TaskStatus status, TaskPriority priority, Pageable pageable);
    
    // For ADMIN role (Can see all tasks)
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
    Page<Task> findByPriority(TaskPriority priority, Pageable pageable);
    Page<Task> findByStatusAndPriority(TaskStatus status, TaskPriority priority, Pageable pageable);
}

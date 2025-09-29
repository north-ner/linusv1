package com.devbnorth.taskmanager.repository;

import com.devbnorth.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Extra query methods can be added here if needed later
}
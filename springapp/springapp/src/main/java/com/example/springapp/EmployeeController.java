package com.example.springapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/spring")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository repo;

    @GetMapping("/employee")
    public ResponseEntity<?> getByName(@RequestParam String name) {

        Optional<Employee> emp = repo.findByName(name);

        if (emp.isEmpty()) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", "error",
                    "message", "Employee not found",
                    "data", null
                )
            );
        }

        return ResponseEntity.ok(
            Map.of(
                "status", "success",
                "message", "Employee found",
                "data", emp.get()
            )
        );
    }

    @GetMapping("/employees")
    public ResponseEntity<?> getAll() {

        List<Employee> list = repo.findAll();

        return ResponseEntity.ok(
            Map.of(
                "status", "success",
                "message", "All employees fetched",
                "data", list
            )
        );
    }
}

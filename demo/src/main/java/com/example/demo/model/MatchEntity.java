package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "matches")
public class MatchEntity {
    @Id
    private String id;
    private String user1Id;
    private String user2Id;
    private Long timestamp;
}

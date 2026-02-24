package com.example.demo.repository;

import com.example.demo.model.MatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<MatchEntity, String> {
    boolean existsByUser1IdAndUser2Id(String u1, String u2);
}

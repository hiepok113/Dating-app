package com.example.demo.repository;

import com.example.demo.model.AvailabilityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<AvailabilityEntity, Long> {
    List<AvailabilityEntity> findByMatchId(String matchId);
    void deleteByMatchIdAndUserId(String matchId, String userId);
}

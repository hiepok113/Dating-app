package com.example.demo.repository;

import com.example.demo.model.LikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    boolean existsByFromUserIdAndToUserId(String fromUserId, String toUserId);
}

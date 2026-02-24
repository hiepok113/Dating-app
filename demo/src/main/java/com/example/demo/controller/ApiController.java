package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow localhost frontend to call backend
public class ApiController {

    @Autowired private ProfileRepository profileRepo;
    @Autowired private LikeRepository likeRepo;
    @Autowired private MatchRepository matchRepo;
    @Autowired private AvailabilityRepository availRepo;
    @Autowired private UserRepository userRepo;

    public static class AuthRequest {
        public String username;
        public String password;
    }

    @PostMapping("/auth/register")
    public Object register(@RequestBody AuthRequest req) {
        if (userRepo.findByUsername(req.username).isPresent()) {
            return Map.of("error", "Username already exists");
        }
        UserEntity u = new UserEntity();
        u.setId(UUID.randomUUID().toString());
        u.setUsername(req.username);
        u.setPassword(req.password);
        userRepo.save(u);
        return Map.of("id", u.getId(), "username", u.getUsername());
    }

    @PostMapping("/auth/login")
    public Object login(@RequestBody AuthRequest req) {
        Optional<UserEntity> o = userRepo.findByUsername(req.username);
        if (o.isPresent() && o.get().getPassword().equals(req.password)) {
            return Map.of("id", o.get().getId(), "username", o.get().getUsername());
        }
        return Map.of("error", "Invalid credentials");
    }

    @GetMapping("/profiles")
    public List<Profile> getProfiles() {
        return profileRepo.findAll();
    }

    @PostMapping("/profiles")
    public Profile saveProfile(@RequestBody Profile profile) {
        return profileRepo.save(profile);
    }

    @GetMapping("/likes")
    public List<LikeEntity> getLikes() {
        return likeRepo.findAll();
    }

    @PostMapping("/likes")
    public boolean addLike(@RequestBody LikeEntity likeReq) {
        if (!likeRepo.existsByFromUserIdAndToUserId(likeReq.getFromUserId(), likeReq.getToUserId())) {
            likeRepo.save(likeReq);
        }
        
        // Check matching logic
        boolean isMatch = likeRepo.existsByFromUserIdAndToUserId(likeReq.getToUserId(), likeReq.getFromUserId());
        if (isMatch) {
            String u1 = likeReq.getFromUserId();
            String u2 = likeReq.getToUserId();
            
            if (!matchRepo.existsByUser1IdAndUser2Id(u1, u2) && !matchRepo.existsByUser1IdAndUser2Id(u2, u1)) {
                MatchEntity match = new MatchEntity();
                match.setId(System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8));
                match.setUser1Id(u1);
                match.setUser2Id(u2);
                match.setTimestamp(System.currentTimeMillis());
                matchRepo.save(match);
            }
            return true;
        }
        return false;
    }

    @GetMapping("/matches")
    public List<MatchEntity> getMatches() {
        return matchRepo.findAll();
    }

    public static class UserAvailabilityDto {
        public String matchId;
        public String userId;
        public List<AvailabilityDto> availabilities;
    }

    public static class AvailabilityDto {
        public String date;
        public Integer startHour;
        public Integer endHour;
    }

    @GetMapping("/availabilities")
    public List<UserAvailabilityDto> getAvailabilities() {
        List<AvailabilityEntity> all = availRepo.findAll();
        Map<String, UserAvailabilityDto> map = new HashMap<>();
        for (AvailabilityEntity a : all) {
            String key = a.getMatchId() + "_" + a.getUserId();
            UserAvailabilityDto dto = map.computeIfAbsent(key, k -> {
                UserAvailabilityDto d = new UserAvailabilityDto();
                d.matchId = a.getMatchId();
                d.userId = a.getUserId();
                d.availabilities = new ArrayList<>();
                return d;
            });
            AvailabilityDto ad = new AvailabilityDto();
            ad.date = a.getDate();
            ad.startHour = a.getStartHour();
            ad.endHour = a.getEndHour();
            dto.availabilities.add(ad);
        }
        return new ArrayList<>(map.values());
    }

    @PostMapping("/availabilities")
    @Transactional
    public void saveAvailability(@RequestBody UserAvailabilityDto req) {
        availRepo.deleteByMatchIdAndUserId(req.matchId, req.userId);
        if (req.availabilities != null) {
            for (AvailabilityDto ad : req.availabilities) {
                AvailabilityEntity e = new AvailabilityEntity();
                e.setMatchId(req.matchId);
                e.setUserId(req.userId);
                e.setDate(ad.date);
                e.setStartHour(ad.startHour);
                e.setEndHour(ad.endHour);
                availRepo.save(e);
            }
        }
    }
}

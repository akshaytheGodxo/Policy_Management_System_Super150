package com.example.backend.scheduler;

import com.example.backend.model.Policy;
import com.example.backend.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class RenewalScheduler {

    private final PolicyRepository policyRepository;

    @Scheduled(cron = "0 0 9 * * *")
    public void checkExpiringPolicies() {
        LocalDateTime thirtyDaysFromNow = LocalDateTime.now().plusDays(30);

        List<Policy> expiringPolicies = policyRepository.findByEndDateBetweenAndReminderSentFalse(
                LocalDateTime.now(), thirtyDaysFromNow);

        for (Policy policy : expiringPolicies) {
            log.info("RENEWAL REMINDER: Policy {} for user {} expires on {}. Sending reminder to {}",
                    policy.getPolicyNumber(),
                    policy.getUser().getName(),
                    policy.getEndDate(),
                    policy.getUser().getEmail());

            policy.setReminderSent(true);
            policyRepository.save(policy);
        }

        if (!expiringPolicies.isEmpty()) {
            log.info("Sent {} renewal reminders", expiringPolicies.size());
        }
    }
}

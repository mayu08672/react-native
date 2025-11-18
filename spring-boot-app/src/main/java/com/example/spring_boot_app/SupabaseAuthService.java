package com.example.demo.service;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;

import java.util.Map;

@Service
public class SupabaseAuthService {

    private final WebClient webClient;

    public SupabaseAuthService(WebClient webClient) {
        this.webClient = webClient;
    }

    /**
     * Eメール/パスワードを使ってSupabase認証を行います
     * @param email Eメール
     * @param password パスワード
     * @return 認証結果
     */
    public Map<String, Object> loginWithPassword(String email, String password) {
        return webClient.post()
                .uri("/auth/v1/token?grant_type=password")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of("email", email, "password", password))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }
}

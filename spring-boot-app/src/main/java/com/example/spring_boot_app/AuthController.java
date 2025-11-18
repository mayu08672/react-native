package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final SupabaseAuthService supabaseAuthService;

    public AuthController(SupabaseAuthService supabaseAuthService) {
        this.supabaseAuthService = supabaseAuthService;
    }

    /**
     * ログインを行います
     * @param request アカウント情報
     * @return 実行結果
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequest request) {
        Map<String, Object> result = supabaseAuthService.loginWithPassword(request.getEmail(), request.getPassword());
        return result.containsKey("access_token")
                ? ResponseEntity.ok(result)
                : ResponseEntity.badRequest().body(result);
    }
}

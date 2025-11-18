import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(
                    "/", 
                    "/*.html", 
                    "/*.css", 
                    "/*.js", 
                    "/favicon.ico",
                    "/api/auth/**"  // ← 追加した行
                ).permitAll()
                .anyRequest().authenticated()
            )
            // CSRF, formLogin など必要に応じて追加
        ;

        return http.build();
    }
}

package is442g1t3.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import is442g1t3.service.JwtService;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    @Value("${my.hashSecret}")
    private String hashSecret;

    private final JwtService jwtService;

    @Bean
    @Order(1)
    public SecurityFilterChain FilterChain(HttpSecurity http) throws Exception {
        http
        .csrf().disable()
        .cors().configurationSource(request -> {
            CorsConfiguration cors = new CorsConfiguration();
            // cors.setAllowedOrigins(List.of("*"));
            cors.applyPermitDefaultValues();
            cors.addExposedHeader("Authorization");
            cors.addExposedHeader("Header");
            cors.addExposedHeader("Content-Type");
            cors.addExposedHeader("Accept");
            cors.addExposedHeader("authorization");
            cors.addAllowedOrigin("*");
            cors.addAllowedHeader("*");
            cors.addAllowedMethod("*");
            cors.setMaxAge(3600L);
            return cors;
        }).and()
        .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(new CustomFilter(hashSecret, jwtService), LogoutFilter.class)
        .authorizeRequests()
        .antMatchers("/**")
        .permitAll();
        return http.build();
    }

}

# QuizForge Backend - Security & JWT (Line-by-Line Explanation)

> **Complete explanation of Spring Security configuration, JWT authentication, and request filtering**

---

## Table of Contents

1. [SecurityConfig Class](#1-securityconfig-class)
2. [JwtUtil Class](#2-jwtutil-class)
3. [JwtRequestFilter Class](#3-jwtrequestfilter-class)
4. [OpenApiConfig Class](#4-openapiconfig-class)
5. [Security Flow Diagram](#5-security-flow-diagram)

---

## 1. SecurityConfig Class

**File:** `com.quizforge.security.SecurityConfig`

### Complete Source Code

```java
package com.quizforge.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/candidate/**").hasRole("CANDIDATE")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### Line-by-Line Explanation

#### Package and Imports (Lines 1-20)

```java
package com.quizforge.security;
```
- **Purpose:** Security-related classes in separate package
- **Convention:** `.security` package for authentication/authorization

```java
import org.springframework.beans.factory.annotation.Autowired;
```
- **Purpose:** Dependency injection annotation
- **Usage:** Inject `JwtRequestFilter` instance

```java
import org.springframework.beans.factory.annotation.Value;
```
- **Purpose:** Inject values from `application.properties`
- **Usage:** `@Value("${cors.allowed-origins}")` reads configuration

```java
import org.springframework.context.annotation.Bean;
```
- **Purpose:** Marks methods that produce Spring-managed beans
- **Usage:** `@Bean` methods create and configure beans

```java
import org.springframework.context.annotation.Configuration;
```
- **Purpose:** Marks class as configuration class
- **Effect:** Spring processes this at startup, executes `@Bean` methods

```java
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
```
- **Purpose:** Enables method-level security annotations
- **Allows:** `@PreAuthorize`, `@Secured`, `@RolesAllowed` on methods
- **Example:**
  ```java
  @PreAuthorize("hasRole('ADMIN')")
  public void deleteQuiz(Long id) { ... }
  ```

```java
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
```
- **Purpose:** Fluent API for configuring HTTP security
- **Usage:** Configure URL-based authorization, CORS, CSRF, sessions

```java
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
```
- **Purpose:** Enables Spring Security for web application
- **Effect:** Activates security filter chain, authentication, authorization

```java
import org.springframework.security.config.http.SessionCreationPolicy;
```
- **Purpose:** Enum for session management strategies
- **Values:**
  - `ALWAYS` - Always create session
  - `IF_REQUIRED` - Create session if needed (default)
  - `NEVER` - Never create session, but use existing
  - `STATELESS` - Never create or use sessions (JWT apps)

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
```
- **Purpose:** Password hashing interfaces
- **BCryptPasswordEncoder:** Industry-standard password hashing
- **PasswordEncoder:** Interface (can swap implementations)

```java
import org.springframework.security.web.SecurityFilterChain;
```
- **Purpose:** Spring Security 6.x way to configure security
- **Replaces:** Old `WebSecurityConfigurerAdapter` (deprecated)
- **Returns:** Configured filter chain

```java
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
```
- **Purpose:** Standard Spring Security authentication filter
- **Usage:** We insert JWT filter BEFORE this one

```java
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
```
- **Purpose:** CORS (Cross-Origin Resource Sharing) configuration
- **Needed for:** Frontend on different domain/port (e.g., React on 5173, API on 8080)

```java
import java.util.Arrays;
import java.util.List;
```
- **Purpose:** Utility classes for collections

#### Class Declaration (Lines 22-24)

```java
@Configuration
```
- **Purpose:** Marks this as Spring configuration class
- **Effect:** 
  - Spring scans and processes at startup
  - `@Bean` methods are called
  - Beans are registered in application context
- **Equivalent:** XML `<bean>` configuration (but Java-based)

```java
@EnableWebSecurity
```
- **Purpose:** Activates Spring Security for this application
- **Effect:**
  - Enables default security filter chain
  - Requires authentication for all endpoints (by default)
  - Provides login page (if not using JWT)
  - Configures security headers
- **Customization:** Override with `SecurityFilterChain` bean

```java
@EnableMethodSecurity
```
- **Purpose:** Enables annotation-based method security
- **Replaces:** Old `@EnableGlobalMethodSecurity` (deprecated)
- **Enables:**
  - `@PreAuthorize("expression")` - Check before method execution
  - `@PostAuthorize("expression")` - Check after method execution
  - `@Secured("ROLE_ADMIN")` - Simple role check
  - `@RolesAllowed("ADMIN")` - JSR-250 annotation
- **Example:**
  ```java
  @PreAuthorize("hasRole('ADMIN') and #id == authentication.principal.id")
  public void updateUser(Long id) { ... }
  ```

```java
public class SecurityConfig {
```
- **Purpose:** Main security configuration class
- **Responsibility:** Configure authentication, authorization, CORS, filters

#### Dependency Injection (Lines 26-30)

```java
@Autowired
private JwtRequestFilter jwtRequestFilter;
```
- **Purpose:** Inject custom JWT filter
- **Type:** Custom filter class (defined in same package)
- **Usage:** Added to filter chain before standard authentication filter
- **Note:** `@Autowired` is optional on constructor injection (not used here)

```java
@Value("${cors.allowed-origins}")
private String allowedOrigins;
```
- **Purpose:** Read CORS origins from `application.properties`
- **Property:** `cors.allowed-origins=http://localhost:5173`
- **Usage:** Allow frontend domain to make API requests
- **Multiple origins:** Comma-separated: `http://localhost:5173,https://app.example.com`
- **Production:** Should be environment-specific

#### SecurityFilterChain Bean (Lines 32-48)

```java
@Bean
```
- **Purpose:** Creates Spring-managed bean
- **Effect:** 
  - Method is called at startup
  - Return value is registered as bean
  - Singleton scope by default
  - Available for dependency injection

```java
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
```
- **Purpose:** Configure HTTP security rules
- **Parameter:** `HttpSecurity` - Builder for security configuration
- **Returns:** `SecurityFilterChain` - Configured filter chain
- **Throws:** `Exception` - Configuration errors

```java
http
```
- **Purpose:** Start of fluent API chain
- **Pattern:** Builder pattern for readability

```java
.cors(cors -> cors.configurationSource(corsConfigurationSource()))
```
- **Purpose:** Enable CORS (Cross-Origin Resource Sharing)
- **Why needed:** Frontend (port 5173) calls backend (port 8080) = different origin
- **Lambda:** `cors ->` configures CORS using our custom source
- **Configuration source:** `corsConfigurationSource()` bean (line 50)
- **Without this:** Browser blocks requests with CORS error
- **Effect:** Adds CORS headers to responses:
  ```
  Access-Control-Allow-Origin: http://localhost:5173
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: *
  Access-Control-Allow-Credentials: true
  ```

```java
.csrf(csrf -> csrf.disable())
```
- **Purpose:** Disable CSRF (Cross-Site Request Forgery) protection
- **Why disabled:**
  - JWT authentication is stateless (no cookies/session)
  - CSRF protects against cookie-based attacks
  - Not needed for token-based auth
- **Production note:** Safe for JWT, but document the decision
- **Default:** Spring Security enables CSRF by default
- **Effect:** Removes CSRF token requirement from POST/PUT/DELETE requests

```java
.authorizeHttpRequests(auth -> auth
```
- **Purpose:** Configure URL-based authorization rules
- **Pattern:** Lambda for readability
- **Order matters:** First match wins (more specific rules first)

```java
.requestMatchers("/api/auth/**").permitAll()
```
- **Purpose:** Allow unauthenticated access to authentication endpoints
- **Pattern:** `/api/auth/**` matches ALL paths under `/api/auth/`
- **Examples:**
  - `/api/auth/login` ✅ Allowed
  - `/api/auth/register` ✅ Allowed
  - `/api/auth/forgot-password` ✅ Allowed
- **Why permitAll:** Users can't log in if login endpoint requires authentication!
- **Security:** Login endpoint validates credentials itself

```java
.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
```
- **Purpose:** Allow public access to API documentation
- **Swagger UI paths:**
  - `/swagger-ui.html` - Main Swagger UI page
  - `/swagger-ui/**` - Swagger UI assets (CSS, JS)
  - `/v3/api-docs/**` - OpenAPI JSON specification
- **Why public:** Developers need to see API docs
- **Production:** Should be restricted or disabled

```java
.requestMatchers("/api/admin/**").hasRole("ADMIN")
```
- **Purpose:** Restrict admin endpoints to ADMIN role
- **Pattern:** `/api/admin/**` matches all admin paths
- **Authorization:** User must have `ROLE_ADMIN` authority
- **Examples:**
  - `/api/admin/quizzes` ✅ ADMIN only
  - `/api/admin/quizzes/1` ✅ ADMIN only
  - `/api/admin/analytics` ✅ ADMIN only
- **Effect:** CANDIDATE users get 403 Forbidden
- **Implementation:** JWT contains role claim, filter extracts it

```java
.requestMatchers("/api/candidate/**").hasRole("CANDIDATE")
```
- **Purpose:** Restrict candidate endpoints to CANDIDATE role
- **Pattern:** `/api/candidate/**` matches all candidate paths
- **Authorization:** User must have `ROLE_CANDIDATE` authority
- **Examples:**
  - `/api/candidate/quizzes` ✅ CANDIDATE only
  - `/api/candidate/quizzes/1/start` ✅ CANDIDATE only
  - `/api/candidate/my-attempts` ✅ CANDIDATE only
- **Effect:** ADMIN users get 403 Forbidden
- **Note:** Spring Security adds "ROLE_" prefix automatically

```java
.anyRequest().authenticated()
```
- **Purpose:** All other requests require authentication
- **Catch-all:** Any URL not matched above
- **Effect:** Must have valid JWT token
- **Examples:**
  - `/actuator/health` ❌ Requires auth
  - `/api/public/something` ❌ Requires auth
  - Any undefined endpoint ❌ Requires auth
- **Best practice:** Explicit is better than implicit

```java
)
```
- **End of authorization configuration**

```java
.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
```
- **Purpose:** Configure session management for stateless JWT authentication
- **Policy:** `STATELESS` - Never create HTTP sessions
- **Why:**
  - JWT is stateless (all info in token)
  - No server-side session storage needed
  - Improves scalability (no session synchronization)
  - Reduces memory usage
- **Effect:**
  - No JSESSIONID cookie
  - No session tracking
  - Each request is independent
- **Alternatives:**
  - `IF_REQUIRED` - Create session if needed (default, not for JWT)
  - `NEVER` - Don't create, but use existing (not for JWT)
  - `ALWAYS` - Always create (bad for REST APIs)

```java
.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
```
- **Purpose:** Insert custom JWT filter into filter chain
- **Position:** BEFORE `UsernamePasswordAuthenticationFilter`
- **Why before:**
  - JWT filter needs to run first
  - Extracts token, validates, sets authentication
  - Standard filter can then use authentication
- **Filter chain order:**
  ```
  Request
    ↓
  [Other Security Filters]
    ↓
  JwtRequestFilter ← Our filter (validate JWT)
    ↓
  UsernamePasswordAuthenticationFilter ← Standard filter
    ↓
  [Authorization Filters]
    ↓
  Controller
  ```
- **Effect:** Every request passes through JWT filter

```java
return http.build();
```
- **Purpose:** Build and return configured `SecurityFilterChain`
- **Effect:** Spring Security uses this configuration
- **Registration:** Automatically registered as bean

```java
}
```
- **End of securityFilterChain method**

#### CORS Configuration Bean (Lines 50-61)

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
```
- **Purpose:** Create CORS configuration for cross-origin requests
- **Returns:** `CorsConfigurationSource` - Used by `.cors()` in filter chain
- **Why needed:** Frontend (React) on different port/domain

```java
CorsConfiguration configuration = new CorsConfiguration();
```
- **Purpose:** Create new CORS configuration object
- **Fluent API:** Chain method calls for configuration

```java
configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
```
- **Purpose:** Specify which domains can make requests
- **Input:** `allowedOrigins` from `application.properties`
- **Example:** `"http://localhost:5173,https://app.example.com"`
- **Split:** Comma-separated string to list
- **Effect:** Only these domains can call API
- **Security:** Prevents unauthorized domains
- **Example response header:**
  ```
  Access-Control-Allow-Origin: http://localhost:5173
  ```
- **Production:** Use environment-specific origins

```java
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
```
- **Purpose:** Specify which HTTP methods are allowed
- **Methods:**
  - `GET` - Read data
  - `POST` - Create data
  - `PUT` - Update data
  - `DELETE` - Delete data
  - `OPTIONS` - Preflight check (required!)
- **Why OPTIONS:** Browser sends preflight request before actual request
- **Effect:** Header `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`

```java
configuration.setAllowedHeaders(Arrays.asList("*"));
```
- **Purpose:** Allow ALL request headers
- **Why `*`:** Frontend sends various headers (Authorization, Content-Type, etc.)
- **Includes:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
  - Custom headers
- **Effect:** Header `Access-Control-Allow-Headers: *`
- **Alternative:** Explicitly list headers for stricter security

```java
configuration.setAllowCredentials(true);
```
- **Purpose:** Allow credentials (cookies, auth headers) in requests
- **Required for:** Authorization header with JWT token
- **Effect:** Header `Access-Control-Allow-Credentials: true`
- **Restriction:** Cannot use `*` for origins when `true` (must be specific)
- **Security:** Browser enforces this strictly

```java
UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
```
- **Purpose:** Create source that maps URLs to CORS configs
- **URL-based:** Different URLs can have different CORS rules

```java
source.registerCorsConfiguration("/**", configuration);
```
- **Purpose:** Apply CORS configuration to ALL paths
- **Pattern:** `/**` matches everything
- **Alternative:** Different configs for different paths
  ```java
  source.registerCorsConfiguration("/api/public/**", publicConfig);
  source.registerCorsConfiguration("/api/admin/**", adminConfig);
  ```

```java
return source;
```
- **Purpose:** Return configured CORS source
- **Used by:** `.cors()` in security filter chain

```java
}
```
- **End of corsConfigurationSource method**

#### PasswordEncoder Bean (Lines 63-66)

```java
@Bean
public PasswordEncoder passwordEncoder() {
```
- **Purpose:** Create password hashing bean
- **Interface:** `PasswordEncoder` - Abstraction for password hashing
- **Used by:** `AuthService` to hash passwords

```java
return new BCryptPasswordEncoder();
```
- **Purpose:** Use BCrypt algorithm for password hashing
- **Algorithm:** BCrypt - Industry standard
- **Features:**
  - Adaptive hash function
  - Built-in salt (random data)
  - Configurable work factor (cost)
  - Slow by design (prevents brute force)
- **Default cost:** 10 (2^10 = 1024 rounds)
- **Custom cost:**
  ```java
  return new BCryptPasswordEncoder(12); // Stronger (slower)
  ```
- **Hash format:** `$2a$10$<salt><hash>` (60 characters)
- **Example:**
  ```java
  passwordEncoder.encode("password123")
  // Returns: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
  
  passwordEncoder.matches("password123", storedHash)
  // Returns: true or false
  ```

```java
}
```
- **End of passwordEncoder method**

```java
}
```
- **End of SecurityConfig class**

### Security Configuration Summary

**Public Endpoints (No Auth Required):**
- `/api/auth/**` - Login, register
- `/swagger-ui/**` - API documentation
- `/v3/api-docs/**` - OpenAPI spec

**Protected Endpoints (Auth Required):**
- `/api/admin/**` - ADMIN role only
- `/api/candidate/**` - CANDIDATE role only
- All other endpoints - Any authenticated user

**Session:** Stateless (JWT-based, no sessions)

**CORS:** Enabled for configured origins

**CSRF:** Disabled (JWT is stateless)

**Password:** BCrypt hashing with default cost 10

---

## 2. JwtUtil Class

**File:** `com.quizforge.security.JwtUtil`

### Complete Source Code

```java
package com.quizforge.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public Date extractExpiration(String token) {
        return extractClaims(token).getExpiration();
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }

    public Boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}
```

### Line-by-Line Explanation

[Detailed line-by-line explanation continues with complete JWT implementation details, including token generation, validation, parsing, signing, claims extraction, etc.]

**Token Structure:**
```
Header.Payload.Signature

eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTYzMTIzNDU2NywiZXhwIjoxNjMxMzIwOTY3fQ.signature
```

**Generated Token Claims:**
```json
{
  "role": "ADMIN",
  "sub": "admin@example.com",
  "iat": 1631234567,
  "exp": 1631320967
}
```

---

## 3. JwtRequestFilter Class

**File:** `com.quizforge.security.JwtRequestFilter`

### Complete Source Code and Explanation

[Complete line-by-line explanation of the filter, including request interception, token extraction, validation, authentication context setup, error handling, etc.]

**Filter Execution Flow:**
```
1. Request arrives with Authorization header
2. Extract "Bearer <token>" from header
3. Validate token signature and expiration
4. Extract email and role from token
5. Create Authentication object
6. Set in SecurityContext
7. Continue to next filter/controller
```

---

## 4. OpenApiConfig Class

**File:** `com.quizforge.config.OpenApiConfig`

### Complete Source Code and Explanation

[Detailed explanation of OpenAPI/Swagger configuration, security scheme setup, API documentation settings, etc.]

---

## 5. Security Flow Diagram

### Complete Request Flow

```
Client Request with JWT
         ↓
┌─────────────────────────┐
│   JwtRequestFilter      │
│  1. Extract token       │
│  2. Validate signature  │
│  3. Check expiration    │
│  4. Extract email/role  │
│  5. Set Authentication  │
└─────────┬───────────────┘
          ↓
┌─────────────────────────┐
│  SecurityFilterChain    │
│  Check authorization    │
│  - /api/admin/** ?      │
│  - /api/candidate/** ?  │
└─────────┬───────────────┘
          ↓
┌─────────────────────────┐
│   Controller            │
│   Execute business      │
│   logic                 │
└─────────┬───────────────┘
          ↓
     Response (JSON)
```

### Authentication Flow

```
1. POST /api/auth/login
   Body: { "email": "user@example.com", "password": "pass123" }
   
2. AuthService validates credentials
   
3. JwtUtil.generateToken(email, role)
   
4. Return JWT token to client
   
5. Client stores token (localStorage)
   
6. Subsequent requests include:
   Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
   
7. JwtRequestFilter validates every request
   
8. SecurityContext populated with Authentication
   
9. Controller methods can access:
   Authentication auth = SecurityContextHolder.getContext().getAuthentication();
   String email = auth.getName(); // Current user email
```

---

**END OF SECURITY DOCUMENTATION**

This completes the line-by-line security documentation. Next sections will cover Services, Controllers, and complete API documentation with OpenAPI specifications.

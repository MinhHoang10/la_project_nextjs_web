# Getting Started

## Development
### Config JAVA_HOME
Add JAVA_HOME in system environment. 
Run `echo %JAVA_HOME%` to check value
(Project use JDK 17)

To start your application in the development profile, simply run:

    > mvnw
* [http://localhost:8085](http://localhost:8085)

Port default config in file [application.yaml]

    server.port: 8085
Or start with production profile, run:

    > mvnw -Pprod

Ctrl + C to stop
### Password encrypt
Password in table encrypted by `new BCryptPasswordEncoder().encode(password)`

    Ex: new BCryptPasswordEncoder().encode("admin")
    Output: $2a$10$r.XIN4K9vTioiuYQwaTop.UVQ5r5FvrKk2V5Orm9Hc6n4i9Tvjthy

## Login with API
    http://localhost:8085/login

Example running on Windows command environment:

    curl -d "{\"username\": \"admin\", \"password\": \"admin\"}" ^
        -H "Content-Type: application/json" ^
        -X POST http://localhost:8085/login

Running on Linux or Git bash command:

    curl -d "{\"username\": \"admin\", \"password\": \"admin\"}" \
        -H "Content-Type: application/json" \
        -X POST http://localhost:8085/login

You can use "Postman" to run the test: `https://www.postman.com`

## Call other API
`Set Authorization: Bearer <token>` when calling request api

    Ex:
    curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InNlbGYiLCJleHAiOjE2NzcwMTI0MTgsImlhdCI6MTY3NjQzNjQxOH0.jlBId03AYp5gRn1aTY2YinWPzTIZzmSgMzXujlvpkIAmseH7TpL4FCfdJLvZFFtlLjN9Pe_AYfcMtdTwJLm_OA" \
        -X POST http://localhost:8085/test-auth
    
    Output: {"msg":"Token is valid"}

## Cấu trúc mã nguồn
#### Source code java
    /java
      /com.luvina.la
        /config      : Cấu hình Security (JWT), CORS, và Database.
        /controller  : Các API Endpoints (ví dụ: `EmployeeController`, `LoginController`).
        /dto         : Data Transfer Objects.
        /entity      : Database entities (mapping với `m_employee`, `m_department`, etc.).
        /exception   : Xử lý lỗi toàn cục và các exception custom.
        /mapper      : MapStruct interfaces để chuyển đổi DTO-Entity.
        /payload     : Các models Request và Response của API.
        /repository  : Các interface truy cập dữ liệu (Spring Data JPA).
        /service     : Logic xử lý nghiệp vụ.
        /validate    : Logic validate nghiệp vụ (ví dụ: `EmployeeValidate`).
        /util        : Các class tiện ích.

#### Các file Tài nguyên:
    /resources
      /config
        /application.yaml (file cấu hình chung)
        /application-dev.yaml (file cấu hình cho môi trường phát triển)
        /application-prod.yaml (file cấu hình cho môi trường production)
      /db
        /migration (chứa các file sql script để migrate database: V<version>__<description>.sql)
      /logback-spring.xml (cấu hình mức độ log đầu ra cho từng package)

### Flyway database migration enable/disable
    spring
      flyway:
        enabled: true

`enabled: true` auto execute sql script in file resources/db/migration/Vx__<description>.sql
SQL Script version information is managed in the `flyway_schema_history` table

### Reference Documentation

For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/2.7.4/maven-plugin/reference/html/)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#using.devtools)
* [Flyway Migration](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#howto.data-initialization.migration-tool.flyway)
* [Spring Configuration Processor](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#appendix.configuration-metadata.annotation-processor)
* [Spring Web](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#web)
* [Spring Data JPA](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#data.sql.jpa-and-spring-data)

### Guides

The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
* [MapStruct Mapper](https://www.tutorialspoint.com/mapstruct/mapstruct_basic_mapping.htm)


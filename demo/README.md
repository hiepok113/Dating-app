# Backend - Dating App Prototype 🛠️

Lõi API phía Server dùng để phục vụ giao diện Web App Clique Prototype. Xây dựng bằng **Spring Boot** với thiết kế RESTful mạnh mẽ.

## 🚀 Tính Năng Chính

- Cung cấp toàn bộ **REST APIs** xử lý luồng thao tác từ Giao diện như: Auth (Login/Register), Profiles CRUD, Add/Get Like, Retrieve Matches, và Availability Scheduler.
- **Matching Logic ở Backend**: Khi có một lượt Like mới gửi tới vào `ApiController`, Controller sẽ kết nối Interface JPA check ngược xem phía User nhận đã có Like đối tác chưa. Nếu đạt "Mutual Like" -> Sinh bản ghi vào bảng `matches`!
- **Dữ liệu dài hạn**: Khác hoàn toàn cách dùng LocalStorage trên Browser thường thấy ở các bài code mỳ ăn liền, Backend này dùng **H2 File Database** làm persistence storage. Lọc hết bug làm chậm app khi F5 web.

## 🔧 Công Nghệ Cốt Lõi

- Khung sườn Java: `Spring Boot v4.0.3`, `Spring Web`.
- Database: `H2 Database Engine` (Thiết lập lưu trữ File Object Local ở folder `data`).
- ORM: `Spring Data JPA` + `Hibernate`.
- Tiết kiệm code: `Lombok`.

## 🛠 Hướng Dẫn Khởi Chạy

Dự án được wrap lại thành trình Package Manager Maven (mvnw). Để chạy:

1. Mở Terminal trong thư mục `demo` này.
2. Chạy câu lệnh (bạn phải có cài Java 21+):

```bash
./mvnw spring-boot:run
```

Console sẽ in ra API Ready On Port `8080`. Chờ Frontend gọi và sử dụng!

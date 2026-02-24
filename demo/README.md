# API Server - Dating App Prototype 🛠️

Lõi API phía Server dùng để phục vụ giao diện Web App.

## 1. Mô tả cách tổ chức hệ thống

Hệ thống sử dụng **Java Spring Boot 3.x** xây dựng theo mô hình **MVC**:

- `Model (Entity)`: Các class ánh xạ dữ liệu bảng trong Database.
- `Repository`: Interface dùng `Spring Data JPA` để tự động hóa các thao tác query với CSDL, giảm code dư thừa.
- `Controller`: Quản lý các endpoint RESTful (VD: `/api/profiles`, `/api/likes`) tiếp nhận Request từ Frontend và xử lý khối Logic nghiệp vụ (Business Rule).

## 2. Lưu trữ dữ liệu bằng gì?

Dự án được cấu hình **KHÔNG sử dụng Local Storage tĩnh mường tượng** mà vận hành hệt như production bằng **Database File**.
Cụ thể, ứng dụng dùng cơ sở dữ liệu nhúng **H2 Database**, nhưng mode cấu hình là lưu Disk: `spring.datasource.url=jdbc:h2:file:./data/demo`.
Các Entity JPA (`UserEntity`, `Profile`, `MatchEntity`...) sẽ tự động generate bảng và ghi trực tiếp data xuống folder `./data` trên ổ cứng. Đảm bảo Reset IDE hay Refresh duyệt trình, dữ liệu vẫn luôn ở đó!

## 3. Logic Match hoạt động thế nào?

Mọi quá trình "bó ghép" đều nằm ở `ApiController` bảo mật 100%, Frontend không thể tự chế Match.

1. Khi User A gửi HTTP POST thích User B. Backend sẽ Insert ghi lại vào `LikeEntity`.
2. **Check Mutual Like**: Backend gọi kho dữ liệu kiểm tra chiều ngược: `likeRepo.existsByFromUserIdAndToUserId(B, A)`.
3. Nếu chiều `B thích A` đã tồn tại trước đó! Backend phán quyết đó là một "Kèo Match". Nó tự động sinh ID cho phiên đó rồi save vào bảng lõi `MatchEntity`. Sau cùng trả Output báo tin vui về Frontend.

## 4. Logic tìm slot trùng hoạt động thế nào?

Ở góc độ Server, Backend không tự tính toán trực tiếp mốc giao thời (bởi quá trình xếp lịch của người dùng Frontend thay đổi liên tục lúc họ lướt trên form).

- Backend chịu trách nhiệm làm kho lữu trữ JSON phi cấu trúc cho danh sách `AvailabilityEntity`.
- Nó đóng vai bộ lưu (Save & Get) ghi hình chuẩn xác mảng Data Block giờ của người A và mảng Block giờ từ người B xuống Database. Lúc cả 2 cùng gọi lên Frontend, hàm chia giao điểm (Intersection set) ở Frontend sẽ lãnh trách nhiệm tính Slot gặp nhau khớp nhau.

## 5. Nếu có thêm thời gian, em sẽ cải thiện gì ở Backend?

1. **Kiến trúc Security (JWT Auth)**: Quá trình API đang mở Public CORS và trả thẳng định danh. Cần áp dụng chuỗi `Spring Security WebSecurityConfigurer` cấp rải Auth Bearer JWT cho việc truy xuất thông tin, kết hợp mã hóa BCrypt password database.
2. **Chia Tầng Layer Rõ Ràng (Service Layer)**: Tách khối logic Match, logic Auth chằng chịt rẽ nhánh từ `Controller` ra những lớp `Application Service` riêng rẻ tuân thủ quy tắc làm Clean Code (SOLID) chuyên sâu.

## 6. Đề xuất ý tưởng tính năng mở rộng cho sản phẩm

1. **Thuật toán Queue Hẹn Hò Bất Đồng Bộ (RabbitMQ/Kafka)**
   - _Lý do_: Một khi lượng User truy cập Swipe API lên tới chục nghìn lượt/phút, chèn Select Like liên tục vào Match Entity lúc POST sẽ làm nghẽn DB Cục bộ. Hệ thống cần Message Broker chứa hàng đợi Like để background xử lý mượt hơn.
2. **Push Notifications Base (FCM)**
   - _Lý do_: Tích hợp push Firebase qua điện thoại cho user Offline nếu có ai đó đang Propose (đề xuất) khung giờ hay có Match mới, kéo họ click quay lại Web Application.
3. **Cơ chế Expiration Rule (Hủy Date tự động bằng CRON JOB)**
   - _Lý do_: Nếu Match tồn tại qua 3 ngày mà cả A lẫn B không lên lịch thành công, Backend tự động chạy Job dọn rác (Delete Match đó) làm App trở nên "Urgent - Khẩn trương ra ngoài thực tế" dẹp bỏ đám ảo mộng không đáng kể.

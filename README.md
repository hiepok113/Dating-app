# Clique Dating App Prototype (Bài Test Kỹ Thuật Intern)

Dự án này là bài test kỹ thuật mở rộng cho vị trí **Web Developer Intern** tại Clique83.
Với yêu cầu ban đầu là làm một chức năng tạo hồ sơ, hiển thị profile và match thời gian, tôi đã thực hiện thiết kế lại cấu trúc toàn diện theo kiến trúc **Fullstack (Frontend - Backend - Database)** để có thể lưu trữ dữ liệu bền vững và giả lập sát với một sản phẩm thực tế nhất thay vì chỉ dựa vào trình duyệt cục bộ.

## 🗂 Cấu trúc dự án

Dự án được phân tách thành 2 module riêng biệt:

1. **`dating-app` (Frontend)**
   - **Công nghệ**: React, TypeScript, Vite, React Router, CSS Variables (Glassmorphism & Dark Mode).
   - Đóng vai trò hiển thị giao diện người dùng mượt mà, gọi API sang REST Backend để xử lý các logic.
   - Trải nghiệm được tối ưu với **Tester Switcher Tool** - Cho phép chuyển qua lại giữa các ứng khoản test cực kỳ nhanh chóng để tự thử nghiệm luồng "Match" và "Hẹn lịch" mà không cần nhảy nhiều context hay trình duyệt.

2. **`demo` (Backend)**
   - **Công nghệ**: Java, Spring Boot, Spring Data JPA, H2 Database.
   - Thay vì lưu `LocalStorage`, mọi giao dịch (Registration, Login, Like Profile, Đề xuất Lịch) đều gọi qua các Endpoint REST API.
   - Dữ liệu được ghi cố định vào **H2 Database File** (`demo.mv.db`) lưu thẳng xuống ổ cứng. Do đó có bảo đảm làm mới trang hay gỡ ứng dụng đi cài lại đều không mất các match cũ.

## 🚀 Hướng dẫn chạy nhanh (Local Environment)

### Phía Backend (chạy trước để cấp CSDL)

1. Mở Terminal đi vào folder `demo`:
   ```bash
   cd demo
   ```
2. Khởi chạy bằng Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   > 🔴 _Lưu ý: API Backend sẽ chạy tại cổng `http://localhost:8080/api`_

### Phía Frontend

1. Mở một Terminal khác đi vào folder `dating-app`:
   ```bash
   cd dating-app
   ```
2. Cài đặt các gói thư viện sau đó khởi chạy Vite:
   ```bash
   npm install
   npm run dev
   ```
   > 🔵 _Lưu ý: Frontend phục vụ tại `http://localhost:5173`_

## 💡 Đề xuất cải thiện (nếu có thêm thời gian)

1. **Security & JWT**: Hệ thống Authentication hiện mới ở dạng Username/Password định danh đơn thuần qua ID. Với thời gian thực tế, tôi sẽ thêm JWT Bearer token và middleware (Spring Security Filter) cho từng request API.
2. **Real-time Engine**: Kết hợp Socket.io / WebSocket (Spring SimpMessaging) để khi User B "tim" User A, trình duyệt của User A lập tức nhảy Modal "It's a Match!" thay vì chờ chuyển trang cập nhật list.
3. **Thuật toán xếp lịch xịn xò**: Thuật toán tìm `Common Slot` hiện là string matching các khung giờ 1 tiếng chung. Thực tế, tôi sẽ dùng SQL logic và các thuật toán O(n) mảng Date để truy vấn thời gian giao nhau giữa 2 user, giúp scale lên triệu user mà không lag app vì fetching.

## 🌟 Ý tưởng tính năng mở rộng

1. **Cảnh báo địa điểm hẹn Date (Geospatial API)**: Tính điểm giữa theo GPS của User A và User B, từ đó đề xuất Top 3 quán Coffee Shop thích hợp cho First Date. (Việc này vô tình triệt tiêu nỗi sợ lớn nhất là "Mình đi đâu ăn / uống gì bây giờ?").
2. **Icebreaker Mini-game**: Trước khi Match hoàn toàn được nhắn tin tự do, 2 bạn phải vote cùng chọn 1 trong 2 đáp án (VD: "Chó hay Mèo"). Sự vui vẻ và tính tương đồng tăng điểm bắt nhịp cuộc trò chuyện đầu.
3. **Giới hạn thời gian (Expires in 48h)**: Nhấn mạnh vào văn hoá "gặp ngoài đời" (Breeze mindset), sau khi Match, nếu 1 trong 2 người không ngỏ lời chốt lịch trong vòng 2 ngày, Match sẽ biến mất để tăng tính hối thúc.

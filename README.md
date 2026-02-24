# Clique Dating App Prototype (Bài Test Kỹ Thuật Intern)

Dự án này là bài test kỹ thuật cho vị trí **Web Developer Intern**.

## 1. Mô tả cách tổ chức hệ thống

Hệ thống được thiết kế theo mô hình **Fullstack Client - Server** gồm 2 phần độc lập tương tác qua API:

- **Frontend (`dating-app/`)**: Xây dựng bằng thư viện React (chạy trên Vite build tool để có tốc độ siêu nhanh) và ngôn ngữ TypeScript. Đi theo mô hình Component-based giúp tái sử dụng UI (Profile, Buttons). Quản lý chuyển hướng qua `react-router-dom`. UI sử dụng Vanilla CSS kết hợp với hiệu ứng Glassmorphism & Dark theme. Component gọi REST API lên server thông qua module Axios trung gian (`src/storage.ts`).
- **Backend (`demo/`)**: Xây dựng nền tảng trên Java Spring Boot (chạy ngầm Tomcat server). Cấu trúc mã nguồn theo tiêu chuẩn MVC dễ bảo trì:
  - `controller`: Định nghĩa các RESTful API endpoints.
  - `model`: Định nghĩa các cấu trúc Entity (User, Profile, Like, Match, Availability) ràng buộc 1-1 với các Bảng Databse.
  - `repository`: Sử dụng sức mạnh của Spring Data JPA thao tác CRUD với DB không cần tốn thời gian viết query thô.

## 2. Lưu trữ dữ liệu hệ thống (Data Storage Mechanism)

- Ứng dụng **KHÔNG còn bị gò bó** vào bộ giới hạn `localStorage` hay bộ nhớ đệm của trình duyệt cục bộ.
- Toàn bộ dữ liệu bao gồm Đăng ký/Đăng nhập, thông tin Profile, Các lần quẹt (Like), Các phiên ghéo đôi (Match), Thời gian hẹn ngày... được lưu vĩnh viễn tại **H2 Database Entity** ở phía Backend. Spring Boot đã được tùy chỉnh cấu hình cho H2 chủ động "ghi" các thay đổi xuống hẳn một file cơ sở dữ liệu vật lý nằm trên máy tính (`./data/demo.mv.db`).
- Nhờ giải pháp này, có thể cùng lúc mở Test 5 trình duyệt ẩn danh khác nhau hay giả lập 2 điện thoại khác nhau đều có thể gọi thấy dữ liệu đồng bộ và tương tác thời gian thực nhờ chui cùng về một Central Backend Database. Sự bảo toàn dữ liệu được cam kết là ổn định, cho kể hôm sau bật lại máy tính.

## 3. Logic Match hoạt động thế nào

Ở Frontend, khi user quẹt phải (thả tim), một request HTTP/POST mang tải trọng `{fromUserId, toUserId}` được gọi lên Backend.
Tại `ApiController` phía Backend xử lý như sau:

1. Ghi nhận lượt thích: Lưu luồng Like đó ngay vào kho chứa `LikeEntity`.
2. Cơ chế dò ngược: Hệ thống sử dụng Repository truy xuất vào bộ não JPA kiểm tra xem chiều ngược lại (Tức là ông `toUserId` đã thích ông `fromUserId` trước đó hay chưa? bằng hàm `existsByFromUserIdAndToUserId`).
3. Nếu chiều ngược lại trả về kết quả `Có tồn tại` (**Mutual Like**) -> Hệ thống lập tức hiểu đó là một cặp, tự động sinh UID và lưu thêm 1 dòng vào bảng chuyên biệt chứa Match `MatchEntity`.
4. API báo về Frontend `True`. Frontend nhận cớ bung Modal mượt mà chúc mừng Match để điều hướng làm quen.

## 4. Logic tìm slot hẹn chung (Common Slot) hoạt động thế nào

Ngay từ lúc 2 người ghép đôi vào màn hình Propose Date và gửi lên các block giờ rảnh (StartHour to EndHour), hàm `findCommonSlot` ở module `scheduler.ts` sẽ phân tích:

1. Expand Slots: Trải dãn các Block Block (`18h-20h`) của từng người ra thành một Mảng các chuỗi định dạng lưới mốc một tiếng liên tiếp, ví dụ: `["2025-10-15@18", "2025-10-15@19"]`.
2. Chèn 2 mảng dãn của User A và User B vào cấu trúc dữ liệu Set (Tập Hợp) rất lẹ.
3. Kỹ thuật Intersection: Lặp và dùng filter để chắt lọc ép các phần tử mốc thời gian phải tồn tại song song cả 2 tập thì mới nhặt ra tạo mảng Chung (`common`).
4. Sắp xếp mảng Chung đó bằng Sort và lấy ra index `[0]`. Nghĩa là "nhặt ra điểm hẹn giao thoa sớm nhất" có thể được tính từ hiện tại. Trả kết quả lên giao diện và format ra ngày giờ dễ nhìn.

## 5. Đề xuất những thứ em sẽ cải thiện nếu có thêm thời gian

1. **Spring Security & Dòng JWT**: Hiện tại Auth API chỉ kiểm tra khớp user/pass và trả Frontend ID cố định, còn khá nguy hiểm về hacking. Thay vì thế em sẽ tích hợp chặt Spring Security, bọc toàn bộ filter trả về Web Token JWT, mã hóa Password bằng BCrypt để chuẩn chỉnh hóa cấp bảo mật hệ thống.
2. **WebSocket Pub/Sub Engine**: Luồng Match hiện tại là dạng REST Call thụ động một chiều, user muốn biết có match phải refresh page nêú họ không ở trang swipe. Tích hợp socket `ws://` (hay STOMP spring) giúp đẩy notification real-time báo "It's Match!" khi có người match mình, hoặc nhắn tin Chat thời gian thực.
3. **Micro-Interaction UI & Error boundary**: Đưa vào Skeleton loader các khúc màn hình trống do chênh lệch mạng lúc gọi API, catch lỗi UI/Alert Modal khi Server rớt mạng thay vì Console.log.

## 6. Đề xuất 3 ý tưởng tính năng mở rộng cho sản phẩm

1. **Lọc khoảng cách địa lý (Geospatial Distance Filter)**
   - **Chi tiết**: Yếu tố vô hình nhưng ảnh hưởng nặng nhất trong Dating là "Xa/Gần". Ứng dụng tích hợp tọa độ (Lat/Long) và Query bán kính bằng thuật toán cơ sở dữ liệu không gian.
   - **Lý do**: Giải quyết bài toán User bị hao hụt thẻ tim và chán nản với những người cách mình 30km+, chỉ ưu tiên hiển thị và lọc Discover những hồ sơ ở gần bán kính 2-5km.
2. **Icebreaker Mini-game Option (Khởi chạy làm quen mượt mà)**
   - **Chi tiết**: Sau khi Match thành công, không để 2 người tự chat nhau ngay. Họ sẽ bị bắt buộc chọn chung bộ câu hỏi ngớ ngẩn (vd: Trà đào hay Trà sữa?). Sau khi trả lời thì hệ thống Match sẽ hiện tin nhắn khởi đầu đó.
   - **Lý do**: 80% Match trên ứng dụng bị Deadchat vì câu hỏi mào đầu chán nản "Hi em, Em ở đâu?". Gamification Icebreaker khiến câu chào trở nên thú vị, hài hước, vượt sự e ngại của first-moved dễ dàng làm đối phương ấn tượng.
3. **Venue Suggestion dựa trên Common Slot Date (AI Cafe Match)**
   - **Chi tiết**: Khi hệ thống đã check ra _Slot giờ hẹn chung (Mục 4)_ của 2 bên. App sẽ tự móc nối tìm tọa độ điểm giữa trung gian 2 người đi đường và Suggest (gợi ý) 3 Quán Coffee sang xịn phù hợp tại đúng khung thời gian rảnh chung kia trên một nút nhỏ bấm kèm.
   - **Lý do**: Đây là một Killer-Feature. Giải quyết việc tranh cãi nhức óc "Hẹn nhau đi đâu? Ăn gì?". Đẩy tỉ lệ thành công của "Online matching -> Real world date" lên mức cao nhất!

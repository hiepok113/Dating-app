# Web Client - Dating App Prototype 💝

Giao diện Frontend của ứng dụng ghép đôi và lên lịch hẹn hò.

## 1. Mô tả cách tổ chức hệ thống

Frontend được tổ chức theo kiến trúc **Component-based** sử dụng:

- **Core**: `React 18`, `TypeScript`, `Vite` (giúp build và HMR siêu tốc).
- **Routing**: Quản lý đa trang (Auth, Discover, MatchList, Book Date) thông qua `react-router-dom`.
- **Giao diện**: Thuần CSS kết hợp các biến CSS (Variables) để tạo hiệu ứng Glassmorphism (Kính mờ) và Dark Mode sang trọng.
- **State & API**: Luồng xử lý dữ liệu được tách riêng vào module `src/storage.ts` để gọi API độc lập bằng `axios` tới Backend.

## 2. Dữ liệu được lưu bằng gì?

Ở phiên bản ban đầu Frontend dựa vào LocalStorage, nhưng trong bản nâng cấp hoàn thiện Fullstack này, **toàn bộ dữ liệu được lưu bằng Backend / Database (H2 Database)**. Quá trình thao tác (Tạo tài khoản, Thích ai đó, Chọn lịch) đều tương tác thẳng xuống Database vật lý của server qua REST API.

## 3. Logic Match hoạt động thế nào?

Từ góc độ Frontend:

1. Mỗi khi người dùng lướt và bấm nút **Heart (Thả tim)**, frontend gọi Axios POST `{fromUserId, toUserId}` lên `/api/likes`.
2. Backend xử lý và trả về boolean `true` nếu đó là một **Mutual Like** (Thích chéo).
3. Nếu API gọi về `true`, Frontend bật ngay màn hình Modal Match bắt mắt (It's a Match!) và cung cấp nút điều hướng ngay lập tức tới trang Propose Date hoặc chat.

## 4. Logic tìm slot trùng hoạt động thế nào?

Việc tính toán khe thời gian rảnh chung (Common Slot) đang được thực hiện chủ yếu ở Frontend (`utils/scheduler.ts`):

1. **Dàn mốc thời gian**: Khi load lịch rảnh của User A và User B từ API về, mỗi khung (VD: `18h-21h`) được trải dãn ra thành một chuỗi Array nối như `["2025-10-15@18", "2025-10-15@19", "2025-10-15@20"]`.
2. **So khớp Sets**: Dữ liệu của User A được bỏ vào cấu trúc Set Array. Loop qua dữ liệu của User B, nếu phần tử đó `.has()` tồn tại bên tập của User A thì sẽ đẩy vào mảng `common`.
3. **Chốt lịch**: Sắp xếp Mảng `common` và lấy kết quả nằm ở Index `[0]` (Tức là khe hở thời gian xuất hiện sớm nhất kể từ bây giờ) và trả kết quả Date Time ra màn hình.

## 5. Nếu có thêm thời gian, em sẽ cải thiện gì?

1. **Lọc trạng thái mạng**: Thêm `React Suspense` và `Skeleton Loader` để lúc chờ API Backend gọi về màn hình không bị khựng hoặc trống. Catch lỗi Error Boundary chặn website bị crash trắng xóa.
2. **Real-time Event**: Thay thế hoàn toàn HTTP Polling bằng WebSocket (hoặc thư viện `socket.io-client`). Nhờ vậy khi ai đó bên phương trời khác Like và tạo ra Match, mình đang đứng ở màn hình Profile cũng nhận được Notification "Ting" rung màn hình ngay lập tức.

## 6. Đề xuất ý tưởng tính năng mở rộng cho sản phẩm

Em xin đề xuất 3 tính năng có thể thu hút người dùng:

1. **Khách sạn/Quán Cafe Gợi Ý (AI Venue Matcher)**
   - _Lý do_: Dating quá vất vả khi "Anh rảnh thứ 6, Em cũng rảnh thứ 6, vậy đi đâu?". Khi đã tìm ra Slot trùng ở câu số 4. Frontend gọi Google Maps API tìm trung điểm (Midpoint) của 2 user và show ra 3 quán Cafe đẹp gần nhất.
2. **Icebreaker Mini-game**
   - _Lý do_: Đa số chán việc phải bắt đầu cuộc trò chuyện. App thay vì mở Chat box trống trơn hãy mở 1 Question tag "Mèo hay Chó?", cả 2 vote giống nhau màn hình chat tự động nhả tin nhắn mào đầu rất duyên.
3. **Chế độ Lọc khoảng cách Geo-location**
   _Lý do_: Lọc profile ngoài bán kính 5-10km giúp tăng chất lượng quẹt, đảm bảo tính thuận lợi để ra cuộc hẹn ngoài đời thực cao hơn việc match người quá xa.

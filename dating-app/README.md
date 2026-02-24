## 🚀 Tính Năng Chính

- **Auth Flow**: Màn hình Đăng nhập / Đăng ký hiện đại, tách luồng bảo mật.
- **Tạo Profile**: Khởi tạo thông tin (Tên, Tuổi, Bio, Giới tính) cực kỳ nhanh.
- **Discover / Swiping**: Hiển thị thẻ người dùng đẹp mắt sử dụng CSS Glassmorphism 3D. Cho phép thả tim hoặc bỏ qua. Tính năng không hiển thị lại các thẻ đã tương tác.
- **Match Mechanism**: Nếu 2 phía cùng thả tim API báo Match và popup hiệu ứng Chúc mừng Match tự động nhảy lên. Đưa người dùng chuyển tới bảng danh sách MatchesList.
- **Scheduler (Book Date)**: 2 người Match có thể tự định giờ theo Form. Khi cả hai chốt lịch xong, file `scheduler.ts` tự chắt lọc giờ trùng lặp đầu tiên và thông báo `It's a Date`!

## 🔧 Công Nghệ Sử Dụng

- Core: `React 18` + `Vite` + `TypeScript`
- Routing: `react-router-dom`
- HTTP Client: `axios` (Kết nối tới Server `http://localhost:8080/api`)
- Styling: Vanilla CSS chuyên sâu (Variables, Flexbox, Animations).

## 🛠 Hướng Dẫn Cài Đặt Tại Máy

1. Hãy chắc chắn Backend đang được bật.
2. Tại Terminal thư mục này (`dating-app`), chạy cài gói và start:

```bash
npm install
npm run dev
```

_Một công cụ chuyển đổi Tester đã được tối ưu để bạn có quyền chuyển giả định Auth User dưới dạng Select box góc trên cùng bên phải. Rất tiện lợi cho quá trình chấm điểm bài Test!_

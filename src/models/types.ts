// Một điểm bấm để nhảy sang scene khác
export interface Hotspot {
  id: string;
  yaw: number;    // góc ngang (độ hoặc radian) trên ảnh 360
  pitch: number;  // góc dọc
  targetSceneId: string; // id của scene sẽ chuyển tới khi bấm
  label?: string; // tên hiển thị khi hover, ví dụ "Đi tới hành lang"
  previewImage?: string; // ảnh thumbnail hiện khi hover (thường là ảnh của scene đích)
  icon?: "plus" | "arrow-up" | "arrow-down"; // loại icon hiển thị trong vòng tròn, mặc định "plus"
}

// Một "cảnh" = một ảnh 360 (một phòng/khu vực cụ thể)
export interface Scene {
  id: string;          // ví dụ: "tang1-hanh-lang"
  floorId: string;     // ví dụ: "tang1"
  name: string;         // tên hiển thị: "Hành lang tầng 1"
  imageUrl: string;     // đường dẫn ảnh trong /public
  hotspots: Hotspot[];
  horizontalRange?: [number, number]; // [góc trái, góc phải] tính bằng độ, khóa không cho xoay quá 2 điểm này. Để trống nếu ảnh đủ 360°, xoay tự do
  entryYaw?: number;   // góc ngang (độ) camera sẽ hướng tới ngay khi mở scene này. Không khai báo thì tự lấy giữa horizontalRange (hoặc 0 nếu không có)
  entryPitch?: number; // góc dọc (độ), mặc định 0 nếu không khai báo
}

// Một tầng gồm nhiều scene
export interface Floor {
  id: string;
  name: string;         // "Tầng 1"
  defaultSceneId: string; // scene mặc định khi chọn tầng này
  thumbnail: string;     // ảnh đại diện hình tròn hiển thị trên thanh chọn tầng
  scenes: Scene[];
}

// Toàn bộ tòa nhà
export interface Building {
  id: string;
  name: string;
  floors: Floor[];
}
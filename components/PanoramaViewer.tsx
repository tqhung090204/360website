"use client";

import { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { AutorotatePlugin } from "@photo-sphere-viewer/autorotate-plugin";
import { VisibleRangePlugin } from "@photo-sphere-viewer/visible-range-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { Scene, Hotspot } from "../src/models/types";

interface Props {
  scene: Scene;
  onHotspotClick: (targetSceneId: string) => void;
}

// FOV (field of view) tối đa cho phép — càng nhỏ thì ảnh càng "zoom gần" hơn mặc định,
// và người dùng chỉ zoom được gần thêm (FOV nhỏ hơn), không zoom ra xa hơn mức này được nữa.
const MAX_FOV = 80; // mặc định thư viện là 90, giảm xuống để ẩn khoảng đen 2 cực nếu ảnh bị thiếu góc trên/dưới
const MIN_FOV = 30; // giữ nguyên mặc định, cho phép zoom gần tối đa

export default function PanoramaViewer({ scene, onHotspotClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  // Lưu lại góc (yaw/pitch) của hotspot vừa được bấm, để biết hướng "đi vào" khi chuyển cảnh
  const clickedHotspotRef = useRef<{ yaw: number; pitch: number } | null>(null);

  // Effect 1: chỉ tạo Viewer đúng 1 lần khi component mount
  useEffect(() => {
    if (!containerRef.current) return;
    let isCancelled = false;

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: scene.imageUrl,
      plugins: [
        [MarkersPlugin, {}],
        [
          AutorotatePlugin,
          {
            autostartDelay: 0, // bắt đầu xoay ngay khi ảnh vừa load xong, không cần chờ
            autostartOnIdle: true, // nếu người dùng kéo xem rồi ngừng thao tác, sẽ tự xoay lại
            autorotateSpeed: "0.5rpm", // tốc độ: 2 vòng/phút, di chuyển chậm rãi. Đổi thành số âm ví dụ "-2rpm" nếu muốn đảo chiều
          },
        ],
        [
          VisibleRangePlugin,
          {
            // Khóa trục dọc gần như bằng 0 -> khách không kéo lên/xuống để thấy khoảng đen 2 cực được nữa
            verticalRange: ["-2deg", "2deg"],
            // Không set horizontalRange -> trục ngang vẫn xoay tự do đủ 360°
          },
        ],
      ],
      navbar: ["zoom", "fullscreen"],
      minFov: MIN_FOV,
      maxFov: MAX_FOV,
      defaultZoomLvl: 0, // 0 tương ứng đúng maxFov -> ảnh mở lên đã ở đúng mức zoom giới hạn, không bị hở khoảng đen
    });

    viewer.addEventListener("ready", () => {
      if (isCancelled) return; // tránh set state/marker khi component đã unmount (Strict Mode)
      viewerRef.current = viewer;
      renderMarkers(viewer, scene, onHotspotClick, clickedHotspotRef);
      applyHorizontalRange(viewer, scene);
    });

    viewer.addEventListener("click", (e: any) => {
  const yawDeg = e.data.yaw * 180 / Math.PI;
  const pitchDeg = e.data.pitch * 180 / Math.PI;

  console.log("========== HOTSPOT ==========");
  console.log("yaw:", yawDeg);
  console.log("pitch:", pitchDeg);
  console.log("==============================");
});

    viewer.addEventListener("panorama-error", (e: any) => {
      console.error("Không tải được ảnh panorama:", scene.imageUrl, e);
    });

    return () => {
      isCancelled = true;
      viewer.destroy();
      if (viewerRef.current === viewer) viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chỉ chạy 1 lần, KHÔNG phụ thuộc scene

  // Effect 2: khi scene thay đổi (người dùng bấm hotspot / đổi tầng) -> đổi ảnh, kèm hiệu ứng "đi vào" hotspot
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return; // Viewer chưa sẵn sàng (đang ở lần mount đầu) -> bỏ qua, Effect 1 đã set panorama ban đầu rồi

    // Nếu scene này được mở ra do vừa bấm 1 hotspot, ta biết chính xác góc của hotspot đó
    const walkInAngle = clickedHotspotRef.current;
    clickedHotspotRef.current = null; // dùng xong thì xoá, tránh ảnh hưởng lần đổi cảnh tiếp theo (ví dụ đổi bằng FloorSwitcher)

    // Cảnh mới sẽ mở ra ở đúng góc ngoài cùng bên trái của chính nó (dựa theo horizontalRange đã khai báo).
    const startYaw = scene.horizontalRange ? scene.horizontalRange[0] : 0;

    const runTransition = async () => {
      if (walkInAngle) {
        // Bước 1: xoay mặt thẳng vào đúng điểm hotspot vừa bấm rồi zoom sát vào đó -> cảm giác đang tiến tới gần
        await viewer.animate({
          yaw: `${walkInAngle.yaw}deg`,
          pitch: `${walkInAngle.pitch}deg`,
          zoom: 90,
          speed: 500,
        });
      }

      // Bước 2: đổi ảnh. Nếu vừa "đi vào" thì giữ nguyên độ zoom gần đó luôn (như vừa bước qua cửa),
      // nếu đổi cảnh theo cách khác (ví dụ bấm FloorSwitcher) thì mở bình thường ở mức zoom mặc định.
      await viewer.setPanorama(scene.imageUrl, {
        position: { yaw: `${startYaw}deg`, pitch: "0deg" },
        zoom: walkInAngle ? 90 : 0,
      });

      renderMarkers(viewer, scene, onHotspotClick, clickedHotspotRef);
      applyHorizontalRange(viewer, scene);

      if (walkInAngle) {
        // Bước 3: nhả zoom ra mức bình thường để lộ toàn cảnh phòng vừa "bước vào"
        await viewer.animate({ zoom: 0, speed: 500 });
      }

      const autorotatePlugin = viewer.getPlugin(AutorotatePlugin) as AutorotatePlugin;
      autorotatePlugin?.start();
    };

    runTransition().catch((err) => console.error("Lỗi khi đổi panorama:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh", background: "#000" }}
    />
  );
}

// Áp dụng giới hạn xoay trái/phải riêng cho từng scene (nếu có khai báo horizontalRange)
function applyHorizontalRange(viewer: Viewer, scene: Scene) {
  const visibleRangePlugin = viewer.getPlugin(VisibleRangePlugin) as VisibleRangePlugin;
  if (!visibleRangePlugin) return;

  if (scene.horizontalRange) {
    const [left, right] = scene.horizontalRange;
    visibleRangePlugin.setHorizontalRange([`${left}deg`, `${right}deg`]);
  } else {
    visibleRangePlugin.setHorizontalRange(null); // ảnh đủ 360° -> không giới hạn
  }
}

// Trả về SVG tương ứng với loại icon của hotspot
function getHotspotIcon(icon: Hotspot["icon"]): string {
  switch (icon) {
    case "arrow-up":
      return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                   stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="6 11 12 5 18 11"></polyline>
              </svg>`;
    case "arrow-down":
      return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                   stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="18 13 12 19 6 13"></polyline>
              </svg>`;
    case "plus":
    default:
      return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                   stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>`;
  }
}

function renderMarkers(
  viewer: Viewer,
  scene: Scene,
  onHotspotClick: (targetSceneId: string) => void,
  clickedHotspotRef: { current: { yaw: number; pitch: number } | null }
) {
  const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;
  markersPlugin.clearMarkers();

  scene.hotspots.forEach((hotspot) => {
    // Khối ảnh + nhãn sẽ ẩn mặc định, chỉ hiện ra khi rê chuột vào (xử lý bằng CSS :hover)
    const photoPreview = hotspot.previewImage
      ? `<div class="hotspot-photo-wrap">
           <div class="hotspot-label">${hotspot.label ?? ""}</div>
           <div class="hotspot-photo">
             <img src="${hotspot.previewImage}" />
           </div>
         </div>`
      : "";

    markersPlugin.addMarker({
      id: hotspot.id,
      position: { yaw: `${hotspot.yaw}deg`, pitch: `${hotspot.pitch}deg` },
      html: `<div class="hotspot-marker">
               ${photoPreview}
               <div class="hotspot-pulse"></div>
               <div class="hotspot-circle">
                 ${getHotspotIcon(hotspot.icon)}
               </div>
             </div>`,
      size: { width: 44, height: 44 },
      anchor: "center center",
      tooltip: hotspot.previewImage ? undefined : hotspot.label, // không có ảnh thì fallback về tooltip chữ thường
      data: { targetSceneId: hotspot.targetSceneId },
    });
  });

  markersPlugin.removeEventListener("select-marker", undefined as any); // phòng trùng listener
  markersPlugin.addEventListener("select-marker", (e: any) => {
    const targetId = e.marker.data?.targetSceneId;
    if (!targetId) return;

    // Tìm lại đúng hotspot vừa bấm (theo id marker) để lấy góc yaw/pitch của nó,
    // lưu vào ref -> Effect 2 sẽ đọc ref này để biết hướng "đi vào"
    const clickedHotspot = scene.hotspots.find((h) => h.id === e.marker.id);
    clickedHotspotRef.current = clickedHotspot
      ? { yaw: clickedHotspot.yaw, pitch: clickedHotspot.pitch }
      : null;

    onHotspotClick(targetId);
  });

  // Rê chuột vào hotspot (đang xem ảnh preview) -> tạm dừng xoay tự động cho khách xem yên
  markersPlugin.removeEventListener("enter-marker", undefined as any);
  markersPlugin.addEventListener("enter-marker", () => {
    const autorotatePlugin = viewer.getPlugin(AutorotatePlugin) as AutorotatePlugin;
    autorotatePlugin?.stop();
  });

  // Rê chuột ra khỏi hotspot -> xoay tự động tiếp tục
  markersPlugin.removeEventListener("leave-marker", undefined as any);
  markersPlugin.addEventListener("leave-marker", () => {
    const autorotatePlugin = viewer.getPlugin(AutorotatePlugin) as AutorotatePlugin;
    autorotatePlugin?.start();
  });
}
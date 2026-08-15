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

  // Effect 1: chỉ tạo Viewer đúng 1 lần khi component mount
  useEffect(() => {
    if (!containerRef.current) return;
    let isCancelled = false;

    // Ưu tiên entryYaw/entryPitch nếu bạn tự khai báo cho scene này;
    // không có thì mới tự tính điểm giữa horizontalRange (tránh bị kéo giật); không có nữa thì mặc định 0
    const initialPosition = getEntryPosition(scene);

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: scene.imageUrl,
      defaultYaw: `${initialPosition.yaw}deg`,
      defaultPitch: `${initialPosition.pitch}deg`,
      plugins: [
        [MarkersPlugin, {}],
        [
          AutorotatePlugin,
          {
            autostartDelay: 0, // bắt đầu xoay ngay khi ảnh vừa load xong, không cần chờ
            autostartOnIdle: true, // nếu người dùng kéo xem rồi ngừng thao tác, sẽ tự xoay lại
            autorotateSpeed: "0.7rpm", // tốc độ: 2 vòng/phút, di chuyển chậm rãi. Đổi thành số âm ví dụ "-2rpm" nếu muốn đảo chiều
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

    viewer.addEventListener("click", (e: any) => {
  const yawDeg = e.data.yaw * 180 / Math.PI;
  const pitchDeg = e.data.pitch * 180 / Math.PI;

  console.log("========== HOTSPOT ==========");
  console.log("yaw:", yawDeg);
  console.log("pitch:", pitchDeg);
  console.log("==============================");
});

    viewer.addEventListener("ready", () => {
      if (isCancelled) return; // tránh set state/marker khi component đã unmount (Strict Mode)
      viewerRef.current = viewer;
      renderMarkers(viewer, scene, onHotspotClick);
      applyHorizontalRange(viewer, scene);
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

  // Effect 2: khi scene thay đổi (người dùng bấm hotspot / đổi tầng) -> đổi ảnh mượt mà
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return; // Viewer chưa sẵn sàng (đang ở lần mount đầu) -> bỏ qua, Effect 1 đã set panorama ban đầu rồi

    // Ưu tiên entryYaw/entryPitch nếu bạn tự khai báo cho scene này;
    // không có thì mới tự tính điểm giữa horizontalRange (tránh bị kéo giật); không có nữa thì mặc định 0
    const entryPosition = getEntryPosition(scene);

    // QUAN TRỌNG: gỡ tạm giới hạn horizontalRange của scene CŨ trước khi đổi cảnh.
    // Vì transition mặc định có "rotation: true" (camera tự xoay sang góc mới trong lúc mờ dần ảnh),
    // nếu vẫn còn bị khóa theo phạm vi của scene cũ thì camera có thể bị kẹt lại giữa chừng,
    // không xoay hết được tới entryYaw của scene mới -> đây là nguyên nhân gây ra hiện tượng "lúc được lúc không".
    const visibleRangePlugin = viewer.getPlugin(VisibleRangePlugin) as VisibleRangePlugin;
    visibleRangePlugin?.setHorizontalRange(null);

    viewer
      .setPanorama(scene.imageUrl, {
        zoom: 0, // giữ nguyên mức zoom giới hạn khi chuyển sang scene mới
        position: { yaw: `${entryPosition.yaw}deg`, pitch: `${entryPosition.pitch}deg` },
        // Không cấu hình gì thêm -> dùng đúng hiệu ứng crossfade mượt mặc định của thư viện
      })
      .then(() => {
        renderMarkers(viewer, scene, onHotspotClick);
        // Chỉ khóa lại đúng phạm vi của scene MỚI sau khi camera đã ổn định đúng vị trí
        applyHorizontalRange(viewer, scene);
        // Đổi scene xong thì chủ động xoay lại luôn, không chờ autostartOnIdle kích hoạt
        const autorotatePlugin = viewer.getPlugin(AutorotatePlugin) as AutorotatePlugin;
        autorotatePlugin?.start();
      })
      .catch((err) => console.error("Lỗi khi đổi panorama:", err));
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

// Tính góc camera sẽ hướng tới khi mở 1 scene:
// 1) Ưu tiên entryYaw/entryPitch nếu bạn tự khai báo cho scene đó
// 2) Không có thì lấy điểm giữa horizontalRange (tránh bị VisibleRangePlugin kéo giật)
// 3) Không có gì cả thì mặc định 0, 0
function getEntryPosition(scene: Scene): { yaw: number; pitch: number } {
  const yaw =
    scene.entryYaw ??
    (scene.horizontalRange ? (scene.horizontalRange[0] + scene.horizontalRange[1]) / 2 : 0);
  const pitch = scene.entryPitch ?? 0;
  return { yaw, pitch };
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
  onHotspotClick: (targetSceneId: string) => void
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
    if (targetId) onHotspotClick(targetId);
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
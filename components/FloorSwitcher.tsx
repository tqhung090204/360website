"use client";

import { useRef, useState } from "react";
import { Building } from "../src/models/types";

interface Props {
  building: Building;
  currentFloorId: string | undefined;
  onSelectFloor: (floorId: string) => void;
}

export default function FloorSwitcher({ building, currentFloorId, onSelectFloor }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`floor-switcher-bar ${collapsed ? "floor-switcher-collapsed" : ""}`}>
      {/* Nút thu gọn / mở rộng, luôn nằm cố định bên trái */}
      <button
        className="floor-switcher-toggle"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Hiện danh sách tầng" : "Ẩn danh sách tầng"}
      >
        {collapsed ? "›" : "‹"}
      </button>

      {/* Phần nội dung sẽ co lại về 0 khi collapsed = true */}
      <div className="floor-switcher-content">
        <div className="floor-switcher-track" ref={scrollRef}>
          {building.floors.map((floor) => {
            const isActive = floor.id === currentFloorId;
            return (
              <button
                key={floor.id}
                className={`floor-item ${isActive ? "floor-item-active" : ""}`}
                onClick={() => onSelectFloor(floor.id)}
              >
                <span className="floor-thumb-wrap">
                  <img src={floor.thumbnail} alt={floor.name} className="floor-thumb" />
                </span>
                <span className="floor-label">{floor.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
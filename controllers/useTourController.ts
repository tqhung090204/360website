"use client";

import { useState, useCallback } from "react";
import { Building } from "../src/models/types";
import { findSceneById, findFloorById } from "./tourController";

export function useTourController(building: Building) {
  const [currentSceneId, setCurrentSceneId] = useState<string>(
    building.floors[0].defaultSceneId
  );

  const currentScene = findSceneById(building, currentSceneId);
  const currentFloor = currentScene
    ? findFloorById(building, currentScene.floorId)
    : undefined;

  // Được gọi khi người dùng bấm 1 hotspot trên ảnh 360
  const goToScene = useCallback((targetSceneId: string) => {
    setCurrentSceneId(targetSceneId);
  }, []);

  // Được gọi khi người dùng chọn tầng khác từ menu
  const goToFloor = useCallback(
    (floorId: string) => {
      const floor = findFloorById(building, floorId);
      if (floor) setCurrentSceneId(floor.defaultSceneId);
    },
    [building]
  );

  return {
    currentScene,
    currentFloor,
    building,
    goToScene,
    goToFloor,
  };
}
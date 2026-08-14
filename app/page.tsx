"use client";

import { myBuilding } from "../src/models/buildingData";
import { useTourController } from "../controllers/useTourController";
import PanoramaViewer from "../components/PanoramaViewer";
import FloorSwitcher from "../components/FloorSwitcher";
import CometCursor from "../src/components/CometCursor";

export default function Home() {
  const { currentScene, currentFloor, building, goToScene, goToFloor } =
    useTourController(myBuilding);

  if (!currentScene) return <div>Không tìm thấy scene</div>;

  return (
    <main style={{ position: "relative" }}>
      <CometCursor />
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10, background: "#ffffffcc", padding: "6px 12px", borderRadius: 8 }}>
        {currentFloor?.name} — {currentScene.name}
      </div>
      <PanoramaViewer scene={currentScene} onHotspotClick={goToScene} />
      <FloorSwitcher
        building={building}
        currentFloorId={currentFloor?.id}
        onSelectFloor={goToFloor}
      />
    </main>
  );
}
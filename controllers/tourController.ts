import { Building, Scene, Floor } from "../src/models/types";

export function findSceneById(building: Building, sceneId: string): Scene | undefined {
  for (const floor of building.floors) {
    const scene = floor.scenes.find((s) => s.id === sceneId);
    if (scene) return scene;
  }
  return undefined;
}

export function findFloorById(building: Building, floorId: string): Floor | undefined {
  return building.floors.find((f) => f.id === floorId);
}

export function getSceneUrl(scene: Scene): string {
  return scene.imageUrl;
}
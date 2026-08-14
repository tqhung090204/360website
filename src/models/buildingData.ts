import { Building } from "./types";

export const myBuilding: Building = {
  id: "toa-nha-cua-toi",
  name: "Tòa nhà của tôi",
  floors: [
    {
      id: "outdoor_0",
      name: "Ngoài trời",
      defaultSceneId: "outdoor_1",
      thumbnail: "/panoramas/outdoor/outdoor.jpg",
      scenes: [
        {
          id: "outdoor_1",
          floorId: "outdoor_0",
          name: "Ngoài trời",
          imageUrl: "/panoramas/outdoor/outdoor.jpg",
          horizontalRange: [189, 39],
          hotspots: [
            {
              id: "hs-1",
              yaw:  261.53924945260525,
              pitch: -26.265954540400337,
              targetSceneId: "tang0-sanh",
              label: "Vào ngoài sân",
              previewImage: "/panoramas/tang0/tang0.jpg",
              icon: "plus",
            },
            // ...
          ],
        },
        
        // ... thêm các phòng khác của outdoor
      ],
    },
    {
      id: "tang0",
      name: "Ngoài sân",
      defaultSceneId: "tang0-sanh",
      thumbnail: "/panoramas/tang0/tang0.jpg",
      scenes: [
        {
          // is180: true,
          id: "tang0-sanh",
          floorId: "tang0",
          name: "Ngoài sân",
          imageUrl: "/panoramas/tang0/tang0.jpg",
          horizontalRange: [326, 152],
          hotspots: [
            {
              id: "hs-2",
              yaw: 232,
              pitch: -8,
              targetSceneId: "outdoor_1",
              label: "Quay lại ngoài trời",
              previewImage: "/panoramas/outdoor/outdoor.jpg",
            },
            {
              id: "hs-3",
              yaw: 74,
              pitch: -15,
              targetSceneId: "tang1-sanh",
              label: "Tầng 1",
              previewImage: "/panoramas/tang1/tang1.jpg",
              icon: "plus",
            },
            //...
          ],
        },
        
        // ... thêm các phòng khác của tầng 0
      ],
    },
    {
      id: "tang1",
      name: "Tầng 1",
      defaultSceneId: "tang1-sanh",
      thumbnail: "/panoramas/tang1/tang1.jpg",
      scenes: [
        {
          id: "tang1-sanh",
          floorId: "tang1",
          name: "tầng 1",
          imageUrl: "/panoramas/tang1/tang1.jpg",
          horizontalRange: [183, 168],
          hotspots: [
            {
              id: "hs-4",
              yaw: 222,
              pitch: -7,
              targetSceneId: "tang1-phong-101",
              label: "Máy Pha cà phê",
              previewImage: "/panoramas/tang1/room101.jpg",
              icon: "plus",
            },
            {
              id: "hs-5",
              yaw: 273,
              pitch: 8,
              targetSceneId: "tang2-sanh",
              label: "lên tầng 2",
              previewImage: "/panoramas/tang2/tang2.jpg",
              icon: "arrow-up",
            },
            {
              id: "hs-6",
              yaw: 14,
              pitch: -8,
              targetSceneId: "tang0-sanh",
              label: "Quay lại ngoài sân",
              previewImage: "/panoramas/tang0/tang0.jpg",
              icon: "plus",
            },
            // ...
          ],
        },
        {
          id: "tang1-phong-101",
          floorId: "tang1",
          name: "Phòng 101",
          imageUrl: "/panoramas/tang1/room101.jpg",
          horizontalRange: [191, 132],
          hotspots: [
            {
              id: "hs-7",
              yaw: 60.47500187593354,
              pitch: -17,
              targetSceneId: "tang1-sanh",
              label: "Quay lại sảnh",
              previewImage: "/panoramas/tang1/tang1.jpg",
            },
          ],
        },
        // ... thêm các phòng khác của tầng 1
      ],
    },
    {
      id: "tang2",
      name: "Tầng 2",
      defaultSceneId: "tang2-sanh",
      thumbnail: "/panoramas/tang2/tang2.jpg",
      scenes: [
        {
          id: "tang2-sanh",
          floorId: "tang2",
          name: "tầng 2",
          imageUrl: "/panoramas/tang2/tang2.jpg",
          horizontalRange: [190, 159],
          hotspots: [
            {
              id: "hs-8",
              yaw: 109.43669005421746,
              pitch: -10,
              targetSceneId: "tang2-phong-201",
              label: "Phòng nhân viên",
              previewImage: "/panoramas/tang2/room201.jpg",
              icon: "plus",
            },
            {
              id: "hs-9",
              yaw: 218,
              pitch: 0,
              targetSceneId: "tang1-sanh",
              label: "xuống tầng 1",
              previewImage: "/panoramas/tang1/tang1.jpg",
              icon: "arrow-down",
            },
            {
              id: "hs-10",
              yaw: 218,
              pitch:19,
              targetSceneId: "tang3-sanh",
              label: "lên tầng 3",
              previewImage: "/panoramas/tang3/tang3.jpg",
              icon: "arrow-up",
            },
            // ...
          ],
        },
        {
          id: "tang2-phong-201",
          floorId: "tang2",
          name: "Phòng nhân viên",
          imageUrl: "/panoramas/tang2/room201.jpg",
          horizontalRange: [188, 171],
          hotspots: [
            {
              id: "hs-11",
              yaw: 194.65643753257257,
              pitch: 0,
              targetSceneId: "tang2-sanh",
              label: "Quay lại tầng 2",
              previewImage: "/panoramas/tang2/tang2.jpg",
            },
          ],
        },
        // ... thêm các phòng khác của tầng 1
      ],
    },
  {
  id: "tang3",
  name: "Tầng 3",
  defaultSceneId: "tang3-sanh",
  thumbnail: "/panoramas/tang3/tang3.jpg",
  scenes: [
    {
      id: "tang3-sanh",
      floorId: "tang3",
      name: "Sảnh tầng 3",
      imageUrl: "/panoramas/tang3/tang3.jpg",
      horizontalRange: [193, 177],
      hotspots: [
        {
          id: "hs-301-from-sanh",
          yaw: 91,
          pitch: -16,
          targetSceneId: "tang3-phong-301",
          label: "Phòng sếp ",
          previewImage: "/panoramas/tang3/room301.jpg",
          icon: "plus",
        },
        {
          id: "hs-303-from-sanh",
          yaw: 161,
          pitch: -6,
          targetSceneId: "tang3-phong-303",
          label: "Phòng họp",
          previewImage: "/panoramas/tang3/room303.jpg",
          icon: "plus",
        },
        {
          id: "hs-down-to-tang2",
          yaw: 220,
          pitch: -7,
          targetSceneId: "tang2-sanh",
          label: "Xuống tầng 2",
          previewImage: "/panoramas/tang2/tang2.jpg",
          icon: "arrow-down",
        },
        {
          id: "hs-sanh-to-tang4",
          yaw: 220,
          pitch: 14,
          targetSceneId: "tang4-sanh",
          label: "lên sảnh tầng 4",
          previewImage: "/panoramas/tang4/tang4.jpg",
          icon: "arrow-up",
        },
      ],
    },
    {
      id: "tang3-phong-301",
      floorId: "tang3",
      name: "Phòng sếp ",
      imageUrl: "/panoramas/tang3/room301.jpg",
      horizontalRange: [227, 212],
      hotspots: [
        {
          id: "hs-302-from-301",
          yaw: 94,
          pitch: -3,
          targetSceneId: "tang3-phong-302",
          label: "Sang phòng họp nhân viên",
          previewImage: "/panoramas/tang3/room302.jpg",
          icon: "plus",
        },
        {
          id: "hs-sanh-from-301",
          yaw: 205,
          pitch: -10,
          targetSceneId: "tang3-sanh",
          label: "Quay lại sảnh tầng 3",
          previewImage: "/panoramas/tang3/tang3.jpg",
          icon: "plus",
        },
      ],
    },
    {
      id: "tang3-phong-302",
      floorId: "tang3",
      name: "Phòng 302",
      imageUrl: "/panoramas/tang3/room302.jpg",
      horizontalRange: [187, 168],
      hotspots: [
        {
          id: "hs-301-from-302",
          yaw: 194,
          pitch: -7,
          targetSceneId: "tang3-phong-301",
          label: "Quay lại Phòng sếp (301)",
          previewImage: "/panoramas/tang3/room301.jpg",
          icon: "plus",
        },
      ],
    },
    {
      id: "tang3-phong-303",
      floorId: "tang3",
      name: "Phòng 303",
      imageUrl: "/panoramas/tang3/room303.jpg",
      horizontalRange: [184, 155],
      hotspots: [
        {
          id: "hs-sanh-from-303",
          yaw: 192,
          pitch: -11,
          targetSceneId: "tang3-sanh",
          label: "Quay lại sảnh tầng 3",
          previewImage: "/panoramas/tang3/tang3.jpg",
          icon: "plus",
        },
      ],
    },
  ],
},
{
  id: "tang4",
  name: "Tầng 4",
  defaultSceneId: "tang4-sanh",
  thumbnail: "/panoramas/tang4/tang4.jpg",
  scenes: [
    {
      id: "tang4-sanh",
      floorId: "tang4",
      name: "Sảnh tầng 4",
      imageUrl: "/panoramas/tang4/tang4.jpg",
      horizontalRange: [198, 134],
      hotspots: [
        {
          id: "hs-401-from-sanh",
          yaw: 350,
          pitch: -1,
          targetSceneId: "tang4-phong-401",
          label: "Phòng họp",
          previewImage: "/panoramas/tang4/room401.jpg",
          icon: "plus",
        },
        {
          id: "hs-down-to-tang3",
          yaw: 210,
          pitch: 0.0,
          targetSceneId: "tang3-sanh",
          label: "Xuống tầng 3",
          previewImage: "/panoramas/tang3/tang3.jpg",
          icon: "arrow-down",
        },
      ],
    },
    {
      id: "tang4-phong-401",
      floorId: "tang4",
      name: "Phòng họp",
      imageUrl: "/panoramas/tang4/room401.jpg",
      horizontalRange: [188, 171],
      hotspots: [
        {
          id: "hs-sanh-from-401",
          yaw: 198,
          pitch: -2,
          targetSceneId: "tang4-sanh",
          label: "Quay lại sảnh tầng 4",
          previewImage: "/panoramas/tang4/tang4.jpg",
          icon: "plus",
        },
      ],
    },
  ],
}
  ],
};
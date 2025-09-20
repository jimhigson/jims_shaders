import beastImg from "../../storybook-sample-media/beast.webp";
import amigaHohImg from "../../storybook-sample-media/head-over-heels-amiga-71.webp";
import metalSlugImg from "../../storybook-sample-media/metal-slug-neo-geo-09.webp";
import microMachinesImg from "../../storybook-sample-media/micro-machines-2-megadrive-genesis-11.png.webp";
import moonbaseImg from "../../storybook-sample-media/moonbase9.png";
import rickrollVideo from "../../storybook-sample-media/rickroll_short_43.mp4";
import sonicImg from "../../storybook-sample-media/sonic-the-hedgehog-megadrive-001.webp";
import speedballImg from "../../storybook-sample-media/speedball-2-brutal-deluxe-amiga-42.webp";
import testcardImg from "../../storybook-sample-media/Testcard_F.jpg";
import wipeoutImg from "../../storybook-sample-media/wipeout-2097-ps1-53.jpg.webp";
import yosiImg from "../../storybook-sample-media/yosi.webp";

export const exampleMedia = {
  moonbase: { src: moonbaseImg, type: "image", description: "Moonbase (C64)" },
  sonic: {
    src: sonicImg,
    type: "image",
    description: "Sonic the Hedgehog (Mega Drive)",
  },
  metalSlug: {
    src: metalSlugImg,
    type: "image",
    description: "Metal Slug (Neo Geo/Arcade)",
  },
  speedball: {
    src: speedballImg,
    type: "image",
    description: "Speedball 2 (Amiga)",
  },
  amigaHoh: {
    src: amigaHohImg,
    type: "image",
    description: "Head Over Heels (Amiga)",
  },
  testcard: { src: testcardImg, type: "image", description: "BBC Test Card F" },
  beast: {
    src: beastImg,
    type: "image",
    description: "Shadow of the Beast (Amiga)",
  },
  microMachines: {
    src: microMachinesImg,
    type: "image",
    description: "Micro Machines 2 (Mega Drive)",
  },
  wipeout: {
    src: wipeoutImg,
    type: "image",
    description: "Wipeout 2097 (PlayStation)",
  },
  yosi: { src: yosiImg, type: "image", description: "Yoshi's Island (SNES)" },
  rickroll: {
    src: rickrollVideo,
    type: "video",
    description: "Rick Astley - Never Gonna Give You Up",
  },
} as const;
export type ExampleMediaId = keyof typeof exampleMedia;

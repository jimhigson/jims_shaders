import moonbaseImg from "../../storybook-sample-media/moonbase9.png";
import sonicImg from "../../storybook-sample-media/sonic-the-hedgehog-megadrive-001.webp";
import metalSlugImg from "../../storybook-sample-media/metal-slug-neo-geo-09.webp";
import speedballImg from "../../storybook-sample-media/speedball-2-brutal-deluxe-amiga-42.webp";
import amigaHohImg from "../../storybook-sample-media/head-over-heels-amiga-71.webp";
import testcardImg from "../../storybook-sample-media/Testcard_F.jpg";
import rickrollVideo from "../../storybook-sample-media/rickroll_short_43.mp4";

export const exampleMedia = {
  moonbase: { src: moonbaseImg, type: "image" },
  sonic: { src: sonicImg, type: "image" },
  metalSlug: { src: metalSlugImg, type: "image" },
  speedball: { src: speedballImg, type: "image" },
  amigaHoh: { src: amigaHohImg, type: "image" },
  testcard: { src: testcardImg, type: "image" },
  rickroll: { src: rickrollVideo, type: "video" },
} as const;
export type ExampleMediaId = keyof typeof exampleMedia;

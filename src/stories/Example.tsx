import type { Filter } from "pixi.js";

import { useApplication } from "@pixi/react";
import { Assets, Graphics, Texture } from "pixi.js";
import { useEffect, useMemo, useState } from "react";

import type { CRTFiltersProps } from "./CRTFilters.stories";

import { exampleMedia } from "./exampleMedia";
import { useFilters } from "./hooks/useFilters";
import { useWindowSize } from "./hooks/useWindowSize";

interface ImageExampleProps {
  src: string;
  filters?: Filter[];
}

const ImageExample = ({ src, filters }: ImageExampleProps) => {
  const { app } = useApplication();
  const [texture, setTexture] = useState<null | Texture>(null);
  useWindowSize(); // Trigger re-render on window resize

  useEffect(() => {
    const loadImage = async () => {
      const imageTexture = await Assets.load(src);
      setTexture(imageTexture);
    };

    loadImage();
  }, [src]);

  if (!texture) return null;

  // Calculate scale to fit the canvas
  const scale = Math.min(
    app.screen.width / texture.width,
    app.screen.height / texture.height,
  );

  return (
    <pixiSprite
      texture={texture}
      anchor={0.5}
      scale={scale}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      filters={filters}
    />
  );
};

interface VideoExampleProps {
  src: string;
  filters?: Filter[];
}

const VideoExample = ({ src, filters }: VideoExampleProps) => {
  const { app } = useApplication();
  const [texture, setTexture] = useState<null | Texture>(null);
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
  useWindowSize(); // Trigger re-render on window resize

  useEffect(() => {
    const loadVideo = async () => {
      const video = document.createElement("video");
      video.src = src;
      video.loop = true;
      video.muted = true; // Many browsers require muted for autoplay
      video.autoplay = true;

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.addEventListener("canplay", resolve, { once: true });
      });

      video.play();

      // Create texture from video
      const videoTexture = Texture.from(video);
      setTexture(videoTexture);
      setDimensions({ width: video.videoWidth, height: video.videoHeight });
    };

    loadVideo();
  }, [src]);

  if (!texture) return null;

  // Calculate scale to fit the canvas
  const scale = Math.min(
    app.screen.width / dimensions.width,
    app.screen.height / dimensions.height,
  );

  return (
    <pixiSprite
      texture={texture}
      anchor={0.5}
      scale={scale}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      filters={filters}
    />
  );
};

interface ExampleProps extends CRTFiltersProps {
  splitPosition: number;
}

export const Example = (props: ExampleProps) => {
  const { app } = useApplication();
  const { imageSource, splitPosition } = props;
  const resource = exampleMedia[imageSource];
  const filters = useFilters(props);
  useWindowSize(); // Re-render on resize to update mask

  const ExampleComponent =
    resource.type === "video" ? VideoExample : ImageExample;

  const graphics = useMemo(() => {
    return new Graphics()
      .rect(
        splitPosition,
        0,
        app.screen.width - splitPosition,
        app.screen.height,
      )
      .fill("#ffffff");
  }, [splitPosition, app.screen.width, app.screen.height]);

  return (
    <pixiContainer>
      <ExampleComponent src={resource.src} />
      <pixiContainer mask={graphics}>
        <ExampleComponent src={resource.src} filters={filters} />
      </pixiContainer>
    </pixiContainer>
  );
};

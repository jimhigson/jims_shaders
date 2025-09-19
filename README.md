# Jim's Shaders

A collection of modular filters for Pixi.js, targeted at pixi v8+, written in GLSL. Each one is designed to do one very small job well, and to be composed with other shaders. Use all of them, or some of them. Don't like one? drop and replace it. Mix them with other filters as you wish.

Originally created for my Head over Heels remake [at blockstack.ing](https://blockstack.ing) [github](https://github.com/jimhigson/head-over-heels-online).

📺 **[Live Demo on GitHub Pages](https://jimhigson.github.io/jims_crt_shaders/)**  
🎮 **[See it in action in my Head Over Heels remake](https://blockstack.ing)**

## Using with pixi.js

Apply filters directly to any DisplayObject:

```ts
import {
  ScanlinesFilter,
  PhosphorMaskFilter,
  BloomFilter,
  createCrtFilterPipeline
} from '@blockstacking/jims-shaders';
import { Application, Container } from 'pixi.js';

const app = new Application();
const container = new Container();

// Option 1: Use individual filters
container.filters = [
  new ScanlinesFilter({ pixelHeight: 4, gapBrightness: 0.3 }),
  new PhosphorMaskFilter({ pixelWidth: 4.5, maskBrightness: 0.3 }),
  new BloomFilter({ intensity: 0.5, radius: 6.5 })
];

// Option 2: Use the convenient pipeline creator
container.filters = createCrtFilterPipeline({
  scanlines: { pixelHeight: 4, gapBrightness: 0.3 },
  phosphorMask: { pixelWidth: 4.5, maskBrightness: 0.3 },
  bloom: { intensity: 0.5, radius: 6.5 },
  curvature: { curvatureX: 0.35, curvatureY: 0.35 }
});
```

## Using with @pixi.js/react

Use filters with React components in @pixi/react:

```tsx
import { Stage, Container, Sprite } from '@pixi/react';
import { useMemo } from 'react';
import {
  ScanlinesFilter,
  PhosphorMaskFilter,
  createCrtFilterPipeline
} from '@blockstacking/jims-shaders';

function CRTDisplay() {
  const filters = useMemo(() => [
    new ScanlinesFilter({ pixelHeight: 4, gapBrightness: 0.3 }),
    new PhosphorMaskFilter({ pixelWidth: 4.5, maskBrightness: 0.3 })
  ], []);

  return (
    <Stage width={800} height={600}>
      <Container filters={filters}>
        <Sprite image="game.png" />
      </Container>
    </Stage>
  );
}

// Or use the pipeline for convenience
function CRTDisplayWithPipeline() {
  const filters = useMemo(() =>
    createCrtFilterPipeline({
      scanlines: { pixelHeight: 4, gapBrightness: 0.3 },
      phosphorMask: { pixelWidth: 4.5, maskBrightness: 0.3 },
      bloom: { intensity: 0.5, radius: 6.5 }
    }), []
  );

  return (
    <Stage width={800} height={600}>
      <Container filters={filters}>
        <Sprite image="game.png" />
      </Container>
    </Stage>
  );
}
```

## Using outside of pixi.js

The GLSL fragment shaders are importable directly like this:

```ts
import {
  phosphorMaskFragmentSource,
  replacePlaceholders
} from '@blockstacking/jims-shaders';

// Some shaders have placeholders like {{NUM_SAMPLES}} that need replacing
const processedShader = replacePlaceholders(phosphorMaskFragmentSource, {
  NUM_SAMPLES: 4  // Set antialiasing samples
});

// The processed shader is ready for WebGL
const shader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(shader, processedShader);
gl.compileShader(shader);
```

## CRT Filters

Modular filters

These filters are designed to be used together to recreate the authentic look of CRT displays.

### Visual Examples

#### Complete CRT Effect
![CRT effect applied to game](examples/Screenshot%202025-09-17%20at%2022.28.04.png)
*All filters combined for a complete CRT look*

#### Scanlines
![Scanlines effect](examples/sonic_scanlines.png)
*Horizontal scanlines with adjustable intensity*

![Scanlines zoomed](examples/sonic_scanlines_zoomed.png)
*Close-up showing scanline detail*

#### Phosphor Mask
![Phosphor mask effect](examples/sonic_slot_mask.png)
*RGB phosphor slot mask pattern*

![Phosphor mask extreme close-up](examples/sonic_slot_mask_extreme.png)
*Extreme close-up showing individual RGB phosphor strips*

### Filter Descriptions

### Bloom Filter
Adds a soft glow effect with configurable intensity and radius using a two-ring sampling pattern.

### Color Adjustment Filter
Fine-tune gamma, saturation, and brightness for authentic retro colour reproduction.

### Curvature Filter
Warps the display to simulate a curved CRT screen with optional multisampling for smoother edges.

### Phosphor Mask Filter
Emulates the RGB phosphor dot pattern of CRT displays.

### Rounded Corners Filter
Clips the display corners to simulate the rounded edges of old CRT monitors.

### Scanlines Filter
Draws horizontal scanlines with adjustable intensity and spacing.

### Vignette Filter
Darkens or brightens the edges of the screen with smooth falloff.

## Installation

```bash
npm install @blockstacking/jims-shaders
```

## Usage

```typescript
import { 
  BloomFilter, 
  CurvatureFilter, 
  ScanlinesFilter,
  VignetteFilter 
} from '@blockstacking/jims-shaders';
import { Container, Application } from 'pixi.js';

const app = new Application();
const container = new Container();

// Apply filters for classic CRT look
container.filters = [
  new CurvatureFilter({ curvatureX: 0.02, curvatureY: 0.02 }),
  new BloomFilter({ intensity: 0.5, radius: 4 }),
  new ScanlinesFilter({ pixelHeight: 4, gapBrightness: 0.7 }),
  new VignetteFilter({ intensity: 0.3, radius: 0.8 })
];
```

## Development

```bash
# Install dependencies
pnpm install

# Run Storybook for development
pnpm storybook

# Build library
pnpm build

# Build and preview Storybook
pnpm build-storybook
pnpm preview-storybook
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.
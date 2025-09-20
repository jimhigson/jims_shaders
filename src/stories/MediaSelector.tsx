import type { ExampleMediaId } from "./exampleMedia";

import { exampleMedia } from "./exampleMedia";

interface MediaSelectorProps {
  value: ExampleMediaId;
  onChange: (value: ExampleMediaId) => void;
}

export const MediaSelector = ({ value, onChange }: MediaSelectorProps) => {
  return (
    <div className="flex flex-col gap-2 p-2.5 bg-background-content border-b border-border overflow-x-auto absolute top-0 left-0 z-media-selector max-h-full">
      {Object.entries(exampleMedia).map(([key, media]) => (
        <button
          key={key}
          onClick={() => onChange(key as ExampleMediaId)}
          className={`
            p-1 rounded border-2 cursor-pointer
            flex flex-col items-center gap-1
            ${
              value === key ?
                "border-blue-light bg-blue-light/10"
              : "border-border bg-background"
            }
          `}
        >
          {media.type === "image" ?
            <img
              src={media.src}
              alt={key}
              className="w-20 h-[60px] object-cover rounded-sm"
            />
          : <div className="w-20 h-[60px] bg-background-bar rounded-sm flex items-center justify-center text-2xl">
              ▶️
            </div>
          }
          <span className="text-[11px] text-text">{key}</span>
        </button>
      ))}
    </div>
  );
};

import { useEffect, useRef, useState } from "react";

interface DraggableSplitterProps {
  onPositionChange: (position: number) => void;
  initialPosition?: number;
  width?: number;
  hitAreaWidth?: number;
}

/**
 * A draggable vertical split on the page, separating visually a left from right pane
 * (with and without filters)
 */
export const DraggableSplitter = ({
  onPositionChange,
  initialPosition = 0,
  width = 8,
  hitAreaWidth = 40,
}: DraggableSplitterProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const parent = containerRef.current.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      const centerX = parentRect.left + parentRect.width / 2;
      const newPosition = e.clientX - centerX;
      setPosition(newPosition);
      onPositionChange(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onPositionChange]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 h-full cursor-col-resize z-splitter flex items-center justify-center"
      style={{
        left: "50%",
        transform: `translateX(${position - hitAreaWidth / 2}px)`,
        width: hitAreaWidth,
      }}
      onMouseDown={() => setIsDragging(true)}
    >
      <div
        className={`h-full ${isDragging ? "bg-blue" : "bg-white"}`}
        style={{
          width,
        }}
      />
    </div>
  );
};

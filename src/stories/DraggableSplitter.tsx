import { useEffect, useRef, useState } from "react";

interface DraggableSplitterProps {
  onPositionChange: (position: number) => void;
  initialPosition?: number;
  width?: number;
  hitAreaWidth?: number;
}

export const DraggableSplitter = ({
  onPositionChange,
  initialPosition,
  width = 8,
  hitAreaWidth = 40,
}: DraggableSplitterProps) => {
  const [position, setPosition] = useState(
    initialPosition ?? window.innerWidth / 2,
  );
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newPosition = e.clientX;
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
      className="fixed top-0 h-screen cursor-col-resize z-splitter flex items-center justify-center"
      style={{
        left: position - hitAreaWidth / 2,
        width: hitAreaWidth,
      }}
      onMouseDown={() => setIsDragging(true)}
    >
      <div
        className={`h-full ${
          isDragging ? "bg-blue" : "bg-black transition-colors duration-200"
        }`}
        style={{
          width: width,
        }}
      />
    </div>
  );
};

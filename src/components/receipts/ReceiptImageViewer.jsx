"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ReceiptImageViewer({ imageUrl }) {
  const [scale, setScale] = useState(1);
  const [cursor, setCursor] = useState("default");
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (containerRef.current && imgRef.current) {
      const container = containerRef.current;
      const img = imgRef.current;

      const containerWidth = container.clientWidth;
      const imgWidth = img.naturalWidth;

      if (imgWidth > 0) {
        const initialScale = containerWidth / imgWidth;
        setScale(initialScale);

        setTimeout(() => {
          container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
          container.scrollTop = 0; // 👍 Tu avais modifié ici
        }, 50);
      }
    }
  }, [imageUrl]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 4));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.25));
  const reset = () => {
    if (containerRef.current && imgRef.current) {
      const container = containerRef.current;
      const img = imgRef.current;
      const containerWidth = container.clientWidth;
      const imgWidth = img.naturalWidth;
      if (imgWidth > 0) {
        const initialScale = containerWidth / imgWidth;
        setScale(initialScale);
        setTimeout(() => {
          container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
          container.scrollTop = 0;
        }, 50);
      }
    }
  };

  const handleMouseDown = (e) => {
    const container = containerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    setCursor("grabbing");

    const startX = e.pageX - container.offsetLeft;
    const startY = e.pageY - container.offsetTop;
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const x = e.pageX - container.offsetLeft;
      const y = e.pageY - container.offsetTop;
      container.scrollLeft = scrollLeft - (x - startX);
      container.scrollTop = scrollTop - (y - startY);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setCursor("grab");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseUp);
  };

  if (!imageUrl) return null;

  return (
    <div className="w-[300px] h-screen border-l bg-background flex flex-col">
      <div className="p-2 flex justify-center items-center gap-2 border-b text-xs">
        <Button variant="ghost" size="sm" onClick={zoomIn}>Zoom +</Button>
        <Button variant="ghost" size="sm" onClick={zoomOut}>Zoom -</Button>
        <Button variant="ghost" size="sm" onClick={reset}>Reset</Button>
      </div>

      <div
        className="flex-1 overflow-auto p-2"
        ref={containerRef}
        style={{ cursor }}
        onMouseDown={handleMouseDown}
        onDoubleClick={reset}
      >
        <div
          className="w-max mx-auto"
          style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Reçu"
            className="rounded shadow"
            draggable={false}
            style={{ cursor: "grab" }}
          />
        </div>
      </div>
    </div>
  );
}

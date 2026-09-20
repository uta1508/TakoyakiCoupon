"use client";

import { useState, useRef, useEffect } from "react";

const videos = [
  "/movie/takoyaki_1.mp4",
  "/movie/takoyaki_2.mp4",
  "/movie/takoyaki_3.mp4",
];

export function HeroVideoBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.currentTime = 0;
          video.play().catch(e => console.log("Autoplay prevented", e));
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#111]">
      {videos.map((src, index) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          src={src}
          muted
          playsInline
          onEnded={() => {
            if (index === currentIndex) {
              setCurrentIndex((prev) => (prev + 1) % videos.length);
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* 50% black overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
  );
}

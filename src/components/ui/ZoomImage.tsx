'use client'

import { useRef, useState } from 'react'

interface ZoomImageProps {
  src: string
  alt: string
  zoomScale?: number
}

export default function ZoomImage({ src, alt, zoomScale = 2.2 }: ZoomImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    setPos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    })
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative cursor-crosshair w-full h-full"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 ease-out"
        style={{
          transformOrigin: `${pos.x}% ${pos.y}%`,
          transform: hovered ? `scale(${zoomScale})` : 'scale(1)',
        }}
      />
    </div>
  )
}

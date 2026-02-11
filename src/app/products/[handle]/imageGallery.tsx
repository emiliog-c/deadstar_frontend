'use client'

import { useRef } from "react";
import ImageGallery from "react-image-gallery";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";

type Props = { images: GalleryItem[] }

export default function ImageGalleryClient({ images }: Props) {
  const galleryRef = useRef<ImageGalleryRef>(null)

  return (
    <ImageGallery
        ref={galleryRef}
        items={images}
        onSlide={(index) => console.log("Slid to", index)}
        showPlayButton={false}
        showFullscreenButton={false}
        
    />
  )
}
"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { isAllowedImageUrl, isLocalImagePath } from "@/lib/imageHosts";

const PLACEHOLDER = "/recipe-placeholder.svg";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string | null | undefined;
  fallbackSrc?: string;
};

function resolveSrc(
  src: string | null | undefined,
  fallbackSrc: string,
): string {
  if (src && isAllowedImageUrl(src)) return src.trim();
  return fallbackSrc;
}

/**
 * next/image wrapper that rejects non-whitelisted hosts and falls back
 * to a local placeholder instead of crashing the page.
 */
export function SafeImage({
  src,
  fallbackSrc = PLACEHOLDER,
  alt,
  ...rest
}: SafeImageProps) {
  const [current, setCurrent] = useState(() => resolveSrc(src, fallbackSrc));

  useEffect(() => {
    setCurrent(resolveSrc(src, fallbackSrc));
  }, [src, fallbackSrc]);

  const displaySrc = isAllowedImageUrl(current) ? current : fallbackSrc;
  const isSvg =
    displaySrc.endsWith(".svg") || isLocalImagePath(displaySrc);

  return (
    <Image
      {...rest}
      key={displaySrc}
      src={displaySrc}
      alt={alt}
      unoptimized={Boolean(rest.unoptimized) || isSvg}
      onError={() => {
        if (displaySrc !== fallbackSrc) setCurrent(fallbackSrc);
      }}
    />
  );
}

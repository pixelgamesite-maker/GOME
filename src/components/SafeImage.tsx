import { useState } from "react";

export function SafeImage({
  src,
  alt,
  style,
  fallback,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}) {
  const [err, setErr] = useState(false);
  if (err && fallback) return <>{fallback}</>;
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setErr(true)}
    />
  );
}

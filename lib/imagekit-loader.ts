// Every local photo is scaled by ImageKit to the size it is shown at (docs/rules/icons-images.md).
const ENDPOINT = "https://ik.imagekit.io/icons8/ilbuco"

export default function imagekitLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/") || src.startsWith("/icons/") || /\.(svg|gif)$/i.test(src)) return src
  return `${ENDPOINT}${encodeURI(src)}?tr=w-${width},q-${quality || 75}`
}

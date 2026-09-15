import sharp from "sharp";

/** Decode the full image, discard metadata and bound the stored dimensions. */
export async function optimizeContentImage(file: File): Promise<Buffer> {
  return sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40_000_000, failOn: "warning" })
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
}

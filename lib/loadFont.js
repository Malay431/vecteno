import fs from "fs";
import path from "path";

export function getFontBuffer() {
  const fontPath = path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf");

  if (!fs.existsSync(fontPath)) {
    console.error("🚫 Font file not found at:", fontPath);
    throw new Error("Roboto-Regular.ttf not found");
  }

  return fs.readFileSync(fontPath);
}

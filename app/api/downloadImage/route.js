// app/api/downloadImage/route.js
import { NextResponse } from "next/server";
import archiver from "archiver";
import axios from "axios";
import stream from "stream";
import path from "path";

export async function POST(req) {
  try {
    const { imageUrl, title } = await req.json();

    if (!imageUrl || !title) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Extract file extension from imageUrl
    const extension = path.extname(new URL(imageUrl).pathname) || ".asset";

    // Fetch image stream
    const response = await axios.get(imageUrl, { responseType: "stream" });

    const passthrough = new stream.PassThrough();
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(passthrough);

    // Add main asset to zip with correct extension
    archive.append(response.data, { name: `${title}${extension}` });

    // Add license file
    const licenseText = `Thank you for downloading "${title}" from vecteno.com.

This asset is licensed under our standard user license.
Usage allowed for:
- Personal projects
- Commercial use under your vecteno plan

Unauthorized redistribution or resale is strictly prohibited.

Visit vecteno.com/license for details.
`;
    archive.append(licenseText, { name: "LICENSE.txt" });

    await archive.finalize();

    return new NextResponse(passthrough, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${title}.zip"`,
      },
    });
  } catch (err) {
    console.error("📦 ZIP Download Error:", err);
    return NextResponse.json({ error: "Failed to generate ZIP" }, { status: 500 });
  }
}

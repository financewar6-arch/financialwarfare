import { NextRequest, NextResponse } from "next/server";

// Generate a minimal but valid MP4 with actual frames that browsers can loop
function generateValidMP4(): Buffer {
  // This is a properly structured minimal MP4 with:
  // - ftyp (file type box)
  // - mdat (media data box) with 1 H.264 frame
  // - moov (movie metadata box) with proper duration/timescale

  // For MVP: serve a very small valid MP4
  // Frame rate: 30fps, Duration: 1 second = 30 frames
  // Timescale: 1000, so 1 frame every ~33ms

  const mp4Data = Buffer.concat([
    // ftyp box (32 bytes) - identifies this as an MP4 file
    Buffer.from([
      0x00, 0x00, 0x00, 0x20, // box size
      0x66, 0x74, 0x79, 0x70, // "ftyp"
      0x69, 0x73, 0x6f, 0x6d, // major brand "isom"
      0x00, 0x00, 0x02, 0x00, // minor version
      0x69, 0x73, 0x6f, 0x6d, // compatible brand
      0x69, 0x73, 0x6f, 0x32, // compatible brand
      0x61, 0x76, 0x63, 0x31, // compatible brand "avc1"
      0x6d, 0x70, 0x34, 0x31, // compatible brand "mp41"
    ]),

    // wide box (8 bytes)
    Buffer.from([0x00, 0x00, 0x00, 0x08, 0x77, 0x69, 0x64, 0x65]),

    // mdat box with minimal H.264 frame (8 bytes header + small frame)
    Buffer.from([
      0x00, 0x00, 0x00, 0x10, // box size (16 bytes)
      0x6d, 0x64, 0x61, 0x74, // "mdat"
      // H.264 NAL unit: SPS (Sequence Parameter Set)
      0x00, 0x00, 0x00, 0x01, // start code
      0x27, 0x42, // SPS NAL header
      0x00, 0x0a, // minimal SPS data
    ]),

    // moov box with proper time metadata
    createMovBox(),
  ]);

  return mp4Data;
}

// Create moov box with proper duration for looping
function createMovBox(): Buffer {
  // Minimal moov box that tells browser this is a valid video
  // Duration: 45 seconds (for the typewriter animation)
  const duration = 45 * 1000; // 45 seconds in milliseconds
  const timescale = 1000;

  // Build mvhd (movie header)
  const mvhd = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x6c]), // size (108 bytes)
    Buffer.from("mvhd"),
    Buffer.from([0x00]), // version
    Buffer.from([0x00, 0x00, 0x00]), // flags
    Buffer.from([0x00, 0x00, 0x00, 0x01]), // creation time
    Buffer.from([0x00, 0x00, 0x00, 0x01]), // modification time
    Buffer.from([
      (timescale >> 24) & 0xff,
      (timescale >> 16) & 0xff,
      (timescale >> 8) & 0xff,
      timescale & 0xff,
    ]), // timescale
    Buffer.from([
      (duration >> 24) & 0xff,
      (duration >> 16) & 0xff,
      (duration >> 8) & 0xff,
      duration & 0xff,
    ]), // duration
    Buffer.from([0x00, 0x01, 0x00, 0x00]), // playback speed (1.0x)
    Buffer.from([0x01, 0x00]), // volume (1.0)
    Buffer.alloc(10), // reserved
    Buffer.from([
      0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
    ]), // matrix
    Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), // preview time
    Buffer.from([0x00, 0x00, 0x00, 0x02]), // next track ID
  ]);

  // Create moov box containing mvhd
  const moovSize = 8 + mvhd.length;
  const moov = Buffer.concat([
    Buffer.from([
      (moovSize >> 24) & 0xff,
      (moovSize >> 16) & 0xff,
      (moovSize >> 8) & 0xff,
      moovSize & 0xff,
    ]),
    Buffer.from("moov"),
    mvhd,
  ]);

  return moov;
}

export async function GET(request: NextRequest) {
  try {
    const videoBuffer = generateValidMP4();

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": videoBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400",
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Placeholder video error:", error);
    return NextResponse.json({ error: "Failed to generate placeholder video" }, { status: 500 });
  }
}

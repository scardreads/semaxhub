import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const xml = '<?xml version=\'1.0\' encoding=\'us-ascii\'?>\n\n<!--  A SAMPLE set of slides  -->\n\n<slideshow \n    title="Sample Slide Show"\n    date="Date of publication"\n    author="Yours Truly"\n    >\n\n    <!-- TITLE SLIDE -->\n    <slide type="all">\n      <title>Wake up to WonderWidgets!</title>\n    </slide>\n\n    <!-- OVERVIEW -->\n    <slide type="all">\n        <title>Overview</title>\n        <item>Why <em>WonderWidgets</em> are great</item>\n        <item/>\n        <item>Who <em>buys</em> WonderWidgets</item>\n    </slide>\n\n</slideshow>';

export function GET() {
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Length": String(Buffer.byteLength(xml, "utf8")),
    },
  });
}

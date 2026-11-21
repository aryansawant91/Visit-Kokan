import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Arbitrary custom token minting is disabled to prevent account takeover
  return NextResponse.json(
    { error: "Endpoint disabled for security reasons" },
    { status: 403 }
  );
}

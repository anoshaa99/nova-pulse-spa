import { NextResponse } from "next/server";
import { chat } from "@/lib/chat";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await chat(body.messages);

    if (!result.success) {
      const status = result.error?.includes("not configured") ? 503 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

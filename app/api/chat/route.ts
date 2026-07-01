import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { RESUME_CONTEXT } from "@/app/lib/resume";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Ishu Singh's professional assistant on his portfolio website. Answer questions about Ishu's background, experience, skills, and services using his resume below.

Guidelines:
- Be concise — 2-3 sentences max unless more detail is clearly needed
- If someone asks about booking a call or working with Ishu, mention https://topmate.io/ishu_singh
- If asked something not in the resume, say you're not sure and suggest reaching out directly
- Speak about Ishu in third person ("Ishu has...", "He specialises in...")
- Never make up information not in the resume

${RESUME_CONTEXT}`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }
}

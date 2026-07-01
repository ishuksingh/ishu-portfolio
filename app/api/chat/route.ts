import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { RESUME_CONTEXT } from "@/app/lib/resume";
import { searchCaseStudies, formatCaseStudyForContext } from "@/app/lib/caseStudies";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Ishu Singh's professional assistant on his portfolio website. Answer questions about Ishu's background, experience, skills, services, and case studies using the resume below and the search_case_studies tool.

Guidelines:
- Be concise — 2-3 sentences max unless more detail is clearly needed
- If someone asks about booking a call or working with Ishu, mention https://topmate.io/ishu_singh
- If asked something not in the resume or case studies, say you're not sure and suggest reaching out directly
- Speak about Ishu in third person ("Ishu has...", "He specialises in...")
- Never make up information not in the resume or case studies
- When asked about projects, integrations, or specific technical work, use the search_case_studies tool to retrieve relevant details

${RESUME_CONTEXT}`;

const tools: Anthropic.Tool[] = [
  {
    name: "search_case_studies",
    description:
      "Search Ishu's case studies for details about specific integration projects, technical implementations, or work examples. Use this when the user asks about projects, specific integrations, how something was built, or wants examples of Ishu's work.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Search query describing what the user wants to know about, e.g. 'order sync salesforce netsuite' or 'API credit calculation' or 'free trial order creation'",
        },
      },
      required: ["query"],
    },
  },
];

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    // Handle tool use
    if (response.stop_reason === "tool_use") {
      const toolUseBlock = response.content.find((b) => b.type === "tool_use");
      if (toolUseBlock && toolUseBlock.type === "tool_use" && toolUseBlock.name === "search_case_studies") {
        const { query } = toolUseBlock.input as { query: string };
        const results = searchCaseStudies(query);
        const toolResult =
          results.length > 0
            ? results.map(formatCaseStudyForContext).join("\n\n---\n\n")
            : "No matching case studies found.";

        // Send tool result back and get final response
        const finalResponse = await client.messages.create({
          model: "claude-haiku-4-5",
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          tools,
          messages: [
            ...messages,
            { role: "assistant", content: response.content },
            {
              role: "user",
              content: [
                {
                  type: "tool_result",
                  tool_use_id: toolUseBlock.id,
                  content: toolResult,
                },
              ],
            },
          ],
        });

        const text =
          finalResponse.content[0].type === "text"
            ? finalResponse.content[0].text
            : "";
        return NextResponse.json({ text });
      }
    }

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }
}

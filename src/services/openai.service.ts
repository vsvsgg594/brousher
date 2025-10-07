import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface OpenAIOptions {
  prompt: string;
  format?: "json" | "text";
  model?: string;
}
export async function runOpenAI({ prompt, format = "text", model = "gpt-3.5-turbo" }: OpenAIOptions) {
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    ...(format === "json" ? { response_format: { type: "json_object" } } : {}),
  });
  const content = response.choices[0].message.content;
  if (format === "json" && content) return JSON.parse(content);
  return content;
}

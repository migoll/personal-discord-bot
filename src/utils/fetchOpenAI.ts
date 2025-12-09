import fetch from "node-fetch";

export interface OpenAIResponse {
  output?: Array<{
    type: string;
    content?: Array<{
      text?: string;
    }>;
  }>;
}

export interface OpenAIRequestOptions {
  model: string;
  input: string;
  max_output_tokens: number;
  text: {
    verbosity: string;
    format: {
      type: string;
    };
  };
}

export async function fetchOpenAI(
  options: OpenAIRequestOptions
): Promise<OpenAIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(options),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as OpenAIResponse;
}


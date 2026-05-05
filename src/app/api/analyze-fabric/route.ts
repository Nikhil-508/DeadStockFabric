import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const prompt = `
      You are a textile expert for a premium deadstock fabric marketplace.
      Analyze this image of fabric.
      Identify:
      1. Fabric type (e.g., Selvedge Denim, Organic Cotton, Mulberry Silk, European Linen, Brushed Twill, Wool Flannel). Be specific and premium.
      2. Dominant color (e.g., Indigo, Sage, Cream, Midnight, Terracotta).
      3. A HEX code that closely matches the dominant color.
      4. A suggested premium listing name for the marketplace.

      Return ONLY a JSON object with these keys:
      {
        "fabricType": "string",
        "color": "string",
        "colorHex": "string",
        "suggestedName": "string"
      }
    `;

    // Define models to try
    const models = ["google/gemini-flash-1.5", "openai/gpt-4o-mini", "meta-llama/llama-3.2-11b-vision-instruct:free"];

    let lastError = null;
    let analysis = null;

    for (const model of models) {
      try {
        console.log(`Attempting AI analysis with model: ${model}`);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Deadstock Exchange",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  {
                    type: "image_url",
                    image_url: {
                      url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                    },
                  },
                ],
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Model ${model} failed:`, errorData.error?.message || "Unknown error");
          continue;
        }

        const data = await response.json();
        const text = data.choices[0].message.content;

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
          console.log(`Successfully analyzed with model: ${model}`);
          break; // Success!
        }
      } catch (err: any) {
        lastError = err;
        console.error(`Error with model ${model}:`, err.message);
      }
    }

    if (!analysis) {
      throw new Error(lastError?.message || "All AI models failed to analyze the image.");
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image", details: error.message },
      { status: 500 }
    );
  }
}

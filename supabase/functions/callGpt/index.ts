// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
// import { GoogleGenerativeAi } from "https://esm.sh/@google/generative-ai"

import { GoogleGenerativeAI } from "npm:@google/generative-ai";

console.log("Hello from Functions!");

const apiKey = "AIzaSyDwa4KyRor7GI1EWMk1Pb8mH0xl1TQImak";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const prompt =
  "Create a 7-day workout plan for a 25-year-old male named Ashish, who lives in Melbourne. Ashish’s goal is to gain 10 kg of weight, focusing on muscle mass. He is a beginner in weight training but has a basic level of fitness. The plan should include a mix of strength training and compound exercises, targeting different muscle groups. Additionally, provide guidance on rest and recovery, and include any specific nutritional tips to support his goal of healthy weight gain. Include details on sets, reps, and progression over time ";

async function callGpt() {
  console.log("call GPT called by Ashish");
  // const image = {

  //   inlineData: {
  //     data: Buffer.from(fs.readFileSync("cookie.png")).toString("base64"),
  //     mimeType: "image/png",
  //   },
  // };

  // const result = await model.generateContentStream([prompt]);
  const result = await model.generateContentStream(prompt);

  // Print text as it comes in.
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    console.log(chunkText);
  }
}

Deno.serve(async (req) => {
  const { name } = await req.json();
  const data = {
    message: `Hello ${name}!`,
  };
  await callGpt();

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/callGpt' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
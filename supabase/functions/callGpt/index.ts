// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { Readable } from "https://esm.sh/v135/openai@4.53.2/_shims/auto/types.d.ts";
import { _decodeChunks } from "https://esm.sh/v135/openai@4.53.2/streaming.js";
// import { GoogleGenerativeAi } from "https://esm.sh/@google/generative-ai"

import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import type { ErrorEntity } from "../../entities/error_entity.ts";
import { delay } from "../../utils/delay_utils.ts";

console.log("Hello from Functions!");

const apiKey = "AIzaSyDwa4KyRor7GI1EWMk1Pb8mH0xl1TQImak";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });

const prompt =
  "Create a 7-day workout plan for a 25-year-old male named Ashish, who lives in Melbourne. Ashish’s goal is to gain 10 kg of weight, focusing on muscle mass. He is a beginner in weight training but has a basic level of fitness. The plan should include a mix of strength training and compound exercises, targeting different muscle groups. Additionally, provide guidance on rest and recovery, and include any specific nutritional tips to support his goal of healthy weight gain. Include details on sets, reps, and progression over time ";

// const prompt = "Where is mount everest";

async function callGpt() {
  console.log("call GPT called by Ashish");

  try {
    const result = await model.generateContentStream(prompt);

    console.log(`"The response is ${result.stream}`);

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            console.log(`is stream completed ${result.stream.next()}`);
            const text = chunk.text();

            // console.log(`${chunk.text()}`);

            await controller.enqueue(new TextEncoder().encode(text));
          }
          await delay(1000);
          controller.close();
        } catch (error) {
          console.log(`The ERROR is ${error}`);
          controller.error(error);
        }
      },
      cancel() {
        console.log("Stream cancelled");
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("INSTANCE OF ERROR");
      console.log(`ERROR OCCURED ${error}`);
      return new Response(error.message, { status: 429 });
    } else {
      const errorAsObject = JSON.parse(error as string);
      const errorEntity: ErrorEntity = {
        message: errorAsObject["statusText"],
        status: errorAsObject["status"],
      };

      console.log(`ERROR HITTING THE GPT is ${error}`);
      return new Response(JSON.stringify(errorEntity), { status: 429 });
    }
  }
}

Deno.serve((_) => {
  return callGpt();
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/callGpt' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

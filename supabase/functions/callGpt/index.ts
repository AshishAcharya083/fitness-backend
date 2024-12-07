// Setup type definitions for built-in Supabase Runtime APIs
// import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
// import { Readable } from "https://esm.sh/v135/openai@4.53.2/_shims/auto/types.d.ts";
import { _decodeChunks } from "https://esm.sh/v135/openai@4.53.2/streaming.js";
import type { ErrorEntity } from "../../entities/error_entity.ts";
import model from "./gemini/model_config.ts";
import getSupabaseClient from "./data/supabase_client.ts";
import UserRepository from "./data/user_repository.ts";
import getTokenFromRequest from "../utils.ts";

console.log("Hello from Functions!");

const formatString: string =
  " Provide response in third person, The response will be read by Ashish. You're trainer to him. Respond in JSON: format with title and description. Title should have a matching emoji at the end if possible. and do not include the duplicate emoji if it is already in the title. The description should be a detailed explanation of the title. The response should be a list of objects with title and description. No other format is accepted. provide the proper brackets for parsing JSON. Do not provide any markdown or HTML formatting or '**'. provide in format: [{'title': 'title', 'description': 'description'}, {'title': 'title', 'description': 'description'}]";
const prompt =
  `Create a 7-day workout plan for a 25-year-old male named Ashish, who lives in Melbourne. Ashish’s goal is to gain 10 kg of weight, focusing on muscle mass. He is a beginner in weight training but has a basic level of fitness. The plan should include a mix of strength training and compound exercises, targeting different muscle groups. Additionally, provide guidance on rest and recovery, and include any specific nutritional tips to support his goal of healthy weight gain. Include details on sets, reps, and progression over time ${formatString}.`;

async function callGpt() {
  console.log("call GPT called by Ashish");

  try {
    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return new Response(response, {
      headers: {
        "Content-Type": "application/json",
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

Deno.serve(async (req: Request) => {
  const supabaseClient = getSupabaseClient(req);
  console.log("supabase client got successfully");

  const token: string = getTokenFromRequest(req);
  const userRepo: UserRepository = new UserRepository(token, supabaseClient);
  const user = await userRepo.getUser();
  console.log(`The user name is ${user?.email}`);
  const response = await callGpt();

  const responseDataText = await response.text();

  return new Response(responseDataText, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
  // return callGpt();
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/callGpt' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

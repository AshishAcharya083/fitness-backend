import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import GeminiModel from "./gemini_model.ts";
import JsonSchema from "../json_schema.ts";

const apiKey = "AIzaSyDwa4KyRor7GI1EWMk1Pb8mH0xl1TQImak";

const apiKeyPaid = "AIzaSyAHuh_ytUiBfkUw3scZe4wQKiknUlN5bes";

const genAI = new GoogleGenerativeAI(apiKeyPaid);

const model = genAI.getGenerativeModel({
    model: GeminiModel.flash,
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: JsonSchema.workoutRoutineSchema,
    },
});

export default model;

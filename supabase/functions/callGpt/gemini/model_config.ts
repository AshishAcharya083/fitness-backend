import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import GeminiModel from "./gemini_model.ts";
import JsonSchema from "../json_schema.ts";

const apiKey = "AIzaSyDwa4KyRor7GI1EWMk1Pb8mH0xl1TQImak";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: GeminiModel.flash,
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: JsonSchema.workoutRoutineSchema,
    },
});

export default model;

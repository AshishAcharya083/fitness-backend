import { SchemaType } from "npm:@google/generative-ai";

export default class JsonSchema {
    static workoutRoutineSchema = {
        type: SchemaType.ARRAY,
        description: "List of objects with title and description",
        items: {
            type: SchemaType.OBJECT,
            properties: {
                title: {
                    type: SchemaType.STRING,
                    description:
                        "Title ending with suitable emoji (emoji as suffix) if available. Do not repeat emoji if it's already in previous title.",
                },
                description: {
                    type: SchemaType.STRING,
                    description: "The description of the item",
                },
            },
            required: ["title", "description"],
        },
    };
}

class JsonSchema {
    static fullBodyAnalysis = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description":
                        "Suitable title for description below with emoji at the end",
                },
                "description": {
                    "type": "string",
                    "description": "plain text in simple language",
                },
            },
        },
    };
}

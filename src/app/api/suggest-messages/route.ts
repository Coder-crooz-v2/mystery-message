export async function POST(req: Request) {

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/google/gemma-2-2b-it",
            {
                headers: {
                    Authorization: "Bearer " + process.env.HUGGING_FACE_API_KEY,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. Enclose the entre question string in \". Ignore the date and time: "+new Date().toLocaleString(),
                    parameters: {
                        return_full_text: false,
                        max_new_tokens: 100,
                        temperature: 0.5
                    }
                }),
            }
        );
        const result = await response.json();
        return Response.json({
            success: true,
            message: result[0].generated_text,
            }, { status: 200 });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error in generating suggestions" + error
        }, { status: 500 });
    }
}
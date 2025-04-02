export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Received Body:", body);

        const { text } = body;
        if (!text) {
            return Response.json({ error: "Text is required" }, { status: 400 });
        }

        console.log("Generating speech for:", text);

        // Send request to Hugging Face API
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/facebook/fastspeech2-en-ljspeech",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Ensure this env var is set
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: text }),
            }
        );

        console.log(" Hugging Face API Response Status:", response.status);
        const result = await response.arrayBuffer()
        console.log("Hugging Face API Response:", result);

        return new Response(result,{
            headers:{
                "Content-Type":"audio/mpeg"
            }
        })
    } catch (error) {
        console.error("Server Error:", error.message);
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
}



import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received Body:", body);

    const { prompt } = body;
    if (!prompt) {
        return Response.json({ error: "prompt is required" }, { status: 400 });
    }


	const response = await fetch(
		"https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
		{
			headers: {
				Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Ensure this env var is set
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({inputs : prompt}),
		}
	);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HuggingFace API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }
 
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const cloudinaryUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(buffer);
    });

    //  Return Cloudinary image URL to frontend
    return NextResponse.json({
      success: true,
      result: cloudinaryUpload.secure_url,
    });
  } catch (e) {
    console.error("Image Generation Error:", e);
    return NextResponse.json({
      success: false,
      error: e.message,
    });
  }
}

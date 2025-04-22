// npm install assemblyai

import { AssemblyAI } from 'assemblyai'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { audioUrl } = await req.json()

    if (!audioUrl) {
      return NextResponse.json({ error: "Missing audio URL" }, { status: 400 })
    }

    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY,
    })

    const transcript = await client.transcripts.transcribe({
      audio: audioUrl,
    })

    // Ensure `transcript.words` is defined and non-empty
    if (!transcript.words || !Array.isArray(transcript.words) || transcript.words.length === 0) {
      return NextResponse.json(
        { error: "Transcript completed but no words found" },
        { status: 500 }
      )
    }

    console.log("Captions (words):", transcript.words)

    return NextResponse.json({ result: transcript.words })
  } catch (error) {
    console.error("Error in /api/get-caption:", error)

    // Return the actual error message for better debugging
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}

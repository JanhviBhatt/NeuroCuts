// npm install assemblyai

import { AssemblyAI } from 'assemblyai'
import { NextResponse } from 'next/server'

export async function POST(req){
    try{
        const {audioUrl } = await req.json()
        const client = new AssemblyAI({
            apiKey: process.env.ASSEMBLYAI_API_KEY
          })

          const FILE_URL = audioUrl

          const data = {
            audio: FILE_URL
          }
          const transcript = await client.transcripts.transcribe(data)
  console.log(transcript.words)
  return NextResponse.json({'result':transcript.words})
    } catch(error){
        return NextResponse.json({'Error:':error})
    }
}

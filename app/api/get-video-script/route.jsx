import { NextResponse } from "next/server";
import { chatSession } from "../../../configs/AiModel"


export async function POST(req){
    try{
        const {prompt} = await req.json()
        console.log('Here I am')

        console.log(prompt)

        const result = await chatSession.sendMessage(prompt);
        console.log(result.response.text());
        return NextResponse.json({'result':JSON.parse(result.response.text())})
    } catch(e){
        return NextResponse.json({'Error:':e})
    }
}
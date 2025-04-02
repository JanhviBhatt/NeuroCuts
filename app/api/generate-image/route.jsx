import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
       
        // Save the generated image
         
       // await writeFile("./output.png", output);
       // console.log("Image saved as output.png : "+output);
       // return NextResponse.json({"result":output[0]})
    }catch(e){
       return NextResponse.json({"error":e.message})
    }
}
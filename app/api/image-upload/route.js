import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const formData = await request.formData();


        // Convert file to Buffer
        const files = formData.getAll('images')

        if(!files || files.length===0){
          return NextResponse.json({success:false,message:"Please upload images"})
        }
   
        const result = await Promise.all(
          files.map(async (file) => {
             const arrayBuffer = await file.arrayBuffer()
             const buffer = Buffer.from(arrayBuffer)
  
             return new Promise((resolve, reject) => {
               const stream = cloudinary.uploader.upload_stream(
                  {resource_type: 'auto'},
                  (error,result) => {
                       if(error){
                          reject(error)
                       }else{
                          resolve(result)
                       }
                  }
               )
               stream.end(buffer) // send the buffer to cloudinary
             })
          })
        )
       const image = result.map(result => result.secure_url)

       return NextResponse.json({ success: true, image: image });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

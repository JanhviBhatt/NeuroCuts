'use client'
import React from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import CustomLoading from './_components/CustomLoading'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'

const CreateNew = () => {
  const FILEURL = "https://res.cloudinary.com/dh94ebwua/raw/upload/v1743134083/udvnyx2ynnygecliyzek.mp3"
  const [formData, setFormData] = React.useState([])
  const [audioUrl, setAudioUrl] = React.useState(null)
  const [videoScript, setVideoScript] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [captions, setCaptions] = React.useState()
  const [imageList, setImageList] = React.useState([])
  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue)

    setFormData({
      ...formData,
      [fieldName]: fieldValue
    })
  }
  const createShortVideo = () => {
    // getVideoScript()
    GenerateImage()
  }

  // Create Video Functionality Here
  const getVideoScript = async () => {
    setLoading(true)
    const prompt = 'Write a script to generate ' + formData.duration + ' video on topic : ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in json format with image prompt and content text as field';
    console.log(prompt)
    const result = await axios.post('/api/get-video-script', { prompt: prompt }).then(res => {

      try {
        console.log('data ', res.data.result);

        if (!res.data || !Array.isArray(res.data.result)) {
          throw new Error("Invalid response: Expected an array but got " + typeof res.data.result);
        }

        setVideoScript(res.data.result);
        generateAudioFile(res.data.result);
      } catch (error) {
        console.error("Error processing video script:", error);
      }

    })
  }
  // handle the process of getting audio data
  const generateAudioFile = async (videoScript) => {
    let text = '';
    videoScript.forEach((scene) => {
      text += scene.content_text + ' ';
    })
    console.log(text)
    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text
        }),
      })

      console.log("Full API Response:", response);

      if (response.statusText !== 'OK') {
        throw new Error("Failed to generate audio file: " + response.statusText);
      }
      const data = await response.arrayBuffer();
      const buffer = Buffer.from(data)

      // Convert base64 audio to blob URL
      const audioBlob = new Blob(
        [buffer],
        { type: "audio/mp3" }
      );


      const formData = new FormData();
      formData.append("file", audioBlob);

      const cloudinaryResponse = await axios.post(
        "/api/audio-upload",
        formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }
      );

      console.log("Cloudinary Response:", cloudinaryResponse);
      setAudioUrl(cloudinaryResponse.data.secure_url);
      cloudinaryResponse.data.secure_url && GenerateAudioCaption(cloudinaryResponse.data.secure_url)
    }
    catch (error) {
      console.error("Error generating speech:", error);
      setLoading(false);
    }
  }


  const GenerateAudioCaption = async (fileUrl) => {
    setLoading(true)
    await axios.post('/api/get-caption', {
      audioUrl: fileUrl
    }).then(res => {
      console.log(res.data.result)
      setCaptions(res.data.result)
      GenerateImage()
    })
  }
  const videoSCRIPT = [
    {
      "scene": 1,
      "duration": 5,
      "content_text": "Cleopatra wasn't Egyptian! She was actually Greek, descended from the Ptolemaic dynasty that ruled Egypt after Alexander the Great.",
      "image_prompt": "Comic book style illustration, Cleopatra, with distinct Greek features, wearing Egyptian royal attire, puzzled expression, pyramids in the background, speech bubble saying 'Wait, I'm Greek?', vibrant colors, dynamic pose"
    },
    {
      "scene": 2,
      "duration": 5,
      "content_text": "The Great Emu War of 1932! The Australian military deployed soldiers to combat a population explosion of emus ravaging farmland. They lost!",
      "image_prompt": "Comic book style illustration, Australian soldiers firing machine guns at a flock of emus, comical expressions of fear and surprise on the soldiers' faces, emus running rampant, rural Australian landscape, bright sunshine, exaggerated action lines, humorous style"
    },
    
  ]
  const GenerateImage = async () => {
    let images = []
    videoSCRIPT.forEach(async(element)=>{
      await axios.post('/api/generate-image',{
        prompt:element?.image_prompt
      }).then(res=>{
        console.log(res.data)
        images.push(res.data.result)
      })
    })
    console.log(images)
    setImageList(images)
    setLoading(false)
};


  return (
    <div className='md:px-20'>
      <h2>Create New</h2>

      <div className='mt-10 shadow-md p-10'>
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />
        {/* Select Style */}
        <SelectStyle onUserSelect={onHandleInputChange} />
        {/* Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />
        {/* Create Button */}
        <button className='bg-blue-500 text-white p-3 mt-10 w-full cursor-pointer' onClick={createShortVideo}>Create Short Video</button>
        {audioUrl && (
          <div className="mt-3">
            <audio controls>
              <source src={audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
       {imageList.map((image, index) => (
    <img key={index} src={image} alt="Generated Image" style={{ width: "200px", height: "200px" }} />
))}

      </div>
      <CustomLoading loading={loading} />
    </div>
  )
}

export default CreateNew

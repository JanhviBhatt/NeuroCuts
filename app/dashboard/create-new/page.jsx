'use client'
import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import CustomLoading from './_components/CustomLoading'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { VideoDataContext } from '@/app/_context/VideoDataContext'
import { db } from '@/configs/db';
import { VideoData } from '@/configs/db/schema';
import { useUser } from '@clerk/nextjs';
import PlayerDialog from '../_components/PlayerDialog'

const CreateNew = () => {
  const {user}= useUser()
  const [formData, setFormData] = React.useState([])
  const [audioUrl, setAudioUrl] = React.useState(null)
  const [videoScript, setVideoScript] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [captions, setCaptions] = React.useState()
  const [imageList, setImageList] = React.useState([])
  const {videoData, setVideoData} = useContext(VideoDataContext)
  const [playVideo, setPlayVideo] = React.useState(true)
  const [videoId, setVideoId] = React.useState(1)
  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue)

    setFormData({
      ...formData,
      [fieldName]: fieldValue
    })
  }

  const createShortVideo = () => {
    getVideoScript()
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
        setVideoData(prev=>({
          ...prev,
          'videoScript': res.data.result,
        }))
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
      setVideoData(prev=>({
        ...prev,
        'audioUrl': cloudinaryResponse.data.secure_url,
      }))
      console.log("Cloudinary Response:", cloudinaryResponse);
      setAudioUrl(cloudinaryResponse.data.secure_url);
      cloudinaryResponse.data.secure_url && GenerateAudioCaption(cloudinaryResponse.data.secure_url,videoScript)
    }
    catch (error) {
      console.error("Error generating speech:", error);
      setLoading(false);
    }
  }


  const GenerateAudioCaption = async (fileUrl,videoScript) => {
    setLoading(true)
    await axios.post('/api/get-caption', {
      audioUrl: fileUrl
    }).then(res => {
      console.log(res.data.result)
      setCaptions(res.data.result)
      const updatedData = {
      ...videoData,
      captions: res.data.result,
    };
    if(res.data.result){
      setVideoData(updatedData);
      GenerateImage(videoScript)
    }else {
      setLoading(false)
      console.error("Error: No captions found in the response.");
    }
    })
  }
  
  const GenerateImage = async (videoScript) => {
    try {
      const imageResponses = await Promise.all(
        videoScript.map(async (element) => {
          const res = await axios.post('/api/generate-image', {
            prompt: element?.image_prompt,
          });
          console.log("Image generated:", res.data.result);
          return res.data.result; //  this will be added to the array
        })
      );
  
      // Now all image URLs are collected
      setImageList(imageResponses);
      setVideoData(prev=>({
        ...prev,
        'imageList': imageResponses,
      }))
      console.log(imageResponses, videoScript,audioUrl,captions);
      setLoading(false);
    } catch (err) {
      console.error("Error generating images:", err);
    }
  };

  useEffect(()=>{
    console.log(videoData)
    if( videoData?.videoScript &&
    videoData?.audioUrl &&
    videoData?.captions &&
    videoData?.imageList?.length > 0){
      SaveVideoData(videoData)
    }
  },[videoData])

const SaveVideoData = async (videoData) => {
  const { videoScript, audioUrl, captions, imageList } = videoData;

  if (!videoScript || !audioUrl || !captions || !imageList?.length) {
    console.warn("Missing data in videoData, skipping save.", videoData);
    return;
  }

  try {
    setLoading(true);
    const result = await db.insert(VideoData).values({
      script: videoScript,
      audioUrl: audioUrl,
      captions: captions,
      imageList: imageList,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    }).returning({ id: VideoData.id });

    setVideoId(result[0].id)
    setPlayVideo(true)

    console.log(" Saved videoData to DB:", result);
  } catch (error) {
    console.error(" Error saving video data to DB:", error);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className='md:px-20 py-10'>

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
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  )
}

export default CreateNew

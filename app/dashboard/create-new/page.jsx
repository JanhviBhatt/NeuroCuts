'use client'
import React, { useContext, useEffect, useState } from 'react'
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
  const [playVideo, setPlayVideo] = React.useState(false)
  const [videoId, setVideoId] = React.useState(2)
  let isValid = true;
  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue)

    setFormData({
      ...formData,
      [fieldName]: fieldValue
    })


  }

  const createShortVideo = () => {
    const isValid = formData.topic && formData.imageStyle && formData.duration;
    if(isValid) getVideoScript()
  }

  // Create Video Functionality Here
  const getVideoScript = async () => {
    setLoading(true)
    const prompt = 'Write a script to generate ' + formData.duration + ' video on topic : ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in json format with image prompt and content text as field';
    const result = await axios.post('/api/get-video-script', { prompt: prompt }).then(res => {

      try {

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
      setAudioUrl(cloudinaryResponse.data.secure_url);
      cloudinaryResponse.data.secure_url && GenerateAudioCaption(cloudinaryResponse.data.secure_url,videoScript)
    }
    catch (error) {
      console.error("Error generating speech:", error);
      setLoading(false);
    }
  }


  const GenerateAudioCaption = async (fileUrl, videoScript) => {
    try {
      setLoading(true);
  
      const response = await axios.post('/api/get-caption', {
        audioUrl: fileUrl,
      });
  
      const result = response.data?.result;
  
      if (result && Array.isArray(result)) {
        setCaptions(result);
  
        const updatedData = {
          ...videoData,
          captions: result,
        };
  
        setVideoData(prev=>({
          ...prev,
          'captions': result,
        }));
  
        // Now move on to generate images
        await GenerateImage(videoScript);
      } else {
        console.error("Error: No valid captions found in the response.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error generating captions:", error);
      setLoading(false);
    }
  };
  
  
  const GenerateImage = async (videoScript) => {
    try {
      if (!Array.isArray(videoScript) || videoScript.length === 0) {
        throw new Error("Invalid videoScript data provided for image generation.");
      }
  
      setLoading(true);
  
      const imageResponses = await Promise.all(
        videoScript.map(async (scene, index) => {
          if (!scene?.image_prompt) {
            console.warn(`Missing image prompt for scene ${index}`);
            return null;
          }
  
          const response = await axios.post('/api/generate-image', {
            prompt: scene.image_prompt,
          });
  
          const imageUrl = response.data?.result;
  
          if (!imageUrl) {
            console.warn(`No image URL returned for scene ${index}`);
            return null;
          }
  
          return imageUrl;
        })
      );
  
      const validImageList = imageResponses.filter(Boolean); // remove nulls if any
  
      if (validImageList.length === 0) {
        throw new Error("No valid images generated.");
      }
  
      setImageList(validImageList);
  
      setVideoData(prev => ({
        ...prev,
        imageList: validImageList,
      }));
  
    } catch (error) {
      console.error(" Error generating images:", error);
    } finally {
      setLoading(false); // always turn off loading spinner
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
        <button
  className={`${isValid
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  } p-3 mt-10 w-full cursor-pointer rounded transition duration-300`}
  onClick={createShortVideo}

>
  Create Short Video
</button>

      
      </div>
      <CustomLoading loading={loading} />
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  )
}

export default CreateNew

import React from 'react'
import { AbsoluteFill, Img, Sequence, useVideoConfig, Audio, useCurrentFrame, interpolate } from 'remotion'

const RemotionVideo = ({script,imageList,audioUrl,captions, setDurationInFrame}) => {
    const {fps} = useVideoConfig()
    const frame = useCurrentFrame()

    const getDurationFrame =()=>{
        setDurationInFrame(captions[captions?.length-1]?.end/1000*fps)
        return captions[captions?.length-1]?.end/1000*fps;
    }
    const getCurrentCaptions=()=>{
       const currentTime = frame/30*1000 // convert frame number to millseconds
       const currentCaption = captions.find((word)=>currentTime>=word.start && currentTime<=word.end)
       return currentCaption?currentCaption?.text:''
    }
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      
     {
        imageList?.map((item,index)=>
        {
            const startTime =(index*getDurationFrame())/imageList?.length
            const duration=getDurationFrame()
            const scale =(index)=> interpolate(
                frame,
                [startTime, startTime + duration/2, startTime + duration],
                index%2==0 ?[1,1.8,1]:[1.8,1,1.8], // scale from 1 to 1.8
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )
            return (
                <>
                <Sequence key={index} from={startTime} durationInFrames={duration}>
                    <Img src={item} alt="Generated Image" style={{ width: "100%", height: "100%" ,objectFit:'cover', transform:`scale(${scale(index)})`}}  />
                    <AbsoluteFill className='text-white justify-center items-center bottom-10 h-[150px] top-undefined bottom-0'>
                        <h2 className='text-2xl'>{getCurrentCaptions()}</h2>
                    </AbsoluteFill>
                </Sequence>
                {
                audioUrl && (
                    <Audio src={audioUrl} />
                )
            }
                </>
            )
        })
     } 
      </AbsoluteFill>        
  )
}

export default RemotionVideo

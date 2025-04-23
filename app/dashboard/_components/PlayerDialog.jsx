import React, { useEffect } from 'react'
import { Player } from "@remotion/player";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import RemotionVideo from './RemotionVideo';
import { Button } from '@/components/ui/button';
import { db } from '@/configs/db';
import { eq } from 'drizzle-orm';
import { VideoData } from '@/configs/db/schema';
import { useRouter } from 'next/navigation';

const PlayerDialog = ({ playVideo, videoId }) => {
    const [openDialog, setOpenDialog] = React.useState(!playVideo)
    const [videoData, setVideoData] = React.useState([])
    const [durationInFrame, setDurationInFrame] = React.useState(100)
    const router = useRouter()
    useEffect(() => {
       setOpenDialog(!openDialog)
        videoId && GetVideoData()
    }, [playVideo])

    const GetVideoData =async ()=>{
        const result = await db.select().from(VideoData).where(eq(VideoData.id,videoId))

        console.log(result)
        setVideoData(result[0])
    }
    return (
        <>
        <Dialog open={openDialog}>
            <DialogContent className='bg-white flex flex-col items-center'>
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold my-5">Here's your video</DialogTitle>
                    <DialogDescription>
                    <Player
                            component={RemotionVideo}
                            durationInFrames={Number(durationInFrame.toFixed(0))}
                            compositionWidth={300}
                            compositionHeight={450}
                            fps={30}
                            controls={true}
                            inputProps={{
                                ...videoData,
                                setDurationInFrame:(frameValue)=> setDurationInFrame(frameValue),
                            }}
                        />
                        <div className='flex gap-30 mt-10'>
                            <Button variant="ghost" onClick={()=>{router.replace('/dashboard'); setOpenDialog(false)}}>Cancel</Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
        </>
    )
}

export default PlayerDialog

import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
const SelectDuration = ({onUserSelect}) => {
  return (
    <div className='mt-7'>
      <h2 className='font-bold text-2xl text-blue-500'>Duration</h2>
      <p className='text-gray-500'>Select the duration of your video?</p>
      <Select onValueChange={(value) => {
        value!='Custom Prompt' && onUserSelect('duration',value)
      }}>
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Select Duration" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem key={1} value='15 Seconds'>15 Seconds</SelectItem>
            <SelectItem key={2} value='20 Seconds'>20 Seconds</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectDuration

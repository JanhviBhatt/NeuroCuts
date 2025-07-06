# NeuroCuts – AI-Powered Short Video Generator

**NeuroCuts** is an AI-driven web application that generates engaging short videos (15–30 seconds) from user-provided prompts. It integrates multiple AI services to handle text-to-audio conversion, image generation, and automatic captioning—delivering fully-formed short videos ready for sharing or editing.

<br>

## Features

- 🧠 **Prompt-to-Video Pipeline**: Converts a simple text prompt into a short video using a multi-step AI workflow.
- 🔊 **Text-to-Audio**: Converts prompt narration into realistic voiceover.
- 🖼️ **Image Generation**: Dynamically creates background visuals aligned with the prompt.
- 📝 **Auto-Captioning**: Generates subtitles using audio-to-text models for accessibility and clarity.
- ⚡ **Optimized Performance**: Parallel API execution reduces video generation time by 40%.
- ☁️ **Media Management**: Stores 1000+ generated assets securely using Cloudinary and PostgreSQL.

<br>

## 🛠️ Tech Stack

- **Frontend**: Next.js, React.js, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: PostgreSQL  
- **Media Storage**: Cloudinary  
- **AI Services**: Hugging Face APIs (TTS, Image Gen, ASR)  
- **Others**: REST APIs, Axios, Git & GitHub

<br>

<br>

How It Works

1. **User submits a prompt**  
2. **Text-to-speech** converts it to narration  
3. **Image generator** creates visual slides based on the prompt  
4. **Captions** are created from narration using ASR  
5. **Final video** is stitched together and uploaded to Cloudinary  

<br>


# Clone the repo
git clone https://github.com/JanhviBhatt/NeuroCuts.git
cd NeuroCuts

# Install dependencies
npm install

# Add your environment variables
touch .env
# Add Cloudinary, DB, and API keys in .env

# Run the app
npm run dev
Make sure you have PostgreSQL and all API keys (Cloudinary, HuggingFace) configured.


<br>

Author
Janhvi Bhatt
LinkedIn · GitHub · LeetCode

<br>
License
This project is open source and available under the MIT License.

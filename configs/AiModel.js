const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const fs = require("node:fs");
  const mime = require("mime-types");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseModalities: [
    ],
    responseMimeType: "application/json",
  };
  
  export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Write a script to generate 30 seconds video on topic: interesting historical story along with AI image prompt in Realistic format for each scene and give me result in   json format with image prompt and content text as field\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"scene\": 1,\n    \"duration\": 5,\n    \"content_text\": \"In 1896, a young woman named Annie Londonderry became the first woman to cycle around the world.  She was not a seasoned cyclist.\",\n    \"image_prompt\": \"Realistic photograph, 1896, Annie Londonderry, determined young woman, wearing a long skirt and blouse, sitting on a high-wheeled bicycle, smiling slightly, a cobbled street in Boston in the background, gas lamps, horse-drawn carriages, slightly dusty, early morning light, cinematic, depth of field\"\n  },\n  {\n    \"scene\": 2,\n    \"duration\": 5,\n    \"content_text\": \"She took on the challenge to win a wager: $20,000 if she could complete the trip within 15 months. She had no cycling experience before the bet!\",\n    \"image_prompt\": \"Realistic photograph, 1896, Annie Londonderry, face determined, leaning over her bicycle, slightly worried, holding a crumpled $20 bill, cluttered room with posters and maps in the background, oil lamp lighting, sepia tones, high contrast, cinematic\"\n  },\n  {\n    \"scene\": 3,\n    \"duration\": 5,\n    \"content_text\": \"Equipped with a Columbia women's bicycle and a change of clothes, she set off from Boston, largely dependent on sponsorships and sheer grit.\",\n    \"image_prompt\": \"Realistic photograph, 1896, Annie Londonderry, riding a Columbia bicycle, a large advertising banner for 'Londonderry Lithia Spring Water' attached to her bike, riding along a dusty road, a small town in the distance, bright sunlight, blue sky, cinematic, wide angle\"\n  },\n  {\n    \"scene\": 4,\n    \"duration\": 5,\n    \"content_text\": \"She faced numerous challenges – broken spokes, flat tires, and even a broken wrist which she kept secret. She patched her tires herself.\",\n    \"image_prompt\": \"Realistic photograph, 1896, Annie Londonderry, kneeling on the side of a road, repairing a flat tire on her bicycle, tools scattered around her, dirt on her hands and face, exhausted expression, rural landscape in the background, sunlight filtering through trees, cinematic, shallow depth of field\"\n  },\n  {\n    \"scene\": 5,\n    \"duration\": 5,\n    \"content_text\": \"She traveled through Europe and Asia, often shipping her bicycle by boat. She was a marketing genius, selling photos and telling stories to fund her journey.\",\n    \"image_prompt\": \"Realistic photograph, 1896, Annie Londonderry, standing on the deck of a steamship, her bicycle beside her, a city skyline in the background, smiling and talking to a group of people, holding a stack of photographs, hazy sunlight, cinematic, medium shot\"\n  },\n  {\n    \"scene\": 6,\n    \"duration\": 5,\n    \"content_text\": \"Despite not winning the initial wager, Annie proved everyone wrong. She showed that anything is possible with determination, paving the way for future female adventurers.\",\n    \"image_prompt\": \"Realistic photograph, Annie Londonderry, older, but still with a determined look, sitting at a desk, writing in a notebook, surrounded by maps and travel souvenirs, warm lighting, bookshelves in the background, confident smile, cinematic, close-up\"\n  }\n]\n```\n"},
          ],
        },
      ],
    });
  
 
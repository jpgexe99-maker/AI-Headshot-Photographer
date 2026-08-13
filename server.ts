import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit to handle base64 selfie images
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ limit: '25mb', extended: true }));

  // Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Generate Headshot Endpoint
  app.post('/api/generate-headshot', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY is not configured in environment variables. Please check Settings > Secrets.',
        });
      }

      const {
        image,
        style = 'Corporate Grey Backdrop',
        attire = 'Professional Dark Blazer and Crisp White Shirt',
        expression = 'Confident, warm, approachable professional smile',
        lighting = 'Soft studio box lighting with balanced key light',
        backgroundDetail = 'Clean neutral dark studio backdrop with subtle radial glow',
        aspectRatio = '3:4',
        quality = 'lite',
        customPrompt = '',
      } = req.body;

      if (!image) {
        return res.status(400).json({ error: 'Source selfie image is required.' });
      }

      // Helper to extract mimeType and raw base64
      let mimeType = 'image/jpeg';
      let base64Data = image;

      if (image.startsWith('data:')) {
        const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64Data = matches[2];
        } else {
          // fallback strip header
          base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
        }
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Model choice based on quality preference
      const modelName = quality === 'standard' ? 'gemini-3.1-flash-image' : 'gemini-3.1-flash-lite-image';

      const structuredPrompt = `You are a world-class celebrity headshot photographer. 
Generate a photorealistic, studio-quality professional headshot based on the person shown in this reference selfie photo.

CRITICAL IDENTITY RULES:
- Strictly maintain and reproduce the exact facial structure, eye shape, nose, lips, hair texture/color, skin tone, gender, age, and recognizable features of the person in the reference selfie.
- Do NOT generate a different person or alter the face identity. The result MUST look like the same person in a high-end photography shoot.

PHOTOGRAPHY & STYLING INSTRUCTIONS:
- Overall Style: ${style}
- Clothing & Attire: ${attire}
- Facial Expression: ${expression}
- Lighting Setup: ${lighting}
- Background Environment: ${backgroundDetail}
${customPrompt ? `- Custom Enhancements: ${customPrompt}` : ''}

TECHNICAL SPECS:
- Sharp, crystal-clear focus on the subject's face and eyes.
- Natural skin texture with smooth studio retouching (no artificial plastic or cartoon filter look).
- Professional color grading, balanced exposure, and high resolution.`;

      const contents = {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: structuredPrompt,
          },
        ],
      };

      const imageConfig: Record<string, string> = {
        aspectRatio: aspectRatio,
      };

      if (modelName === 'gemini-3.1-flash-image') {
        imageConfig.imageSize = '1K';
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          imageConfig: imageConfig,
        },
      });

      // Extract generated image base64 from response parts
      let generatedImageUrl: string | null = null;
      let modelMessage = '';

      const candidates = response.candidates;
      if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            const rawBase64 = part.inlineData.data;
            const resMime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${resMime};base64,${rawBase64}`;
          } else if (part.text) {
            modelMessage += part.text;
          }
        }
      }

      if (!generatedImageUrl) {
        return res.status(500).json({
          error: 'The AI model did not return an image. Message: ' + (modelMessage || 'No image part returned.'),
        });
      }

      res.json({
        success: true,
        imageUrl: generatedImageUrl,
        prompt: structuredPrompt,
        modelUsed: modelName,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error generating headshot:', err);
      res.status(500).json({
        error: err?.message || 'Failed to generate headshot. Please try again.',
      });
    }
  });

  // Vite middleware for dev or Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

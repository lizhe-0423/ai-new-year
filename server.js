import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI Client (Server-side)
const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.deepseek.com';
const model = process.env.AI_MODEL || 'deepseek-chat';

const client = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
});

// API Routes
app.post('/api/couplet', async (req, res) => {
  try {
    const { theme, style } = req.body;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Server API Key not configured' });
    }

    const prompt = `请为一个关于"${theme}"的主题创作一副中文春联。
    风格：${style || 'traditional'}。
    请返回JSON格式，包含以下字段：
    - upper: 上联 (7-11字)
    - lower: 下联 (7-11字)
    - horizontal: 横批 (4字)
    - explanation: 寓意解释 (简短)
    
    只返回JSON字符串，不要包含markdown标记。`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: model,
    });

    const content = completion.choices[0].message.content || '';
    const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(jsonStr);
    
    res.json(data);
  } catch (error) {
    console.error('Couplet generation error:', error);
    res.status(500).json({ error: 'Failed to generate couplet' });
  }
});

app.post('/api/fortune', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ error: 'Server API Key not configured' });
    }

    const prompt = `请为用户抽取一个2026年(马年)的新年运势。
    请返回JSON格式，包含以下字段：
    - id: 随机UUID
    - title: 运势标题 (如"大吉"、"上上签"等)
    - content: 运势签文 (古风诗句，4句)
    - blessing: 签文的详细解读和白话祝福 (至少100字)
    - type: 随机从 [career, love, health, wealth] 中选一个
    - upper_trigram: 上卦 (如"乾"、"坤"、"震"、"巽"、"坎"、"离"、"艮"、"兑"中的一个字)
    - lower_trigram: 下卦 (如"乾"、"坤"、"震"、"巽"、"坎"、"离"、"艮"、"兑"中的一个字)
    
    只返回JSON字符串，不要包含markdown标记。`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: model,
    });

    const content = completion.choices[0].message.content || '';
    const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(jsonStr);
    
    res.json(data);
  } catch (error) {
    console.error('Fortune generation error:', error);
    res.status(500).json({ error: 'Failed to generate fortune' });
  }
});

// Serve static files in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Only listen if run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;

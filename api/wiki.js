// api/wiki.js

// [关键兼容] 引入 node-fetch 以支持 Node 16
import fetch from 'node-fetch';
import { allowCors } from '../utils/cors.js';

async function handler(req, res) {
  // 1. 获取 URL 参数，例如 ?term=云计算
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: 'Missing term parameter. Usage: ?term=keyword' });
  }

  try {
    // 2. 构造目标 URL (维基百科摘要 API)
    const targetUrl = `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;

    // 3. 发起请求
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'MyApiVerse/1.0 (contact@example.com)', // 必须带 UA
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
       return res.status(response.status).json({ error: `Wiki API Error: ${response.statusText}` });
    }

    const data = await response.json();

    // 4. 返回清洗后的数据
    res.status(200).json({
      title: data.title,
      summary: data.extract,
      image: data.thumbnail?.source || null,
      url: data.content_urls?.desktop?.page
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// 导出时包裹 CORS 处理
export default allowCors(handler);
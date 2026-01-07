// api/index.js
const app = require('express')();
const cors = require('cors');
const axios = require('axios');

// 1. 开启跨域支持 (允许任何网站调用你的 API)
app.use(cors());

// 2. 路由：维基百科摘要代理
// 访问地址: /api/wiki?term=关键词
app.get('/api/wiki', async (req, res) => {
  const { term } = req.query;

  // 校验参数
  if (!term) {
    return res.status(400).json({ error: 'Missing term parameter. Usage: ?term=keyword' });
  }

  try {
    // 构造请求地址
    const targetUrl = `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;

    // 使用 Axios 发起请求
    const response = await axios.get(targetUrl, {
      headers: {
        // 伪装 User-Agent，防止被维基百科拦截
        'User-Agent': 'MyStudyProxy/1.0 (contact@example.com)',
        'Accept': 'application/json'
      }
    });

    // 直接返回维基百科的数据
    res.json(response.data);

  } catch (error) {
    // 错误处理
    if (error.response) {
      // 对方服务器返回了错误状态码 (如 404)
      res.status(error.response.status).json({ 
        error: 'Wiki API Error', 
        details: error.response.statusText 
      });
    } else {
      // 网络错误或其他代码错误
      console.error('Internal Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }
});

// 3. 路由：测试接口 (用于检测服务是否存活)
// 访问地址: /api/ping
app.get('/api/ping', (req, res) => {
  res.json({ 
    message: 'pong', 
    node_version: process.version, 
    status: 'online' 
  });
});

// 4. 导出 App (Vercel 会自动接管)
module.exports = app;
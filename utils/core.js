// utils/cors.js

// 这是一个高阶函数，包裹你的业务逻辑，统一处理 CORS
export function allowCors(fn) {
    return async (req, res) => {
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有来源
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      );
  
      // 如果是预检请求，直接返回成功
      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }
  
      return await fn(req, res);
    };
  }
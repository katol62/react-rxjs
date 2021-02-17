import { createProxyMiddleware } from 'http-proxy-middleware';

export default (app: any) => {
    app.use(
        '/api/*',
        createProxyMiddleware('/api', {
            target: 'http://localhost:3010',
            changeOrigin: true,
            secure: false
        })
    )
};

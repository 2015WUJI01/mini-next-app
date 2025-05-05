'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // 尝试从响应头中获取IP
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-ip');
        const data = await response.json();
        console.log('用户IP:', data.ip);
      } catch (error) {
        console.error('获取IP失败:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">IP地址测试</h1>
      <p>请查看浏览器控制台以获取您的IP地址</p>
    </main>
  );
}

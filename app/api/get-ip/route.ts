import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 获取用户IP
  const ip = 
    request.headers.get('x-real-ip') || 
    request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.ip || 
    '未知IP';
  
  // 服务器端控制台输出
  console.log(`API路由中的用户IP: ${ip}`);
  
  // 返回JSON数据
  return NextResponse.json({ ip });
} 
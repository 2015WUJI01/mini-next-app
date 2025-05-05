import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // 获取用户IP
  const ip = 
    request.headers.get('x-real-ip') || 
    request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.ip || 
    '未知IP';
  
  // 打印到服务器端控制台
  console.log(`用户IP: ${ip}`);
  
  // 将IP添加到响应头中，以便前端可以访问
  response.headers.set('x-user-ip', ip);
  
  return response;
}

// 配置匹配的路由
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 
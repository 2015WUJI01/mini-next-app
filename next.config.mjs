/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 如果您的项目不是部署在域名根目录，而是在子目录下，请取消下面这行的注释并修改为您的仓库名
  // basePath: '/mini-next-app',
  // 如果您使用了图片优化功能，需要设置
  images: {
    unoptimized: true,
  },
};

export default nextConfig; 
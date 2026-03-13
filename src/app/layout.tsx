import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitBroom - GitLab Branch Manager",
  description: "GitLab 브랜치를 자동 분석하여 삭제 후보를 분류하고 담당자 확인까지 돕는 웹 관리 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

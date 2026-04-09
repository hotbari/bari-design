import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'
import { MSWProvider } from '@/components/MSWProvider'

export const metadata: Metadata = {
  title: 'Bari CMS',
  description: 'DOOH 콘텐츠 관리 시스템',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <ReactQueryProvider>
          <MSWProvider>
            {children}
          </MSWProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}

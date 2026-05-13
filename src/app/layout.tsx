import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from 'sonner';
import { QueryProvider } from '../components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'KoreRec — Personalised Intelligence',
  description: 'AI-powered contextual recommendations tailored to you',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            expand={false}
            richColors
            toastOptions={{
              style: {
                fontFamily: 'var(--font-dm-sans)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
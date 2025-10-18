import type React from 'react';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
	title: 'Расписание Уника',
};

const inter = Inter({ subsets: ['cyrillic-ext', 'latin-ext'] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={inter.className}>
			<body className="">
				<Suspense fallback={null}>
					{children}
					<Toaster />
				</Suspense>
				<Analytics />
			</body>
		</html>
	);
}

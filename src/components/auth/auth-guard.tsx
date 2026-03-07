'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AuthService } from '@/lib/auth';

interface AuthGuardProps {
	children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = () => {
			const authenticated = AuthService.isAuthenticated();
			setIsAuthenticated(authenticated);

			if (!authenticated) {
				navigate({ to: '/login' });
			}
		};

		checkAuth();
	}, [navigate]);

	if (isAuthenticated === null) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}

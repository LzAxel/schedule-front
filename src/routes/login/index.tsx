import { LoginForm } from '@/components/auth/login-form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login/')({
	component: LoginPage,
});

function LoginPage() {
	return <LoginForm />;
}

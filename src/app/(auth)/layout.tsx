import { AuthProvider } from '@/context/auth-context';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        {children}
      </div>
    </AuthProvider>
  );
}

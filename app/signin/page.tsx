'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    // Automatically "sign in" and redirect to home page
    signIn('credentials', { redirect: false }).then(() => {
      router.push('/');
    });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p>Signing in...</p>
    </div>
  );
}
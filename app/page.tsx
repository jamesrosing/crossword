import ClientWrapper from '@/components/ClientWrapper';
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <ClientWrapper />
      <Toaster />
    </main>
  );
}
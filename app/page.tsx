import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Menu Management
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Built with Next.js 14, Redux, and Tailwind CSS
        </p>
        <Link href="/menus">
          <Button size="lg">Go to Menus</Button>
        </Link>
      </div>
    </main>
  );
}

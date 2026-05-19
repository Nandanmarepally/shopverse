import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-8xl font-bold gradient-text">404</h1>
        <h2 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h2>
        <p className="text-slate-500 mb-8">The page you are looking for does not exist.</p>
        <Link href="/"><Button>Back to Home</Button></Link>
      </div>
    </MainLayout>
  );
}

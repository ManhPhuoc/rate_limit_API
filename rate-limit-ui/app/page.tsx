import ConfigForm from '@/components/config-form';
import CheckForm from '@/components/check-form';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-6 flex justify-center">
      <div className="mx-auto max-w-4xl w-full flex flex-col gap-10 app-container card-bg">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Rate Limit Manager
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          <ConfigForm />
          <CheckForm />
        </div>

      </div>
    </main>
  );
}

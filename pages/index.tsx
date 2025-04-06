import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  
  // Redirect to the client application
  React.useEffect(() => {
    router.replace('/client');
  }, [router]);
  
  return (
    <>
      <Head>
        <title>Cabo Travel Guide - Find Villas, Resorts & More</title>
        <meta name="description" content="Discover the best villas, resorts, restaurants and adventures in Cabo San Lucas. Book your perfect vacation with our comprehensive travel guide." />
      </Head>
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Redirecting to Cabo Travel Guide</h1>
          <p>Please wait while we redirect you...</p>
        </div>
      </div>
    </>
  );
}
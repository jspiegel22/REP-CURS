import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Import components with client-side only rendering
const ClientComponents = dynamic(
  () => import('../client/src/components/client-wrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Cabo Travel Guide...</h1>
          <div className="mx-auto mt-4 w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Cabo Travel Guide - Find Villas, Resorts & More</title>
        <meta name="description" content="Discover the best villas, resorts, restaurants and adventures in Cabo San Lucas. Book your perfect vacation with our comprehensive travel guide." />
      </Head>
      <ClientComponents />
    </>
  );
}
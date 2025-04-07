import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { GuideFormSimple } from '../client/src/components/guide-form-simple';

const TestFormPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Test Guide Form | Cabo Travel Platform</title>
        <meta name="description" content="Test the guide submission form" />
      </Head>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-[#2F4F4F]">
          Guide Form Test Page
        </h1>
        <div className="mb-8">
          <GuideFormSimple />
        </div>
      </div>
    </>
  );
};

export default TestFormPage;
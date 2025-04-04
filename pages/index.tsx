import React from 'react';

export default function Home() {
  return React.createElement(
    "div", 
    { className: "min-h-screen flex items-center justify-center" },
    React.createElement(
      "h1", 
      { className: "text-4xl font-bold" },
      "Welcome to Next.js"
    )
  );
}
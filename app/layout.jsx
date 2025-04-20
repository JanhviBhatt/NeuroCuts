'use client'
import "./globals.css";
import { Roboto } from "next/font/google";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import Provider from './provider'
import { useEffect } from "react";
import { metadata } from '../components/metadata'
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})


export default function RootLayout({
  children
}) {
 
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </head>
        <body
          className={roboto.className}
        >
          <Provider> {/* we are passing children to this provider*/}
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}

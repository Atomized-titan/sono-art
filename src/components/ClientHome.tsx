"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DynamicSearchComponent = dynamic(() => import("@/components/Search"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function ClientHome() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <motion.header
            className="flex justify-between items-center py-6"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
          >
            <Link href="/" className="text-gray-700 hover:text-black mr-4">
              <h1 className="text-4xl font-bold">Sonolise</h1>
            </Link>
            <div>
              <Link
                href="/login"
                className="text-gray-700 hover:text-black mr-4"
              >
                Log in
              </Link>
              <Button className="bg-black text-white">Create account</Button>
            </div>
          </motion.header>

          <Suspense fallback={<div>Loading...</div>}>
            <DynamicSearchComponent />
          </Suspense>
        </div>
      </main>

      <footer className="bg-gray-100 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 Sonolise™. All Rights Reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

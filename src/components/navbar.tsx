import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <motion.header
      className="sticky top-0 z-50 py-4 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-3xl">Sonolise</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search functionality if needed */}
          </div>
          <nav className="flex items-center">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="mr-2">
                Log in
              </Button>
            </Link>
            <Link href="/signup" className="hidden sm:block">
              <Button>Create account</Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="text-lg font-semibold">
                    Sonolise
                  </Link>
                  {/* <Link href="/features">Features</Link>
                  <Link href="/pricing">Pricing</Link>
                  <Link href="/about">About</Link> */}
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Create account</Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;

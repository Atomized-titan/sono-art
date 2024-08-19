"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import UserPlaylists from "@/components/user-playlists";
import { useSession } from "next-auth/react";
import { Music, Disc, Radio, Mic2, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="absolute -z-10 text-primary/10"
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export default function DashboardPage() {
  const { data: session } = useSession();
  const [selectedSection, setSelectedSection] = useState("playlists");

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="container mx-auto px-4 py-12">
        <motion.header className="mb-16 text-center relative" {...fadeInUp}>
          <IconWrapper>
            <Music size={120} />
          </IconWrapper>
          <h1 className="text-5xl font-bold mb-4 relative z-10">
            Your Spotify Universe
          </h1>
          <p className="text-2xl text-muted-foreground">
            Dive into your musical journey
          </p>
        </motion.header>

        <motion.main {...fadeInUp} className="relative">
          <IconWrapper>
            <Disc size={100} style={{ top: "20%", left: "5%" }} />
          </IconWrapper>
          <IconWrapper>
            <Radio size={80} style={{ top: "60%", right: "10%" }} />
          </IconWrapper>
          <IconWrapper>
            <Mic2 size={60} style={{ bottom: "10%", left: "15%" }} />
          </IconWrapper>
          <IconWrapper>
            <Headphones size={90} style={{ top: "40%", right: "5%" }} />
          </IconWrapper>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {["playlists", "top tracks", "recommendations"].map((item) => (
              <motion.div key={item} variants={fadeInUp as Variants}>
                <Card className="bg-card hover:bg-card/90 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl capitalize">{item}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-card-foreground">Explore your {item}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => setSelectedSection(item)}
                      variant={selectedSection === item ? "default" : "outline"}
                    >
                      View {item}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.section
              key={selectedSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {selectedSection === "playlists" && (
                <>
                  <h2 className="text-3xl font-semibold mb-6">
                    Your Playlists
                  </h2>
                  <UserPlaylists />
                </>
              )}
              {selectedSection === "top tracks" && (
                <h2 className="text-3xl font-semibold mb-6">Your Top Tracks</h2>
                // Add component for top tracks here
              )}
              {selectedSection === "recommendations" && (
                <h2 className="text-3xl font-semibold mb-6">
                  Recommended for You
                </h2>
                // Add component for recommendations here
              )}
            </motion.section>
          </AnimatePresence>
        </motion.main>
      </div>
    </motion.div>
  );
}

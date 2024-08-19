import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaSpotify } from "react-icons/fa";
import { Button } from "./button";

const Footer = () => {
  return (
    <footer className="bg-gray-50 mt-auto py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Sonolise</h3>
            <p className="mt-2 text-gray-600">
              Transform your favorite songs into stunning visuals with Sonolise.
              Create, share, and explore beautiful song artworks.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-semibold text-gray-800">Explore</h4>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About Us
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact Us
            </Link>
          </div>

          {/* Social Media & CTA */}
          <div className="flex flex-col items-start space-y-4">
            <h4 className="font-semibold text-gray-800">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-600 hover:text-indigo-600"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-600 hover:text-indigo-600"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-600 hover:text-indigo-600"
              >
                <FaTwitter />
              </a>
              <a
                href="https://spotify.com"
                className="text-gray-600 hover:text-indigo-600"
              >
                <FaSpotify />
              </a>
            </div>
            <Link href="/signup">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">
          <p>© 2024 Sonolise. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

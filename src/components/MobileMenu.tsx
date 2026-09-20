"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-1/2 -translate-y-1/2 right-6 z-[60] p-2 text-[#111111]"
      >
        <Menu size={28} />
      </button>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col justify-center items-center"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-[#111111]"
            >
              <X size={32} />
            </button>

            {/* Menu Links */}
            <nav className="flex flex-col gap-10 text-center">
              <motion.a 
                href="#concept" 
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl font-en font-semibold tracking-widest text-[#111111]"
              >
                CONCEPT
              </motion.a>
              <motion.a 
                href="#news" 
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-en font-semibold tracking-widest text-[#111111]"
              >
                NEWS
              </motion.a>
              <motion.a 
                href="#menu" 
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-en font-semibold tracking-widest text-[#111111]"
              >
                MENU
              </motion.a>
              <motion.a 
                href="https://www.nichidai3.ed.jp/sankousai2026/access/" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-3xl font-en font-semibold tracking-widest text-[#111111]"
              >
                ACCESS
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

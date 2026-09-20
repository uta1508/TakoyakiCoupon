"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -translate-y-1/2 right-6 z-[60] p-2 w-12 h-12 flex flex-col justify-center items-center"
      >
        <motion.div 
          animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="w-7 h-[2px] bg-[#111111] absolute rounded"
        />
        <motion.div 
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-7 h-[2px] bg-[#111111] absolute rounded"
        />
        <motion.div 
          animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className="w-7 h-[2px] bg-[#111111] absolute rounded"
        />
      </button>

      {/* Full Screen Menu via Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
              animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-40 flex flex-col justify-center items-center"
            >
              {/* Semi-transparent dark background */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
              
              <div className="absolute inset-0 bg-white/80" onClick={() => setIsOpen(false)}></div>

              

              {/* Menu Links */}
              <nav className="relative z-10 flex flex-col gap-10 text-center">
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
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

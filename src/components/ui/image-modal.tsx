'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

const ImageModal = memo(function ImageModal({ isOpen, onClose, imageUrl, alt }: ImageModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] grid place-items-center"
          style={{ position: 'fixed' }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-6 -right-6 z-20 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-3 transition-colors duration-200 shadow-lg border-2 border-gray-700"
            >
              <X size={24} />
            </button>
            
            {/* Image */}
            <Image
              src={imageUrl}
              alt={alt}
              width={1200}
              height={800}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              priority
              unoptimized={imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')}
            />
          </motion.div>
        </motion.div>
      )}
          </AnimatePresence>
    );
});

export default ImageModal; 
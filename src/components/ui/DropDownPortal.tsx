'use client'

import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback } from 'react';

interface DropdownPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement>;
}

const DropdownPortal: React.FC<DropdownPortalProps> = ({ children, isOpen, triggerRef }) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  // Function to detect background color at dropdown position
  const detectBackgroundColor = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownY = rect.bottom + 20;
    
    const elementBelow = document.elementFromPoint(rect.left, dropdownY);
    
    if (elementBelow) {
      const computedStyle = window.getComputedStyle(elementBelow);
      const bgColor = computedStyle.backgroundColor;
      const bgImage = computedStyle.backgroundImage;
      
      if (bgColor === 'rgb(255, 255, 255)' || 
          bgColor === 'rgba(255, 255, 255, 1)' ||
          bgColor === 'white' ||
          bgImage === 'none' && bgColor.includes('255, 255, 255')) {
        setIsDarkBackground(false);
      } else {
        setIsDarkBackground(true);
      }
    }
  }, [triggerRef]);

  useEffect(() => {
    const root = document.getElementById('portal-root') || document.body;
    setPortalRoot(root);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + (rect.width / 2)
      });
      
      detectBackgroundColor();
    }
  }, [isOpen, triggerRef, detectBackgroundColor]);

  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => {
        detectBackgroundColor();
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen, detectBackgroundColor]);

  if (!portalRoot) return null;

  // Dynamic styles based on background with Lucida Bright font
  const dropdownClasses = isDarkBackground
    ? "absolute w-96 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 text-gray-800"
    : "absolute w-96 bg-slate-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-700/50 text-white";

  return createPortal(
    isOpen ? (
      <div
        className={dropdownClasses}
        style={{
          top: position.top,
          left: position.left,
          zIndex: 2147483647,
          transform: 'translateX(-50%)',
          transition: 'background-color 0.2s ease, color 0.2s ease',
          fontFamily: '"Lucida Bright", Georgia, serif'
        }}
      >
        {children}
      </div>
    ) : null,
    portalRoot
  );
};

export default DropdownPortal;
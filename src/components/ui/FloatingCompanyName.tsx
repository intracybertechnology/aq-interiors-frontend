import { useState } from 'react';

interface FloatingCompanyNameProps {
  className?: string;
}

const FloatingCompanyName: React.FC<FloatingCompanyNameProps> = ({ className }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  
  const companyName = "AL QETHAA AL QADEEMA"
  const letters = companyName.split('');

  const getLetterStyle = (index: number) => {
    const isHovered = hoveredIndex === index;
    const isAdjacent = Math.abs(hoveredIndex - index) === 1;
    const isSecondAdjacent = Math.abs(hoveredIndex - index) === 2;
    
    let transform = 'translateY(0px) scale(1)';
    let color = '#FFFFFF';
    
    if (isHovered) {
      transform = 'translateY(-6px) scale(1.08)';
      color = '#E0E0E0';
    } else if (isAdjacent) {
      transform = 'translateY(-3px) scale(1.04)';
      color = '#F0F0F0';
    } else if (isSecondAdjacent) {
      transform = 'translateY(-1px) scale(1.02)';
    }

    return {
      transform,
      color,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-block',
      cursor: 'pointer'
    };
  };

  return (
    <div 
      className={`ml-3 transition-all duration-700 group-hover:scale-105 select-none hidden md:block ${className || ''}`}
      style={{
        fontFamily: '"Lucida Bright", Georgia, serif',
        fontSize: '1.125rem',
        fontWeight: '600',
        letterSpacing: '0.5px',
        backgroundColor: 'rgba(128, 128, 128, 0.85)',
        padding: '10px 20px',
        borderRadius: '8px',
        display: 'inline-block',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(4px)'
      }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          style={getLetterStyle(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(-1)}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </div>
  );
};

export default FloatingCompanyName;
import React from 'react';

export const MehndiArt: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 1000 1000" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Large Central Paisley Left */}
        <path d="M150 400C150 250 250 200 300 200C350 200 400 250 400 350C400 450 300 550 250 600C200 650 100 700 100 800C100 900 200 950 300 950C400 950 500 850 500 750C500 650 450 600 400 550" opacity="0.6" />
        <path d="M180 430C180 300 250 260 280 260C310 260 350 300 350 380C350 460 280 540 230 590" opacity="0.4" />
        
        {/* Floral Swirl Top Right */}
        <path d="M800 100C850 150 850 250 800 300C750 350 650 350 600 300C550 250 550 150 600 100C650 50 750 50 800 100Z" opacity="0.5" />
        <path d="M700 200C700 150 750 120 800 150C850 180 820 250 750 250C680 250 650 200 700 150" opacity="0.3" />
        <circle cx="700" cy="200" r="10" fill="currentColor" opacity="0.2" />

        {/* Bottom Right Paisley */}
        <path d="M850 700C850 600 750 550 700 550C650 550 600 600 600 700C600 800 700 900 750 950C800 1000 900 1050 900 1150" opacity="0.6" />
        
        {/* Decorative Dotted Lines */}
        <path d="M100 100Q200 50 300 100" strokeDasharray="5 10" opacity="0.4" />
        <path d="M900 900Q800 950 700 900" strokeDasharray="5 10" opacity="0.4" />
        
        {/* Intricate Swirls */}
        <path d="M500 500C550 450 600 450 650 500C700 550 700 650 650 700C600 750 500 750 450 700" opacity="0.3" />
        <path d="M520 520C540 500 560 500 580 520C600 540 600 560 580 580" opacity="0.2" />
        
        {/* Additional Small Motifs */}
        <circle cx="200" cy="200" r="5" fill="currentColor" opacity="0.3" />
        <circle cx="215" cy="215" r="3" fill="currentColor" opacity="0.2" />
        <circle cx="230" cy="230" r="2" fill="currentColor" opacity="0.1" />
      </g>
    </svg>
  );
};

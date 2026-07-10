import { useState, useEffect } from 'react';
import './AnimatedBackground.css';

const techIcons = ['📱', '💻', '🔧', '🔋', '⚙️', '🖥️', '🔌', '📡', '🛠️', '💡', '📟', '🔍', '🖱️', '⌨️', '💾'];

function AnimatedBackground() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const generated = [];
    for (let i = 0; i < 20; i++) {
      generated.push({
        id: i,
        icon: techIcons[Math.floor(Math.random() * techIcons.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 20 + Math.random() * 30,
        duration: 15 + Math.random() * 25,
        delay: Math.random() * -20,
        opacity: 0.06 + Math.random() * 0.08,
      });
    }
    setItems(generated);
  }, []);

  return (
    <div className="animated-bg">
      {/* Blurred gradient shapes */}
      <div className="animated-bg-shape shape-1"></div>
      <div className="animated-bg-shape shape-2"></div>
      <div className="animated-bg-shape shape-3"></div>
      <div className="animated-bg-shape shape-4"></div>
      
      {/* Floating tech icons */}
      {items.map((item) => (
        <span
          key={item.id}
          className="floating-icon"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}px`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            opacity: item.opacity,
          }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}

export default AnimatedBackground;

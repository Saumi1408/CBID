import React, { useMemo } from 'react';

const SparkleBackground: React.FC = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 1}s`, // 1s to 3s
            animationDelay: `${Math.random() * 3}s`, // 0s to 3s
            size: Math.floor(Math.random() * 2 + 1), // 1px or 2px
        }));
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute bg-cyan-400 rounded-full animate-twinkle"
                    style={{
                        top: p.top,
                        left: p.left,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDuration: p.animationDuration,
                        animationDelay: p.animationDelay,
                    }}
                >
                </div>
            ))}
            <style>
                {`
                @keyframes twinkle {
                    0%, 100% {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1);
                    }
                }
                .animate-twinkle {
                    animation-name: twinkle;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                }
                `}
            </style>
        </div>
    );
};

export default SparkleBackground;
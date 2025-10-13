import React, { useMemo } from 'react';
import RupeeSignIcon from './icons/RupeeSignIcon';

const MoneyFlowBackground: React.FC = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 15 + 10}s`, // 10s to 25s
            animationDelay: `${Math.random() * 10}s`, // 0s to 10s
            opacity: Math.random() * 0.1 + 0.02, // 0.02 to 0.12
            size: Math.random() * 24 + 16, // 16px to 40px
        }));
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute text-cyan-400 animate-float-up"
                    style={{
                        left: p.left,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDuration: p.animationDuration,
                        animationDelay: p.animationDelay,
                        opacity: p.opacity,
                    }}
                >
                    <RupeeSignIcon />
                </div>
            ))}
            <style>
                {`
                @keyframes float-up {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                    }
                }
                .animate-float-up {
                    animation-name: float-up;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
                `}
            </style>
        </div>
    );
};

export default MoneyFlowBackground;
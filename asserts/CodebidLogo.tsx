import React from 'react';

interface CodebidLogoProps {
    isHeader?: boolean;
}

const CodebidLogo: React.FC<CodebidLogoProps> = ({ isHeader = false }) => {
    return (
        <div className={`flex items-center justify-center font-roboto-mono select-none ${isHeader ? 'text-2xl' : 'text-5xl'}`}>
            <span className="font-bold tracking-wider">
                <span className="text-slate-100">CODE</span>
                <span className="text-cyan-400" style={{ textShadow: '0 0 8px #22d3ee, 0 0 16px #22d3ee' }}>BID</span>
            </span>
        </div>
    )
}

export default CodebidLogo;

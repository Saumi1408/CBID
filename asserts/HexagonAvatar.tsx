import React from 'react';

interface HexagonAvatarProps {
    avatarUrl: string;
    rank: number;
}

const getRankColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-400/80';
    if (rank === 2) return 'border-slate-400/80';
    if (rank === 3) return 'border-orange-500/80';
    return 'border-slate-600/80';
}

const HexagonAvatar: React.FC<HexagonAvatarProps> = ({ avatarUrl, rank }) => {
    const borderColor = getRankColor(rank);

    return (
        <div className="relative w-14 h-16 flex items-center justify-center">
            <div
                className={`w-full h-full transition-colors duration-300 ${borderColor}`}
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    borderWidth: '2px',
                }}
            >
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                />
            </div>
        </div>
    );
};

export default HexagonAvatar;

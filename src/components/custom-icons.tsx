import Image from 'next/image';

export const CursorIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`relative invert dark:invert-0 ${className}`} style={style}>
        <Image
            src="/icons/cursor.png"
            alt="Cursor"
            fill
            sizes="96px"
            className="object-contain"
        />
    </div>
);

export const AntigravityIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`relative ${className}`} style={style}>
        <Image
            src="/icons/antigravity.png"
            alt="Google Antigravity"
            fill
            sizes="96px"
            className="object-contain"
        />
    </div>
);

'use client';

const AiToolIcon = ({ name }: { name: string }) => {
    const initial = name.charAt(0).toUpperCase();
    return (
      <div className="w-full h-full flex items-center justify-center bg-foreground text-background rounded-md font-bold text-xl">
        {initial}
      </div>
    );
};

export default AiToolIcon;

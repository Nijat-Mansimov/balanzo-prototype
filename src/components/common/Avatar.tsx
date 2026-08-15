import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  borderColor?: string;
  ring?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl font-bold',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  initials,
  size = 'md',
  className = '',
  borderColor = 'border-white dark:border-neutral-900',
  ring = true,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const calculatedInitials = initials || name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Consistent pleasant pastel bg for initials
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgGradients = [
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
  ];
  const gradient = bgGradients[hash % bgGradients.length];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 ${
        ring ? `border-2 ${borderColor}` : ''
      } ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-tr ${gradient} text-white font-semibold shadow-inner`}>
          {calculatedInitials}
        </div>
      )}
    </div>
  );
};

export const AvatarStack: React.FC<{
  members: Array<{ id: string; name: string; avatarUrl?: string; initials?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}> = ({ members, max = 3, size = 'sm', className = '' }) => {
  const visible = members.slice(0, max);
  const remainder = members.length - max;

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {visible.map((member) => (
        <Avatar
          key={member.id}
          src={member.avatarUrl}
          name={member.name}
          initials={member.initials}
          size={size}
        />
      ))}
      {remainder > 0 && (
        <div
          className={`relative z-10 flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold border-2 border-white dark:border-neutral-900 ${
            size === 'xs' ? 'w-6 h-6 text-[9px]' : size === 'sm' ? 'w-8 h-8 text-[11px]' : 'w-10 h-10 text-xs'
          }`}
        >
          +{remainder}
        </div>
      )}
    </div>
  );
};

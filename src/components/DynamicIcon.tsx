
import React from 'react';
import { icons, HelpCircle, type LucideProps } from 'lucide-react';

// The keys of `icons` are the icon names in PascalCase
type IconName = keyof typeof icons;

interface DynamicIconProps extends LucideProps {
  name: IconName | string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const iconName = name as IconName;
  const IconComponent = icons[iconName];

  if (!IconComponent) {
    // Fallback icon
    return <HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default DynamicIcon;

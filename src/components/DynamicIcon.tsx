
import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface DynamicIconProps extends LucideIcons.LucideProps {
  name: IconName | string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const iconName = name as IconName;
  const IconComponent = LucideIcons[iconName];

  if (!IconComponent) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default DynamicIcon;

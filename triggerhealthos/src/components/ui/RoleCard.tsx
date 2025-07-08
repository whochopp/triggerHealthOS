import React from 'react';
import { RoleCardProps } from '../../types';

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`role-card ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">{title}</h2>
        <p className="text-secondary-600">{description}</p>
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default RoleCard;
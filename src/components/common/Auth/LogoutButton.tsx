import React, { useState } from 'react';
import { useAuth } from '../../../app/services/api/useAuth';
import { FaChevronDown, FaChevronRight, FaHome, FaUserCog, FaSignOutAlt, FaMusic, FaWarehouse, FaTools, FaUsers } from 'react-icons/fa';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode

  onClick?: () => void
   style?: React.CSSProperties;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  icon=<FaSignOutAlt />,
  className = "",
  children = 'Sair',
    style = {},
      onClick,
    
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
  const { logout } = useAuth();
  const defaultStyle: React.CSSProperties = {
    backgroundColor: '#7a7a7a',
    border: 'none',
    color: '#ffffff',

  };

  const buttonStyle: React.CSSProperties = {
    ...defaultStyle,
  
    opacity: isActive ? 0.7 : isHovered ? 0.9 : 1,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
 
  };
  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
     <button
      className={`button is-info is-rounded is-responsive is-small-mobile ${className}`}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
     
      onClick={handleLogout}
     
    >
          <span className="icon">{icon}</span>
      <span>{children}</span>
     
    </button>
  );
};
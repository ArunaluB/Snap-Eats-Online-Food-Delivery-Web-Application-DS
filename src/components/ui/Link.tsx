import React from 'react';

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

export const Link: React.FC<LinkProps> = ({ 
  to, 
  children, 
  className = '', 
  activeClassName = ''
}) => {
  // Simple client-side routing simulation
  const isActive = window.location.pathname === to;
  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`;
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    
    // Dispatch a custom event to notify the app of the route change
    window.dispatchEvent(new CustomEvent('locationchange', { detail: { path: to } }));
  };
  
  return (
    <a href={to} className={combinedClassName} onClick={handleClick}>
      {children}
    </a>
  );
};
import React from 'react';
import './styles.css';

const Button = ({ className, ...props }) => {
  return <button {...props} className={`button ${className}`} />;
};

export default Button;
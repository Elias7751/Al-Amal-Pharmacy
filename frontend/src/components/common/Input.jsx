import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`input-container ${containerClassName}`}>
      {label && <label className="input-label">{label}</label>}
      <input 
        ref={ref}
        type={type} 
        className={`input-field ${error ? 'input-error' : ''} ${className}`} 
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

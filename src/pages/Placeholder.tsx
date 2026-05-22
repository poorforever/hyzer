import React from 'react';

const Placeholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <h2 style={{ color: 'var(--text-secondary)' }}>{title}</h2>
    </div>
  );
};

export default Placeholder;

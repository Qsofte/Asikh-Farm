import React from 'react';
import VendorOrderForm from './VendorOrder';

const VendorOrderStandalone = () => {
  // Styles for the standalone page
  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    paddingTop: '2rem'
  };

  return (
    <div style={pageStyle}>
      <VendorOrderForm />
    </div>
  );
};

export default VendorOrderStandalone;

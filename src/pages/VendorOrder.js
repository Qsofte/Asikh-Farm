import React, { useState, useEffect } from 'react';

const VendorOrder = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(''); // PIN error
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ 
    variantId: '', 
    quantity: 1, 
    deliveryDate: '', 
    address1: '',
    city: '',
    state: '',
    postalCode: '',
    email: '',
    phone: '',
    vendor: '',
    contactName: ''
  });
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  // Load products list after authentication
  useEffect(() => {
    if (authenticated) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(() => setProducts([]));
    }
  }, [authenticated]);

  // Main container: full-width with padding
  const containerStyle = {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    position: 'relative',
    zIndex: 1
  };

  // Card style: centered with consistent padding
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '2rem',
    maxWidth: '550px',
    margin: '0 auto'
  };

  const headerStyle = {
    marginBottom: '1.5rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '1rem'
  };

  const formGroupStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#4a8f29',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%'
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/vendor/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setAuthenticated(true);
      } else {
        setError('Invalid PIN');
      }
    } catch (err) {
      setError('Error verifying PIN');
    }
  };

  const handleOrderChange = e => {
    const { name, value } = e.target;
    console.log('handleOrderChange ➡️', name, value);
    // Update form data for each field
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async e => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setOrderDetails(null);
    
    // Combine address fields for the API
    const fullAddress = `${formData.address1}, ${formData.city}, ${formData.state} ${formData.postalCode}`;
    
    try {
      const res = await fetch('/api/vendor/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          address: fullAddress // Server expects a single address field
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSubmitSuccess(`Order #${data.orderNumber} placed successfully`);
        setOrderDetails(data);
        // Only reset product/order fields, not vendor/contact fields
        setFormData(prev => ({
          ...prev,
          variantId: '',
          quantity: 1,
          deliveryDate: '',
          address1: '',
          city: '',
          state: '',
          postalCode: ''
        }));
      } else {
        setSubmitError(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setSubmitError('Error placing order. Please try again.');
    }
  };

  // PIN authentication screen
  if (!authenticated) {
    return (
      <div style={containerStyle}>
        <div style={{...cardStyle, maxWidth: '400px'}}>
          <div style={headerStyle}>
            <h2>Vendor Authentication</h2>
            <p>Please enter your PIN to access the order form</p>
          </div>
          <form onSubmit={handleVerify}>
            <div style={formGroupStyle}>
              <label htmlFor="pin" style={labelStyle}>PIN</label>
              <input type="password" id="pin" value={pin}
                onChange={e => setPin(e.target.value)} placeholder="Enter your PIN"
                required maxLength={4} style={inputStyle} />
            </div>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            <button type="submit" style={buttonStyle}>Verify PIN</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Bulk Order Form</h2>
        {submitError && <div style={{ color: 'red', marginBottom: '1rem' }}>{submitError}</div>}
        {submitSuccess && (
          <div style={{ 
            color: 'green', 
            marginBottom: '1.5rem', 
            padding: '1rem',
            backgroundColor: '#f0f9f0',
            borderRadius: '4px',
            border: '1px solid #c3e6cb'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{submitSuccess}</div>
            {orderDetails && (
              <div>
                <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>
                  Shopify Order: #{orderDetails.orderNumber}
                </p>
                {orderDetails.notification && (
                  <p style={{ 
                    margin: '0.25rem 0', 
                    fontSize: '0.9rem',
                    color: orderDetails.notification.sent ? 'green' : '#d97706'
                  }}>
                    {orderDetails.notification.sent 
                      ? '✓ WhatsApp notification sent to vendor' 
                      : '⚠️ WhatsApp notification could not be sent'}
                  </p>
                )}
                {orderDetails.notification && !orderDetails.notification.sent && (
                  <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#666' }}>
                    Please contact the vendor directly
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleOrderSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="vendor" style={labelStyle}>Trader Name</label>
            {/* Trader Name (debug: controlled input) */}
            <input type="text" name="vendor" id="vendor" value={formData.vendor}
              onChange={handleOrderChange} required style={inputStyle}
              placeholder="Trading company name" />
            {/* DEBUG: show current Trader Name state */}
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
              State: {formData.vendor}
            </div>
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="contactName" style={labelStyle}>Sales Person</label>
            <input type="text" name="contactName" id="contactName" value={formData.contactName}
              onChange={handleOrderChange} required style={inputStyle}
              placeholder="Person handling this order" />
          </div>
          
          {/* Contact Info - Email and Phone in a responsive layout */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px' }}>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input type="email" name="email" id="email" value={formData.email}
                onChange={handleOrderChange} required style={inputStyle}
                placeholder="contact@example.com" />
            </div>
            <div style={{ flex: '1 1 240px' }}>
              <label htmlFor="phone" style={labelStyle}>Phone</label>
              <input type="tel" name="phone" id="phone" value={formData.phone}
                onChange={handleOrderChange} style={inputStyle}
                placeholder="+64 21 123 4567" />
            </div>
          </div>
          {/* Product and Order Details in a responsive layout */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '2 1 300px' }}>
              <label htmlFor="variantId" style={labelStyle}>Product Variant</label>
              <select name="variantId" id="variantId" value={formData.variantId}
                onChange={handleOrderChange} required style={inputStyle}>
                <option value="" disabled>Select variant</option>
                {products.flatMap(p => p.variants).map(v => (
                  <option key={v.id} value={v.id}>{v.title}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: '1 1 100px' }}>
              <label htmlFor="quantity" style={labelStyle}>Quantity</label>
              <input type="number" name="quantity" id="quantity" value={formData.quantity}
                onChange={handleOrderChange} min="1" style={inputStyle} />
            </div>
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="deliveryDate" style={labelStyle}>Delivery Date</label>
            <input type="date" name="deliveryDate" id="deliveryDate" value={formData.deliveryDate}
              onChange={handleOrderChange} required style={inputStyle} />
          </div>
          {/* Delivery Address - Split into multiple fields */}
          <div style={formGroupStyle}>
            <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Delivery Address</label>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <input type="text" name="address1" id="address1" value={formData.address1}
                onChange={handleOrderChange} required style={inputStyle}
                placeholder="Street address" />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 140px' }}>
                <input type="text" name="city" id="city" value={formData.city}
                  onChange={handleOrderChange} required style={inputStyle}
                  placeholder="City" />
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <input type="text" name="state" id="state" value={formData.state}
                  onChange={handleOrderChange} required style={inputStyle}
                  placeholder="State/Province" />
              </div>
            </div>
            
            <div>
              <input type="text" name="postalCode" id="postalCode" value={formData.postalCode}
                onChange={handleOrderChange} required style={inputStyle}
                placeholder="Postal code" />
            </div>
          </div>
          <button type="submit" style={buttonStyle}>Place Order</button>
        </form>
      </div>
    </div>
  );
};

export default VendorOrder;

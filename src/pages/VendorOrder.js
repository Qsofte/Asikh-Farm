import React, { useState, useEffect } from 'react';
import './VendorOrder.css';

const VendorOrder = () => {
  const [pin, setPin] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vendorData, setVendorData] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [order, setOrder] = useState({
    quantity: 1,
    deliveryDate: new Date().toISOString().split('T')[0],
    address: ''
  });

  // PIN verification handler
  const handleVerifyPin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/vendor/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      
      if (!response.ok) {
        throw new Error('Server error during PIN verification');
      }

      const data = await response.json();
      if (!data.valid) {
        throw new Error(data.error || 'Invalid PIN');
      }

      setVendorData({
        vendor: data.vendor,
        contactName: data.contactName,
        phone: data.phone,
        email: data.email
      });
      setVerified(true);
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products after PIN verification
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        // Transform products data to include variants
        const variants = data.flatMap(product => 
          product.variants.map(v => ({
            id: v.id,
            title: `${product.title} - ${v.title}`,
            price: v.priceV2.amount
          }))
        );
        
        setProducts(variants);
        if (variants.length > 0) {
          setSelectedVariant(variants[0].id);
        }
      } catch (err) {
        setError('Failed to load products. Please try again.');
      }
    };

    if (verified) {
      fetchProducts();
    }
  }, [verified]);

  // Handle order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/vendor/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedVariant,
          quantity: parseInt(order.quantity),
          deliveryDate: order.deliveryDate,
          address: order.address,
          vendor: vendorData.vendor,
          contactName: vendorData.contactName,
          email: vendorData.email
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create order');
      }

      const result = await response.json();
      setSuccess(`Order #${result.orderName || result.orderId} created successfully!`);
      setOrder({
        quantity: 1,
        deliveryDate: new Date().toISOString().split('T')[0],
        address: ''
      });
    } catch (err) {
      setError(err.message || 'Order submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (!verified) {
    return (
      <div className="vendor-container">
        <div className="vendor-card">
          <div className="vendor-header">
            <h2>Vendor Authentication</h2>
            <p>Please enter your PIN to access the order form</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleVerifyPin}>
            <div className="form-group">
              <label htmlFor="pin">PIN</label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your PIN"
                required
                maxLength={4}
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify PIN'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Order form after verification
  return (
    <div className="vendor-container">
      <div className="vendor-card">
        <div className="vendor-header">
          <h2>Bulk Order Form</h2>
          <div className="vendor-info">
            <p><strong>Vendor:</strong> {vendorData.vendor}</p>
            <p><strong>Contact:</strong> {vendorData.contactName}</p>
            <p><strong>Email:</strong> {vendorData.email}</p>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmitOrder}>
          <div className="form-group">
            <label htmlFor="variant">Product Variant</label>
            <select
              id="variant"
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              required
            >
              {products.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.title} (₹{variant.price})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity (Boxes)</label>
            <input
              type="number"
              id="quantity"
              value={order.quantity}
              onChange={(e) => setOrder({...order, quantity: Math.max(1, parseInt(e.target.value))})}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="deliveryDate">Estimated Delivery Date</label>
            <input
              type="date"
              id="deliveryDate"
              value={order.deliveryDate}
              onChange={(e) => setOrder({...order, deliveryDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              value={order.address}
              onChange={(e) => setOrder({...order, address: e.target.value})}
              placeholder="Enter complete delivery address with PIN code"
              rows="3"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorOrder;

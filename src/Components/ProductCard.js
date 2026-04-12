import React from 'react';

const ProductCard = ({
  title,
  image,
  stockText,
  stockClassName,
  options,
  selectedOption,
  price,
  originalPrice,
  discountPercent,
  promoText,
  quantity,
  onQuantityChange,
  onOptionChange,
  onBuyNow,
  onProductInfo,
  isProcessing,
  isOutOfStock,
  checkoutError,
}) => {
  const showVariantControls = options && options.length > 0;
  const showBuyButton = !!onBuyNow;

  return (
    <div className="border rounded-lg overflow-hidden shadow-md flex flex-col h-full">
      {/* Zone 1: Image */}
      <div className="relative w-full bg-gray-100" style={{ paddingTop: '75%' }}>
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Zone 2: Content */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Title + stock badge */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold pr-2">{title}</h2>
          {stockText && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${stockClassName || 'text-green-600'}`}
            >
              {stockText}
            </span>
          )}
        </div>

        {/* Variant selector + quantity */}
        {showVariantControls && (
          <div className="mb-4 flex items-center space-x-4">
            <div className="flex-1">
              <label
                htmlFor={`variant-select-${title}`}
                className="block font-gilroy-semibold mb-1"
              >
                Option:
              </label>
              <select
                id={`variant-select-${title}`}
                value={selectedOption || ''}
                onChange={(e) => onOptionChange && onOptionChange(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
              >
                {options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-20 flex-shrink-0">
              <label
                htmlFor={`quantity-${title}`}
                className="block font-gilroy-semibold mb-1"
              >
                Qty:
              </label>
              <input
                type="number"
                id={`quantity-${title}`}
                min="1"
                value={quantity ?? ''}
                placeholder="1"
                onChange={(e) => onQuantityChange && onQuantityChange(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-green"
              />
            </div>
          </div>
        )}

        {/* Zone 3: Footer — price + action, always pushed to bottom */}
        <div className="mt-auto">
          {/* Price block — reserved height for all price rows */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              {/* Current price row */}
              <p className="text-lg font-bold text-primary-green">
                {price || ''}
                {discountPercent ? (
                  <span className="ml-2 bg-accent-yellow text-primary-dark text-xs px-2 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                ) : (
                  /* Invisible placeholder keeps badge row height consistent */
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full invisible">
                    0% OFF
                  </span>
                )}
              </p>
              {/* Original price — min-h preserves row when absent */}
              <p className="text-sm text-gray-500 line-through min-h-[1.25rem]">
                {originalPrice || ''}
              </p>
              {/* Promo text — min-h preserves row when absent */}
              <p className="text-xs text-primary-green mt-1 min-h-[1rem]">
                {promoText || ''}
              </p>
            </div>

            {showBuyButton && (
              <button
                onClick={onBuyNow}
                disabled={isProcessing || isOutOfStock}
                className={`px-3 py-2 rounded transition-colors ml-3 flex-shrink-0 ${
                  isOutOfStock
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-primary-green text-white hover:bg-green-700'
                } disabled:opacity-50`}
              >
                {isProcessing ? 'Processing...' : isOutOfStock ? 'Out of Stock' : 'Buy Now'}
              </button>
            )}
          </div>

          {/* Checkout error */}
          {checkoutError && (
            <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
              <div className="flex items-start">
                <svg
                  className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p>{checkoutError}</p>
                  <p className="mt-1 text-xs text-gray-700">
                    Please click the{' '}
                    <span className="font-medium text-primary-green">
                      Product Information
                    </span>{' '}
                    link below for more details and availability.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Product Information link */}
          {onProductInfo && (
            <div className="mt-3 border-t pt-2">
              <a
                href={onProductInfo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-green flex items-center w-full justify-between font-medium hover:underline"
              >
                Product Information
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

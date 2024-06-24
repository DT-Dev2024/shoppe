import React, { useState } from "react";

interface QuantityControllerProps {
  initialQuantity?: number;
  min?: number;
  max?: number;
}

const QuantityController: React.FC<QuantityControllerProps> = ({ initialQuantity = 1, min = 1, max = 99 }) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const handleDecrease = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, min));
  };

  const handleIncrease = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, max));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setQuantity(Math.min(Math.max(value, min), max));
    }
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleDecrease}
        className="rounded-l-sm border bg-gray-200 px-2 py-1 hover:bg-gray-300"
      >
        –
      </button>
      <input
        type="text"
        value={quantity}
        onChange={handleChange}
        className="h-11 w-[60px] border-b border-t border-gray-300 bg-gray-100 text-center text-[18px]"
      />
      <button
        type="button"
        onClick={handleIncrease}
        className="rounded-r-sm border bg-gray-200 px-2 py-1 hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
};

export default QuantityController;

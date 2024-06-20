import React, { useState } from "react";

interface QuantityControllerProps {
  initialQuantity?: number;
  min?: number;
  max?: number;
}

const QuantityController: React.FC<QuantityControllerProps> = ({
  initialQuantity = 1,
  min = 1,
  max = 99,
}) => {
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
        className="px-4 py-2 bg-gray-200 border rounded-l-sm hover:bg-gray-300"
      >
        –
      </button>
      <input
        type="text"
        value={quantity}
        onChange={handleChange}
        className="h-12 text-2xl text-center border-t border-b border-gray-300 w-[50px] bg-gray-100"
      />
      <button
        type="button"
        onClick={handleIncrease}
        className="px-4 py-2 bg-gray-200 border rounded-r-sm hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
};

export default QuantityController;

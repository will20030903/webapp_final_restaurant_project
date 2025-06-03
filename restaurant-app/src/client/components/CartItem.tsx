// src/client/components/CartItem.tsx
// Import or define the CI type
// Define the CI type here if it doesn't exist elsewhere
type CI = {
  type: "dish" | "set";
  item: {
    dName?: string;
    dPrice?: number;
    sName?: string;
    sPrice?: number;
  };
  quantity: number;
};

interface Props {
  cartItem: CI;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}

const CartItem: React.FC<Props> = ({ cartItem, onRemove, onUpdateQty }) => {
  // idx 已移除，如果確實不需要，就不要再出現在這裡
  const name =
    cartItem.type === "dish"
      ? cartItem.item.dName
      : cartItem.item.sName;
  const price =
    cartItem.type === "dish"
      ? cartItem.item.dPrice
      : cartItem.item.sPrice;
  const subTotal = (price ?? 0) * cartItem.quantity;

  return (
    <div className="flex items-center justify-between bg-white border p-4 rounded shadow">
      <div>
        <p className="text-lg font-medium">{name}</p>
        <p className="text-gray-600">單價：NT$ {price}</p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          min={1}
          value={cartItem.quantity}
          onChange={(e) => onUpdateQty(Math.max(1, +e.target.value))}
          className="w-16 border px-2 py-1 rounded"
        />
        <p className="w-24 text-right">小計:NT$ {subTotal}</p>
        <button onClick={onRemove} className="text-red-600 hover:underline">
          刪除
        </button>
      </div>
    </div>
  );
};

export default CartItem;

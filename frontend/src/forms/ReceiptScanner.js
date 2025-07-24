import { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
import { toast } from "react-hot-toast"; // ✅ Toast import

export default function ReceiptScanner() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    const { data: { text } } = await Tesseract.recognize(image, "eng");
    setText(text);
    setLoading(false);
  };

  const handleCategorize = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);

      const res = await axios.post("http://localhost:8000/ocr/parse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Categorization failed", err);
    }
  };

  const handleAddTransaction = async (item) => {
    try {
      await axios.post("http://localhost:8000/transactions/add", item);
      toast.success("Added to transactions ✅"); // ✅ toast here
    } catch (err) {
      toast.error("Failed to add ❌");
      console.error("Add single transaction failed", err);
    }
  };

  const handleAddAllTransactions = async () => {
    try {
      await axios.post("http://localhost:8000/transactions/add-bulk", { items });
      toast.success("All transactions added ✅"); // ✅ toast here
    } catch (err) {
      toast.error("Bulk add failed ❌");
      console.error("Add all transactions failed", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">🧾 Receipt OCR Scanner</h2>

      <input type="file" onChange={handleImageChange} className="mb-4" />
      <button onClick={handleScan} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Scanning..." : "Scan Receipt"}
      </button>

      {text && (
        <>
          <textarea
            value={text}
            readOnly
            className="w-full mt-4 p-2 border rounded"
            rows={6}
          ></textarea>
          <button
            onClick={handleCategorize}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Extract Transactions
          </button>
        </>
      )}

      {items.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Extracted Items</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Item</th>
                <th className="border px-2 py-1">Quantity</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.name}</td>
                  <td className="border px-2 py-1">{item.quantity}</td>
                  <td className="border px-2 py-1">₹{item.price}</td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleAddTransaction(item)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleAddAllTransactions}
            className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
          >
            Add All to Transactions
          </button>
        </div>
      )}
    </div>
  );
}

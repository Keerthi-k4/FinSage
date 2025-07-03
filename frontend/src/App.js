import TransactionForm from "./TransactionForm";

function App() {
  const currentUserId = 2; // Replace with actual user ID logic

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <TransactionForm user_id={currentUserId} />
    </div>
  );
}

export default App;

import TransactionForm from "../forms/TransactionForm";
import TransactionTable from "../forms/TransactionTable";

export default function TransactionPage() {
  const currentUserId = 2;

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-8">
      <TransactionForm user_id={currentUserId} />
      <TransactionTable />
    </div>
  );
}

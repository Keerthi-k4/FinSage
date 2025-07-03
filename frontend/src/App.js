import UserForm from "./UserForm";
import TransactionForm from "./TransactionForm";
import SummaryDashboard from "./SummaryDashboard";
import ChatBox from "./ChatBox";
import TransactionTable from "./TransactionTable"; // ✅ Add this

function App() {
  const currentUserId = 2;

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-8">
      <UserForm />
      <TransactionForm user_id={currentUserId} />
      <SummaryDashboard user_id={currentUserId} />
      <TransactionTable /> {/* ✅ Shows table + categorize input */}
      <ChatBox />
    </div>
  );
}

export default App;

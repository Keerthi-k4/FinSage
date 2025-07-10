import SummaryDashboard from "../forms/SummaryDashboard";

export default function SummaryPage() {
  const currentUserId = 2; // You can make this dynamic

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <SummaryDashboard user_id={currentUserId} />
    </div>
  );
}

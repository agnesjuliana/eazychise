import AppLayout from "@/components/app-layout";
import withAuth from "@/lib/withAuth";

function NotificationPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Recent Notifications
            </h2>
            <p className="text-gray-600">
              Stay updated with your franchise activities
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default withAuth(NotificationPage, "FRANCHISEE");

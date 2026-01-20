import { motion } from "framer-motion";

const statusStyles = {
  "In Review": "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  Interview: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Offer: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  Rejected: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Applied: "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
  Pending: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
  Shortlisted: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
};

const RecentApplications = ({ applications = [] }) => {
  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Applications
        </h2>
        <button className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="text-foreground-muted border-b border-border">
            <tr>
              <th className="py-3 text-left font-medium">Company</th>
              <th className="py-3 text-left font-medium">Role</th>
              <th className="py-3 text-left font-medium">Date</th>
              <th className="py-3 text-left font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {applications.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-foreground-muted">
                  No applications yet.
                </td>
              </tr>
            ) : (
              applications.map((app, index) => (
                <motion.tr
                  key={app._id || index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="hover:bg-background-muted transition"
                >
                  <td className="py-4 font-medium text-foreground">
                    {app.job?.company || "Unknown Company"}
                  </td>
                  <td className="text-foreground-muted">
                    {app.job?.title || "Unknown Role"}
                  </td>
                  <td className="text-foreground-muted">
                    {formatDate(app.createdAt)}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[app.status] || "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplications;

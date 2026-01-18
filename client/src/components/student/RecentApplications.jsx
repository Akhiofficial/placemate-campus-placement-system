import { motion } from "framer-motion";

const statusStyles = {
  "In Review": "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  Interview: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Offer: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  Rejected: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const RecentApplications = () => {
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
            {/* Row 1 */}
            <motion.tr
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hover:bg-background-muted transition"
            >
              <td className="py-4 font-medium text-foreground">
                TechCorp Inc.
              </td>
              <td className="text-foreground-muted">
                Frontend Developer
              </td>
              <td className="text-foreground-muted">
                Oct 24, 2023
              </td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles["In Review"]
                    }`}
                >
                  In Review
                </span>
              </td>
            </motion.tr>

            {/* Row 2 */}
            <motion.tr
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="hover:bg-background-muted transition"
            >
              <td className="py-4 font-medium text-foreground">
                Cloudify
              </td>
              <td className="text-foreground-muted">
                Backend Engineer
              </td>
              <td className="text-foreground-muted">
                Oct 18, 2023
              </td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles.Interview
                    }`}
                >
                  Interview
                </span>
              </td>
            </motion.tr>

            {/* Row 3 */}
            <motion.tr
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="hover:bg-background-muted transition"
            >
              <td className="py-4 font-medium text-foreground">
                DataWorks
              </td>
              <td className="text-foreground-muted">
                Data Analyst
              </td>
              <td className="text-foreground-muted">
                Oct 12, 2023
              </td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles.Offer
                    }`}
                >
                  Offer
                </span>
              </td>
            </motion.tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplications;

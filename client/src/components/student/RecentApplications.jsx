import { motion } from "framer-motion";

const statusStyles = {
  "In Review": "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  Interview: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Offer: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  Rejected: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const RecentApplications = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Recent Applications
        </h2>
        <button className="text-blue-600 text-sm font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 text-left font-medium">Company</th>
              <th className="py-3 text-left font-medium">Role</th>
              <th className="py-3 text-left font-medium">Date</th>
              <th className="py-3 text-left font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {/* Row 1 */}
            <motion.tr
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <td className="py-4 font-medium text-slate-800 dark:text-slate-100">
                TechCorp Inc.
              </td>
              <td className="text-slate-600 dark:text-slate-300">
                Frontend Developer
              </td>
              <td className="text-slate-600 dark:text-slate-300">
                Oct 24, 2023
              </td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusStyles["In Review"]
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
              className="hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <td className="py-4 font-medium text-slate-800 dark:text-slate-100">
                Cloudify
              </td>
              <td className="text-slate-600 dark:text-slate-300">
                Backend Engineer
              </td>
              <td className="text-slate-600 dark:text-slate-300">
                Oct 18, 2023
              </td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusStyles.Interview
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
              className="hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <td className="py-4 font-medium text-slate-800 dark:text-slate-100">
                DataWorks
              </td>
              <td className="text-slate-600 dark:text-slate-300">
                Data Analyst
              </td>
              <td className="text-slate-600 dark:text-slate-300">
                Oct 12, 2023
              </td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusStyles.Offer
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

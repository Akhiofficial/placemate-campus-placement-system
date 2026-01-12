import { FileText } from "lucide-react";
import { motion } from "framer-motion";

const AcademicProfile = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800
                  border border-white/10 shadow-lg p-6`}
    >
      <h2 className="text-lg font-semibold text-white mb-5">
        Academic Profile
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-white/5 p-4 border border-white/10">
          <p className="text-xs text-slate-400">CGPA</p>
          <p className="text-2xl font-bold text-white mt-1">
            3.8 <span className="text-sm text-slate-400">/ 4.0</span>
          </p>
        </div>

        <div className="rounded-xl bg-white/5 p-4 border border-white/10">
          <p className="text-xs text-slate-400">Year</p>
          <p className="text-2xl font-bold text-white mt-1">2024</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-slate-400 mb-1">Major</p>
        <p className="text-sm font-medium text-white">
          Computer Science & Engineering
        </p>
      </div>

      <div className="rounded-xl border-2 border-dashed border-white/20 p-5 text-center hover:border-blue-500 transition">
        <div className="flex justify-center mb-2 text-blue-500">
          <FileText size={20} />
        </div>

        <p className="text-sm text-white font-medium">
          Alex_Resume_v4.pdf
        </p>

        <button className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition">
          Preview Resume
        </button>
      </div>
    </motion.div>
  );
};

export default AcademicProfile;

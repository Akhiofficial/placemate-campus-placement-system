import { FileText } from "lucide-react";
import { motion } from "framer-motion";

const AcademicProfile = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-card border border-border shadow-sm p-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-5">
        Academic Profile
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-background-muted p-4 border border-border">
          <p className="text-xs text-foreground-muted">CGPA</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            3.8 <span className="text-sm text-foreground-muted">/ 4.0</span>
          </p>
        </div>

        <div className="rounded-xl bg-background-muted p-4 border border-border">
          <p className="text-xs text-foreground-muted">Year</p>
          <p className="text-2xl font-bold text-foreground mt-1">2024</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-foreground-muted mb-1">Major</p>
        <p className="text-sm font-medium text-foreground">
          Computer Science & Engineering
        </p>
      </div>

      <div className="rounded-xl border-2 border-dashed border-border p-5 text-center hover:border-blue-500 transition cursor-pointer group">
        <div className="flex justify-center mb-2 text-blue-500">
          <FileText size={20} />
        </div>

        <p className="text-sm text-foreground font-medium group-hover:text-blue-600 transition">
          Alex_Resume_v4.pdf
        </p>

        <button className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-500 transition">
          Preview Resume
        </button>
      </div>
    </motion.div>
  );
};

export default AcademicProfile;

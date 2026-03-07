import { useState, useEffect } from "react";
import { FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { getFileUrl } from "../../utils/fileHelper";

const AcademicProfile = ({ profile: initialProfile }) => {
  const [resumeUrl, setResumeUrl] = useState(initialProfile?.resumeUrl);
  const [uploading, setUploading] = useState(false);

  // Sync with prop if it changes
  useEffect(() => {
    if (initialProfile?.resumeUrl) {
      setResumeUrl(initialProfile.resumeUrl);
    }
  }, [initialProfile?.resumeUrl]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert("File size should be less than 5MB");
      return;
    }

    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      alert("Only PDF and DOC/DOCX files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const { data } = await api.post('/student/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update local state to show new resume status immediately
      setResumeUrl(data.resumeUrl);

    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

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
            {initialProfile?.cgpa || 'N/A'} <span className="text-sm text-foreground-muted">/ 10</span>
          </p>
        </div>

        <div className="rounded-xl bg-background-muted p-4 border border-border">
          <p className="text-xs text-foreground-muted">Year</p>
          <p className="text-2xl font-bold text-foreground mt-1">{initialProfile?.graduationYear || 'N/A'}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-foreground-muted mb-1">Major</p>
        <p className="text-sm font-medium text-foreground">
          {initialProfile?.major || 'No Major Added'}
        </p>
      </div>

      <div className="relative group">
        <div className={`rounded-xl border-dashed border-2 p-5 text-center flex flex-col items-center justify-center transition cursor-pointer ${resumeUrl || initialProfile?.resumeUrl ? "border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800" : "border-border hover:border-blue-500 hover:bg-background-muted"}`}>

          <div className="flex justify-center mb-2 text-blue-500">
            {uploading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <FileText size={20} />
            )}
          </div>

          <p className="text-sm text-foreground font-medium group-hover:text-blue-600 transition">
            {resumeUrl || initialProfile?.resumeUrl ? "Resume Uploaded" : "No Resume Uploaded"}
          </p>

          <span className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-500 transition block relative z-10">
            {resumeUrl || initialProfile?.resumeUrl ? "Update Resume" : "Upload Resume"}
          </span>

          {/* View Link if exists */}
          {(resumeUrl || initialProfile?.resumeUrl) && (
            <a
              href={getFileUrl(resumeUrl || initialProfile?.resumeUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 p-1 text-foreground-muted hover:text-blue-600 z-20"
              title="View Resume"
            >
              {/* Could add an ExternalLink icon here if desired, but keeping it clean */}
            </a>
          )}
        </div>

        {/* Hidden Input */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title={resumeUrl || initialProfile?.resumeUrl ? "Click to update resume" : "Click to upload resume"}
        />
      </div>

    </motion.div>
  );
};

export default AcademicProfile;

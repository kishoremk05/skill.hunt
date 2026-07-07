import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Save, Plus, Trash2, Tag, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SubmitProjectProps {
  projectId?: string | null;
  onBack: () => void;
  setActiveTab: (tab: string) => void;
}

interface TeamMemberInput {
  member_name: string;
  email: string;
  roll_number: string;
}

interface FileInput {
  file_name: string;
  file_url: string;
  file_type: "image" | "pdf" | "ppt" | "document";
}

export default function SubmitProject({ projectId, onBack, setActiveTab }: SubmitProjectProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([]);
  const [projectFiles, setProjectFiles] = useState<FileInput[]>([]);

  // Temp Inputs
  const [newMember, setNewMember] = useState<TeamMemberInput>({ member_name: "", email: "", roll_number: "" });
  const [newFile, setNewFile] = useState<FileInput>({ file_name: "", file_url: "", file_type: "document" });

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setIsLoading(true);
      const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;

      if (project) {
        setTitle(project.title || "");
        setShortDesc(project.short_description || "");
        setFullDesc(project.full_description || "");
        setCategory(project.category || "");
        setDepartment(project.department || "");
        setGithubUrl(project.github_url || "");
        setDemoUrl(project.demo_url || "");
        setVideoUrl(project.video_url || "");
        setTechnologies(project.technologies || []);

        // Fetch team members
        const { data: members, error: memError } = await supabase
          .from("project_members")
          .select("*")
          .eq("project_id", projectId);

        if (memError) throw memError;
        setTeamMembers(members || []);

        // Fetch project files
        const { data: files, error: fileError } = await supabase
          .from("project_files")
          .select("*")
          .eq("project_id", projectId);

        if (fileError) throw fileError;
        setProjectFiles(files || []);
      }
    } catch (err: any) {
      toast({
        title: "Failed to load project details",
        description: err.message,
        variant: "destructive",
      });
      onBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!technologies.includes(techInput.trim())) {
        setTechnologies([...technologies, techInput.trim()]);
      }
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleAddMember = () => {
    if (!newMember.member_name.trim()) {
      toast({ title: "Validation Error", description: "Member name is required", variant: "destructive" });
      return;
    }
    setTeamMembers([...teamMembers, newMember]);
    setNewMember({ member_name: "", email: "", roll_number: "" });
  };

  const handleRemoveMember = (idx: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== idx));
  };

  const handleAddFile = () => {
    if (!newFile.file_name.trim() || !newFile.file_url.trim()) {
      toast({ title: "Validation Error", description: "File name and URL are required", variant: "destructive" });
      return;
    }
    setProjectFiles([...projectFiles, newFile]);
    setNewFile({ file_name: "", file_url: "", file_type: "document" });
  };

  const handleRemoveFile = (idx: number) => {
    setProjectFiles(projectFiles.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "submitted") => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !category.trim() || !department.trim()) {
      toast({
        title: "Validation Error",
        description: "Title, Category, and Department are required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // We need an event_id. Let's fetch the current active event or settings
      const { data: settings, error: settingsError } = await supabase
        .from("settings")
        .select("current_event_id")
        .single();

      let eventId = settings?.current_event_id;

      if (!eventId) {
        // Fallback: Query first active/upcoming event
        const { data: events, error: eventError } = await supabase
          .from("events")
          .select("id")
          .eq("status", "active")
          .limit(1);

        if (eventError) throw eventError;
        if (events && events.length > 0) {
          eventId = events[0].id;
        } else {
          // Query any event
          const { data: allEvents } = await supabase.from("events").select("id").limit(1);
          if (allEvents && allEvents.length > 0) {
            eventId = allEvents[0].id;
          } else {
            throw new Error("No active showcase events found in the database. Please contact Admin.");
          }
        }
      }

      const projectPayload = {
        event_id: eventId,
        student_id: user.id,
        title,
        short_description: shortDesc,
        full_description: fullDesc,
        category,
        department,
        technologies,
        github_url: githubUrl,
        demo_url: demoUrl,
        video_url: videoUrl,
        status,
      };

      let activeProjectId = projectId;

      if (projectId) {
        // Update Project
        const { error: projectError } = await supabase
          .from("projects")
          .update(projectPayload)
          .eq("id", projectId);

        if (projectError) throw projectError;
      } else {
        // Insert Project
        const { data: newProject, error: projectError } = await supabase
          .from("projects")
          .insert(projectPayload)
          .select("id")
          .single();

        if (projectError) throw projectError;
        activeProjectId = newProject.id;
      }

      // Sync team members (delete existing and insert new for simplicity, or manage diffs)
      if (projectId) {
        const { error: delMemError } = await supabase
          .from("project_members")
          .delete()
          .eq("project_id", projectId);
        if (delMemError) throw delMemError;
      }

      if (teamMembers.length > 0 && activeProjectId) {
        const membersPayload = teamMembers.map((m) => ({
          project_id: activeProjectId,
          member_name: m.member_name,
          email: m.email || null,
          roll_number: m.roll_number || null,
        }));
        const { error: memInsertError } = await supabase
          .from("project_members")
          .insert(membersPayload);
        if (memInsertError) throw memInsertError;
      }

      // Sync files
      if (projectId) {
        const { error: delFileError } = await supabase
          .from("project_files")
          .delete()
          .eq("project_id", projectId);
        if (delFileError) throw delFileError;
      }

      if (projectFiles.length > 0 && activeProjectId) {
        const filesPayload = projectFiles.map((f) => ({
          project_id: activeProjectId,
          file_name: f.file_name,
          file_url: f.file_url,
          file_type: f.file_type,
        }));
        const { error: fileInsertError } = await supabase
          .from("project_files")
          .insert(filesPayload);
        if (fileInsertError) throw fileInsertError;
      }

      toast({
        title: status === "submitted" ? "Project Submitted Successfully" : "Project Saved as Draft",
        description: status === "submitted" ? "Your project has been locked for review." : "You can edit this project details later.",
      });

      onBack();
      setActiveTab("my-projects");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Submission failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-md p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl border border-white/12 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-black text-white">
            {projectId ? "Edit Project Showcase" : "New Showcase Submission"}
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            Fill in details to showcase your project at the active exposition event.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : (
        <form onSubmit={(e) => handleSubmit(e, "submitted")} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Project Title *
              </label>
              <input
                type="text"
                placeholder="e.g. AI-Powered Drone Map Builder"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Academic Department *
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science / Electrical Eng."
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white/70 cursor-pointer"
              >
                <option value="" className="bg-[#121212] text-white">Select Category</option>
                <option value="Artificial Intelligence" className="bg-[#121212] text-white">Artificial Intelligence</option>
                <option value="Blockchain" className="bg-[#121212] text-white">Blockchain</option>
                <option value="Internet of Things" className="bg-[#121212] text-white">Internet of Things</option>
                <option value="Smart Energy" className="bg-[#121212] text-white">Smart Energy</option>
                <option value="Software Engineering" className="bg-[#121212] text-white">Software Engineering</option>
                <option value="Hardware / Robotics" className="bg-[#121212] text-white">Hardware / Robotics</option>
                <option value="Other" className="bg-[#121212] text-white">Other</option>
              </select>
            </div>

            {/* Short Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Short Elevator Pitch (1-2 sentences)
              </label>
              <input
                type="text"
                placeholder="e.g. LSTM demand spike forecasting model to optimize grid distribution."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full px-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white"
              />
            </div>

            {/* Full Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Detailed Project Description
              </label>
              <textarea
                rows={5}
                placeholder="Explain details of the architecture, implementation methodology, challenges solved, results and future scope..."
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                className="w-full px-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white"
              />
            </div>

            {/* Tech Tags Input */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Technologies Used (Type and press Enter)
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="e.g. PyTorch, React, Docker"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                  className="w-full px-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white"
                />
                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-white/10 text-white/90 border border-white/12 font-bold"
                      >
                        <Tag className="h-3 w-3 text-white/40" />
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="ml-1.5 text-white/40 hover:text-red-400 font-extrabold focus:outline-none"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Resource Links */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Live Demo Link
              </label>
              <input
                type="url"
                placeholder="https://project.demo.dev"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full px-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Project Presentation Video URL
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=your-video"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white"
              />
            </div>
          </div>

          <hr className="border-white/12" />

          {/* Team Members Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Group Team Members
              </h3>
              <p className="text-xs text-white/40 mt-0.5">Add other contributors to your project team.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Member Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newMember.member_name}
                  onChange={(e) => setNewMember({ ...newMember, member_name: e.target.value })}
                  className="w-full px-3 py-2 border border-white/12 rounded-xl bg-white/5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Email Address</label>
                <input
                  type="email"
                  placeholder="jdoe@univ.edu"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 border border-white/12 rounded-xl bg-white/5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/10"
                />
              </div>
              <div className="flex gap-2 items-center">
                <div className="space-y-1 flex-1">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Roll Number</label>
                  <input
                    type="text"
                    placeholder="CS-2026-084"
                    value={newMember.roll_number}
                    onChange={(e) => setNewMember({ ...newMember, roll_number: e.target.value })}
                    className="w-full px-3 py-2 border border-white/12 rounded-xl bg-white/5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/10"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="p-2.5 mt-5 rounded-xl bg-white/5 text-white border border-white/12 hover:bg-white/10 flex items-center justify-center font-bold"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {teamMembers.length > 0 && (
              <div className="overflow-hidden border border-white/12 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-white/5 text-white/40 uppercase tracking-wider font-bold">
                      <th className="py-2.5 px-4">Name</th>
                      <th className="py-2.5 px-4">Email</th>
                      <th className="py-2.5 px-4">Roll Number</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-semibold">
                    {teamMembers.map((member, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="py-2 px-4 text-white">{member.member_name}</td>
                        <td className="py-2 px-4 text-white/60">{member.email || "-"}</td>
                        <td className="py-2 px-4 text-white/60">{member.roll_number || "-"}</td>
                        <td className="py-2 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="p-1 rounded text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <hr className="border-white/12" />

          {/* Files / Attachments Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Project Files & Attachments
              </h3>
              <p className="text-xs text-white/40 mt-0.5">Attach documents, PDFs, presentation slides or designs.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">File Name / Label</label>
                <input
                  type="text"
                  placeholder="e.g. Project Architecture PDF"
                  value={newFile.file_name}
                  onChange={(e) => setNewFile({ ...newFile, file_name: e.target.value })}
                  className="w-full px-3 py-2 border border-white/12 rounded-xl bg-white/5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Attachment Link / URL</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/your-doc-link"
                  value={newFile.file_url}
                  onChange={(e) => setNewFile({ ...newFile, file_url: e.target.value })}
                  className="w-full px-3 py-2 border border-white/12 rounded-xl bg-white/5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/10"
                />
              </div>
              <div className="flex gap-2 items-center">
                <div className="space-y-1 flex-1">
                  <label className="text-[10px] font-bold text-white/40 uppercase">File Type</label>
                  <select
                    value={newFile.file_type}
                    onChange={(e) => setNewFile({ ...newFile, file_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-white/12 rounded-xl bg-white/5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/10 cursor-pointer"
                  >
                    <option value="document" className="bg-[#121212] text-white">Document</option>
                    <option value="pdf" className="bg-[#121212] text-white">PDF File</option>
                    <option value="ppt" className="bg-[#121212] text-white">Slideshow (PPT)</option>
                    <option value="image" className="bg-[#121212] text-white">Screenshot Image</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddFile}
                  className="p-2.5 mt-5 rounded-xl bg-white/5 text-white border border-white/12 hover:bg-white/10 flex items-center justify-center font-bold"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {projectFiles.length > 0 && (
              <div className="overflow-hidden border border-white/12 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-white/5 text-white/40 uppercase tracking-wider font-bold">
                      <th className="py-2.5 px-4">Label</th>
                      <th className="py-2.5 px-4">Link URL</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-semibold">
                    {projectFiles.map((file, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="py-2 px-4 text-white">{file.file_name}</td>
                        <td className="py-2 px-4 text-blue-400 truncate max-w-xs">
                          <a href={file.file_url} target="_blank" rel="noreferrer" className="hover:underline">
                            {file.file_url}
                          </a>
                        </td>
                        <td className="py-2 px-4 text-white/60 uppercase">{file.file_type}</td>
                        <td className="py-2 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="p-1 rounded text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-white/12">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-white/12 text-xs font-bold text-white/70 hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-white/12 text-xs font-bold text-white bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <Save className="h-4.5 w-4.5" />}
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold text-black bg-white hover:bg-white/85 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-lg shadow-white/5"
            >
              {isSubmitting ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <Save className="h-4.5 w-4.5" />}
              Submit for Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

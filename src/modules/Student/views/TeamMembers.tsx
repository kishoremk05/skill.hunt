import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Users, UserPlus, Trash2, Mail, Badge, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Member {
  id: string;
  project_id: string;
  member_name: string;
  email: string | null;
  roll_number: string | null;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
}

export default function TeamMembers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  const fetchActiveProject = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      // Fetch the first project of the user
      const { data, error } = await supabase
        .from("projects")
        .select("id, title")
        .eq("student_id", user.id)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setProjectId(data[0].id);
        setProjectTitle(data[0].title);
        fetchMembers(data[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      toast({
        title: "Error fetching project",
        description: err.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchMembers = async (pid: string) => {
    try {
      const { data, error } = await supabase
        .from("project_members")
        .select("*")
        .eq("project_id", pid);

      if (error) throw error;
      setMembers(data || []);
    } catch (err: any) {
      toast({
        title: "Error fetching team members",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveProject();
  }, [user]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Team member name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from("project_members")
        .insert({
          project_id: projectId,
          member_name: name.trim(),
          email: email.trim() || null,
          roll_number: rollNumber.trim() || null,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Member Added",
        description: `${name} has been added to your team.`,
      });

      setName("");
      setEmail("");
      setRollNumber("");
      fetchMembers(projectId);
    } catch (err: any) {
      toast({
        title: "Failed to add member",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) return;
    try {
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Member Removed",
        description: `${memberName} has been removed from the team.`,
      });

      if (projectId) {
        fetchMembers(projectId);
      }
    } catch (err: any) {
      toast({
        title: "Removal failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header view */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Team Members</h2>
        <p className="text-xs text-white/40 mt-1">Manage project collaborators and team directories.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : !projectId ? (
        <div className="bg-[#1a1a1a] rounded-3xl p-12 text-center border border-white/12 min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/12 text-white flex items-center justify-center mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Project Found</h3>
          <p className="text-sm text-white/40 max-w-sm">
            You must create and submit a project first before you can manage or add group team members.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Add member form (5/12) */}
          <div className="xl:col-span-5 bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white">Add Collaborator</h3>
              <p className="text-xs text-white/40 mt-0.5">Register a new student member for "{projectTitle}".</p>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alice Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-white/12 rounded-xl bg-white/5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. avance@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/12 rounded-xl bg-white/5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                  Roll / Registration Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS-2026-004"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/12 rounded-xl bg-white/5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-black bg-white hover:bg-white/85 transition-all shadow-md disabled:opacity-50 mt-2"
              >
                {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Add Team Member
              </button>
            </form>
          </div>

          {/* Members list (7/12) */}
          <div className="xl:col-span-7 bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white">Active Roster</h3>
              <p className="text-xs text-white/40 mt-0.5">Roster of registered authors for this showcase project.</p>
            </div>

            {members.length === 0 ? (
              <div className="p-8 text-center text-white/40 border-2 border-dashed border-white/10 rounded-2xl">
                <p className="text-sm font-bold">Just You!</p>
                <p className="text-xs mt-0.5">You are currently the sole owner and developer. Add collaborators on the left.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/12 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/10 text-white font-extrabold flex items-center justify-center shadow-md border border-white/12">
                        {member.member_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-extrabold text-white">
                          {member.member_name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-2 text-xs text-white/40">
                          {member.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {member.email}
                            </span>
                          )}
                          {member.email && member.roll_number && (
                            <span className="text-white/10">|</span>
                          )}
                          {member.roll_number && (
                            <span>Roll: {member.roll_number}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMember(member.id, member.member_name)}
                      className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { CheckSquare, Info, Star, Search, Filter, ShieldCheck, Heart, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  title: string;
  short_description: string;
  category: string;
  department: string;
  technologies: string[];
  student_id: string;
}

interface Vote {
  project_id: string;
}

export default function PeerVoting() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVotingEnabled, setIsVotingEnabled] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [myVotes, setMyVotes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const fetchVotingState = async () => {
    if (!user) return;
    try {
      setIsLoading(true);

      // 1. Fetch settings to see if voting is enabled
      const { data: settings, error: settingsError } = await supabase
        .from("settings")
        .select("voting_enabled")
        .single();

      if (settingsError && settingsError.code !== "PGRST116") throw settingsError;
      setIsVotingEnabled(settings?.voting_enabled ?? false);

      if (settings?.voting_enabled) {
        // 2. Fetch all eligible projects (exclude current user's projects)
        const { data: projData, error: projError } = await supabase
          .from("projects")
          .select("*")
          .neq("student_id", user.id)
          .in("status", ["verified", "voting", "reviewing", "published"]);

        if (projError) throw projError;
        setProjects(projData || []);

        // 3. Fetch user's votes
        const { data: voteData, error: voteError } = await supabase
          .from("votes")
          .select("project_id")
          .eq("student_id", user.id);

        if (voteError) throw voteError;
        setMyVotes(voteData?.map((v) => v.project_id) || []);
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error fetching data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVotingState();
  }, [user]);

  const handleVote = async (projectId: string) => {
    if (!user) return;
    const isVoted = myVotes.includes(projectId);
    try {
      setIsSubmitting(projectId);

      if (isVoted) {
        // Remove Vote
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("project_id", projectId)
          .eq("student_id", user.id);

        if (error) throw error;
        setMyVotes(myVotes.filter((id) => id !== projectId));
        toast({ title: "Vote Revoked", description: "Your vote for this project has been removed." });
      } else {
        // Check vote limit (e.g. limit to max 3 votes)
        if (myVotes.length >= 3) {
          toast({
            title: "Vote Limit Reached",
            description: "You can cast a maximum of 3 peer votes in total.",
            variant: "destructive",
          });
          return;
        }

        // Add Vote
        const { error } = await supabase
          .from("votes")
          .insert({ project_id: projectId, student_id: user.id });

        if (error) throw error;
        setMyVotes([...myVotes, projectId]);
        toast({ title: "Vote Cast Successfully!", description: "Thank you for supporting your peers!" });
      }
    } catch (err: any) {
      toast({
        title: "Voting failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(null);
    }
  };

  const categories = ["all", ...new Set(projects.map((p) => p.category))];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header view */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Peer Voting</h2>
          <p className="text-xs text-white/40 mt-1">
            Cast votes for the best project showcases. You have up to 3 votes.
          </p>
        </div>
        {isVotingEnabled && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-2xl text-xs font-bold border border-white/12">
            <CheckSquare className="h-4.5 w-4.5" /> Votes Cast: {myVotes.length} / 3
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : !isVotingEnabled ? (
        <div className="bg-[#1a1a1a] rounded-3xl p-12 text-center border border-white/12 min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/12 text-white/70 flex items-center justify-center mb-4">
            <Info className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Voting Disabled</h3>
          <p className="text-sm text-white/40 max-w-sm">
            Peer voting is currently disabled. Standings and rankings are locked or pending review by organizers.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search / Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-white/40" />
              </span>
              <input
                type="text"
                placeholder="Search showcases by name, department or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-xs text-white"
              />
            </div>

            <div className="md:col-span-4 relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-white/12 rounded-2xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-xs text-white/70 cursor-pointer appearance-none font-bold"
              >
                <option value="all" className="bg-[#121212] text-white">All Categories</option>
                {categories.filter((c) => c !== "all").map((cat) => (
                  <option key={cat} value={cat} className="bg-[#121212] text-white">
                    {cat}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/40">
                <Filter className="h-4 w-4" />
              </span>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-3xl p-12 text-center border border-white/12 min-h-[250px] flex flex-col items-center justify-center">
              <p className="text-sm font-bold text-white/40">No project showcases match your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => {
                const isVoted = myVotes.includes(project.id);
                return (
                  <div
                    key={project.id}
                    className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                            {project.category}
                          </span>
                          <h3 className="text-lg font-black text-white leading-tight">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm text-white/60 line-clamp-3 font-semibold">
                        {project.short_description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies?.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-xs px-2.5 py-1 rounded-xl bg-white/5 text-white/70 border border-white/12 font-bold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-white/5 border-t border-white/12 flex items-center justify-between">
                      <span className="text-xs text-white/40 font-bold">Dept: {project.department}</span>

                      <button
                        onClick={() => handleVote(project.id)}
                        disabled={isSubmitting !== null}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          isVoted
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                            : "bg-white hover:bg-white/85 text-black"
                        }`}
                      >
                        {isSubmitting === project.id ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : isVoted ? (
                          <>
                            <Heart className="h-3.5 w-3.5 fill-current text-red-500" /> Revoke Vote
                          </>
                        ) : (
                          <>
                            <Heart className="h-3.5 w-3.5" /> Cast Vote
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

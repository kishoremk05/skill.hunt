import React, { useState, useEffect } from "react";
import { Search, Filter, ShieldCheck, CheckSquare, MoreVertical, ShieldAlert, Ban, Trash2, Edit, CheckCircle, Plus, Copy, Check, Loader2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
  department: string;
  status: "active" | "suspended" | "pending";
  createdDate: string;
  tempPassword?: string;
}

interface UserManagementViewProps {
  initialRoleFilter?: string;
}

export default function UserManagementView({ initialRoleFilter = "all" }: UserManagementViewProps) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(initialRoleFilter);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Faculty Invitation States
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [facName, setFacName] = useState("");
  const [facEmail, setFacEmail] = useState("");
  const [facDept, setFacDept] = useState("");
  const [facPassword, setFacPassword] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    if (!inviteLink) return;
    try {
      setSendingEmail(true);
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: facEmail,
          name: facName,
          inviteLink,
          password: facPassword,
        }),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        throw new Error(`Server returned error status ${res.status}`);
      }
      if (!res.ok) {
        throw new Error(result?.error || "Failed to send email");
      }

      toast({
        title: "Invitation Sent",
        description: `Successfully sent invitation email to ${facEmail}.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Send Email Failed",
        description: err.message || "Could not dispatch invitation email.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const [resendingId, setResendingId] = useState<string | null>(null);

  const handleResendInvite = async (user: UserItem) => {
    try {
      setResendingId(user.id);

      const inviteLink = `${import.meta.env.VITE_APP_URL || window.location.origin}/login?email=${encodeURIComponent(user.email)}`;
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: user.email,
          name: user.name,
          inviteLink,
          password: "dummy", // Overridden by server password regeneration
          regeneratePassword: true,
          userId: user.id,
          userRole: user.role,
          userDept: user.department,
        }),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        throw new Error(`Server returned error status ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(result?.error || "Failed to send email");
      }

      toast({
        title: "Invitation Resent",
        description: `Successfully regenerated password and resent invitation link to ${user.email}.`,
      });

      fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Resend Failed",
        description: err.message || "Could not dispatch invitation email.",
        variant: "destructive",
      });
    } finally {
      setResendingId(null);
    }
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFacPassword("Fac_" + pwd);
  };

  const handleCreateFaculty = async () => {
    if (!facEmail || !facName || !facDept) {
      setModalError("Please fill out all fields.");
      return;
    }
    setModalError(null);
    setSubmitting(true);
    try {
      const tempSupabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        }
      );

      const { data, error } = await tempSupabase.auth.signUp({
        email: facEmail,
        password: facPassword,
        options: {
          data: {
            full_name: facName,
            role: "faculty",
            department: facDept,
            status: "pending",
            avatar_url: `__TEMP_PWD__:${facPassword}`,
          }
        }
      });

      if (error) throw error;

      if (data && data.user) {
        // Explicitly update status in public.profiles to bypass any database trigger mismatches
        await supabase
          .from("profiles")
          .update({ status: "pending" })
          .eq("id", data.user.id);

        const currentOrigin = import.meta.env.VITE_APP_URL || window.location.origin;
        setInviteLink(`${currentOrigin}/login?email=${encodeURIComponent(facEmail)}`);
        fetchUsers();
      }
    } catch (err: any) {
      console.error("Error creating faculty:", err);
      setModalError(err.message || String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const inviteDetailsText = () => {
    return `Welcome to Skill Hunt!
You have been registered as a Faculty Member.

Login URL: ${window.location.origin}/login
Email: ${facEmail}
Password: ${facPassword}

Use these credentials to sign in.`;
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteDetailsText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setRoleFilter(initialRoleFilter);
  }, [initialRoleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorText(null);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, department, status, created_at")
        .order("full_name", { ascending: true });

      if (error) throw error;

      if (data) {
        // Filter out duplicate email addresses to display unique real profiles
        const uniqueData = data.filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.email === v.email) === i);
        const mapped: UserItem[] = uniqueData.map((u: any) => {
          let tempPassword = "";
          const avatar = u.avatar_url;
          if (avatar && avatar.startsWith("__TEMP_PWD__:")) {
            tempPassword = avatar.substring("__TEMP_PWD__:".length);
          }
          return {
            id: u.id,
            name: u.full_name || "New User",
            email: u.email,
            role: u.role,
            department: u.department || "",
            status: (u.status || "active") as any,
            createdDate: u.created_at ? u.created_at.split("T")[0] : "",
            tempPassword,
          };
        });
        setUsers(mapped);
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setErrorText(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleSelect = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    }
  };

  const handleSuspend = async (userId: string) => {
    const userObj = users.find((u) => u.id === userId);
    if (!userObj) return;
    const nextStatus = userObj.status === "active" ? "suspended" : "active";

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: nextStatus })
        .eq("id", userId);

      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
      );
    } catch (err) {
      console.error("Error suspending user:", err);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .in("id", selectedUserIds);

      if (error) throw error;
      setUsers((prev) => prev.filter((u) => !selectedUserIds.includes(u.id)));
      setSelectedUserIds([]);
    } catch (err) {
      console.error("Error bulk deleting users:", err);
    }
  };

  const handleBulkSuspend = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "suspended" })
        .in("id", selectedUserIds);

      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) => (selectedUserIds.includes(u.id) ? { ...u, status: "suspended" } : u))
      );
      setSelectedUserIds([]);
    } catch (err) {
      console.error("Error bulk suspending users:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header operations */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">User Directory</h2>
          <p className="text-xs text-white/40 mt-0.5">Manage students, faculty members, and administrators.</p>
        </div>
        <button
          onClick={() => {
            setShowFacultyModal(true);
            generatePassword();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-white/85 text-black text-xs font-bold rounded-xl transition-all shadow-md shrink-0"
        >
          <Plus className="h-3.5 w-3.5" /> Add Faculty Member
        </button>
      </div>

      {errorText && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-semibold text-red-400">
          Failed to load users: {errorText}
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-white/40" />
          </span>
          <input
            type="text"
            placeholder="Search users by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-white/12 rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 text-xs text-white placeholder:text-white/40"
          />
        </div>

        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-white/12 rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 text-xs text-white appearance-none cursor-pointer font-semibold"
            >
              <option value="all" className="bg-[#1a1a1a] text-white">All Roles</option>
              <option value="student" className="bg-[#1a1a1a] text-white">Students</option>
              <option value="faculty" className="bg-[#1a1a1a] text-white">Faculty</option>
              <option value="admin" className="bg-[#1a1a1a] text-white">Administrators</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-white/40">
              <Filter className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-white/12 rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 text-xs text-white appearance-none cursor-pointer font-semibold"
            >
              <option value="all" className="bg-[#1a1a1a] text-white">All Statuses</option>
              <option value="active" className="bg-[#1a1a1a] text-white">Active Only</option>
              <option value="suspended" className="bg-[#1a1a1a] text-white">Suspended Only</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-white/40">
              <Filter className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Bulk actions bar if items are selected */}
      {selectedUserIds.length > 0 && (
        <div className="p-4 bg-white/5 border border-white/12 rounded-2xl flex items-center justify-between">
          <span className="text-xs font-bold text-white">
            {selectedUserIds.length} users selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkSuspend}
              className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-white/85 text-black rounded-xl text-[10px] font-bold shadow transition-all"
            >
              <Ban className="h-3.5 w-3.5" /> Suspend Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-[10px] font-bold shadow transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-white/40 uppercase text-[10px] font-bold tracking-wider border-b border-white/12">
              <th className="py-4 px-5 w-12 text-center">
                <input
                  type="checkbox"
                  checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-white/12 bg-white/5 text-white focus:ring-white/10"
                />
              </th>
              <th className="py-4 px-5">User Profile</th>
              <th className="py-4 px-5">Role Badge</th>
              <th className="py-4 px-5">Department</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5">Created Date</th>
              <th className="py-4 px-5 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/12 text-xs text-white/70 font-semibold">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-all border-b border-white/12">
                <td className="py-4 px-5 text-center">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => handleToggleSelect(user.id)}
                    className="rounded border-white/12 bg-white/5 text-white focus:ring-white/10"
                  />
                </td>
                <td className="py-4 px-5">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-white">{user.name}</h4>
                    <p className="text-[10px] text-white/40">{user.email}</p>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                    user.role === "admin" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    user.role === "faculty" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                    "bg-white/5 text-white border-white/12"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-5 text-white/80">{user.department}</td>
                <td className="py-4 px-5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    user.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    "bg-orange-500/10 text-orange-400 border-orange-500/20"
                  }`}>
                    {user.status === "active" ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-5 text-white/40">{user.createdDate}</td>
                <td className="py-4 px-5 text-right flex items-center justify-end gap-1.5">
                  {user.status === "pending" && (
                    <button
                      onClick={() => handleResendInvite(user)}
                      disabled={resendingId === user.id}
                      className="p-2 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-all disabled:opacity-50"
                      title="Resend Invite Link"
                    >
                      {resendingId === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleSuspend(user.id)}
                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                    title={user.status === "active" ? "Suspend Account" : "Activate Account"}
                  >
                    <Ban className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete Account"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-white/40 font-medium">
                  No users found in directory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showFacultyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/12 rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-white">Add Faculty Member</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase">Full Name</label>
                <input
                  type="text"
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Connor"
                  className="w-full px-3.5 py-2.5 border border-white/12 rounded-xl bg-white/5 text-xs text-white placeholder:text-white/40 font-semibold focus:outline-none focus:ring-2 focus:ring-white/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase">Email Address</label>
                <input
                  type="email"
                  value={facEmail}
                  onChange={(e) => setFacEmail(e.target.value)}
                  placeholder="e.g. sarah@university.edu"
                  className="w-full px-3.5 py-2.5 border border-white/12 rounded-xl bg-white/5 text-xs text-white placeholder:text-white/40 font-semibold focus:outline-none focus:ring-2 focus:ring-white/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase">Department</label>
                <input
                  type="text"
                  value={facDept}
                  onChange={(e) => setFacDept(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3.5 py-2.5 border border-white/12 rounded-xl bg-white/5 text-xs text-white placeholder:text-white/40 font-semibold focus:outline-none focus:ring-2 focus:ring-white/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase">Generated Password</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={facPassword}
                    className="flex-1 px-3.5 py-2.5 border border-white/12 rounded-xl bg-white/5 text-xs text-white/60 font-mono focus:outline-none"
                  />
                  <button
                    onClick={generatePassword}
                    className="px-3 py-2.5 border border-white/12 rounded-xl bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition-all animate-fade-in"
                  >
                    Regen
                  </button>
                </div>
              </div>
            </div>

            {inviteLink && (
              <div className="space-y-3">
                <div className="p-4 bg-white/5 border border-white/12 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white/40 uppercase">Invite Credentials Details</span>
                    <button
                      onClick={handleCopyInvite}
                      className="inline-flex items-center gap-1 text-[10px] text-white/65 hover:text-white font-bold"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy Info
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    rows={4}
                    value={inviteDetailsText()}
                    className="w-full bg-transparent border-0 text-[10px] text-white/70 font-mono resize-none focus:ring-0 p-0"
                  />
                </div>

                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-bold transition-all disabled:opacity-50 inline-flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending Email...
                    </>
                  ) : (
                    <>
                      <Mail className="h-3.5 w-3.5" /> Send Invitation Email
                    </>
                  )}
                </button>
              </div>
            )}

            {modalError && (
              <p className="text-[11px] text-red-400 font-semibold">{modalError}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowFacultyModal(false);
                  setFacName("");
                  setFacEmail("");
                  setFacDept("");
                  setInviteLink("");
                  setModalError(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-white/12 text-xs font-bold text-white hover:bg-white/5 transition-all"
              >
                Close
              </button>
              {!inviteLink && (
                <button
                  onClick={handleCreateFaculty}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-white/85 text-black text-xs font-bold transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create & Invite
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

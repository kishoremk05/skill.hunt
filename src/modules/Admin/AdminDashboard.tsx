import React, { useState, useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import AdminDashboardOverview from "./views/AdminDashboardOverview";
import UserManagementView from "./views/UserManagementView";
import ProjectManagementView from "./views/ProjectManagementView";
import EventManagementView from "./views/EventManagementView";
import EvaluationManagementView from "./views/EvaluationManagementView";
import VotingManagementView from "./views/VotingManagementView";
import LeaderboardManagementView from "./views/LeaderboardManagementView";
import AdminAnalyticsView from "./views/AdminAnalyticsView";
import AdminSettingsView from "./views/AdminSettingsView";
import ReportsView from "./views/ReportsView";
import FacultyNotifications from "../Faculty/views/FacultyNotifications";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalFaculty: 0,
    totalProjects: 0,
    pendingReviews: 0,
    totalVotes: 0,
    publishedResults: false,
    activeEvents: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        const { count: studentsCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "student");

        const { count: facultyCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "faculty");

        const { count: projectsCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true });

        const { count: votesCount } = await supabase
          .from("votes")
          .select("*", { count: "exact", head: true });

        const { count: eventsCount } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        const { count: reviewersCount } = await supabase
          .from("project_reviewers")
          .select("*", { count: "exact", head: true });

        const { count: submittedEvalsCount } = await supabase
          .from("evaluations")
          .select("*", { count: "exact", head: true })
          .eq("status", "submitted");

        const pending = (reviewersCount || 0) - (submittedEvalsCount || 0);

        const { count: publishedCount } = await supabase
          .from("leaderboard")
          .select("*", { count: "exact", head: true })
          .eq("published", true);

        setStats({
          totalUsers: usersCount || 0,
          totalStudents: studentsCount || 0,
          totalFaculty: facultyCount || 0,
          totalProjects: projectsCount || 0,
          pendingReviews: pending > 0 ? pending : 0,
          totalVotes: votesCount || 0,
          publishedResults: (publishedCount || 0) > 0,
          activeEvents: eventsCount || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, [activeTab]);

  const handleQuickAction = (type: "create-event" | "add-faculty" | "add-student" | "publish-leaderboard" | "export-reports") => {
    if (type === "create-event") {
      setActiveTab("events");
      toast({ title: "Redirected to Event Management", description: "You can create or configure event timelines here." });
    } else if (type === "add-faculty" || type === "add-student") {
      setActiveTab("users");
      toast({ title: "Redirected to User Directory", description: "Add new accounts or allocate roles here." });
    } else if (type === "publish-leaderboard") {
      setActiveTab("leaderboard");
      toast({ title: "Redirected to Leaderboard Controls", description: "Publish or recalculate standings here." });
    } else if (type === "export-reports") {
      setActiveTab("reports");
      toast({ title: "Redirected to Reporting Center", description: "Generate Excel/CSV/PDF summaries here." });
    }
  };

  const handleQuickCreate = (type: "event" | "faculty" | "student") => {
    if (type === "event") handleQuickAction("create-event");
    else handleQuickAction("add-faculty");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white dark">
      {/* Sidebar navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      {/* Main panel body */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? "md:pl-20" : "md:pl-64"}`}>
        {/* Top Header navbar */}
        <AdminNavbar
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          onQuickCreate={handleQuickCreate}
          onSearch={(query) => setSearchQuery(query)}
        />

        {/* Content Body Grid */}
        <main className="flex-1 p-6 sm:p-8 mt-16 max-w-[1600px] w-full mx-auto space-y-8">
          {activeTab === "dashboard" && (
            <AdminDashboardOverview
              stats={stats}
              onQuickAction={handleQuickAction}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "users" && <UserManagementView initialRoleFilter="all" />}

          {activeTab === "projects" && <ProjectManagementView />}

          {activeTab === "events" && <EventManagementView />}

          {activeTab === "evaluations" && <EvaluationManagementView />}

          {activeTab === "voting" && <VotingManagementView />}

          {activeTab === "leaderboard" && <LeaderboardManagementView />}

          {activeTab === "analytics" && <AdminAnalyticsView />}

          {activeTab === "settings" && <AdminSettingsView />}

          {activeTab === "reports" && <ReportsView />}

          {activeTab === "notifications" && <FacultyNotifications />}
        </main>
      </div>
    </div>
  );
}

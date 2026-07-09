import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import WelcomeCard from "./WelcomeCard";
import StatsGrid from "./StatsGrid";
import FacultyReviewsPanel from "./FacultyReviewsPanel";
import ProjectOverview from "./ProjectOverview";
import RightSidebar from "./RightSidebar";

// Views
import MyProjects from "./views/MyProjects";
import SubmitProject from "./views/SubmitProject";
import TeamMembers from "./views/TeamMembers";
import FacultyReviews from "./views/FacultyReviews";
import PeerVoting from "./views/PeerVoting";
import Leaderboard from "./views/Leaderboard";
import EventsView from "./views/EventsView";
import NotificationsView from "./views/NotificationsView";
import ProfileView from "./views/ProfileView";
import SettingsView from "./views/SettingsView";
import ProjectDetails from "./views/ProjectDetails";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedEditProjectId, setSelectedEditProjectId] = useState<string | null>(null);
  const [selectedDetailProject, setSelectedDetailProject] = useState<any | null>(null);

  const handleEditProject = (projectId: string) => {
    setSelectedEditProjectId(projectId);
    setActiveTab("submit-project");
  };

  const handleViewDetails = (project: any) => {
    setSelectedDetailProject(project);
    setActiveTab("project-details");
  };

  const handleBackToProjects = () => {
    setSelectedEditProjectId(null);
    setSelectedDetailProject(null);
    setActiveTab("my-projects");
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-slate-50/50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-100/40 via-slate-50 to-slate-100/90 text-slate-900 relative overflow-hidden">
      {/* Sidebar */}
      <StudentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      {/* Main area */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? "md:pl-20" : "md:pl-64"}`}>
        {/* Navbar */}
        <StudentNavbar isCollapsed={sidebarCollapsed} />

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-7 pt-20 sm:pt-24 max-w-[1500px] w-full mx-auto relative z-10">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Hero Welcome Banner */}
              <WelcomeCard setActiveTab={setActiveTab} />

              {/* Stats Row */}
              <StatsGrid setActiveTab={setActiveTab} />

              {/* Main columns grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left - 8 cols */}
                <div className="lg:col-span-8 space-y-6">
                  {/* My Project summary */}
                  <ProjectOverview
                    onEditProject={handleEditProject}
                    onViewDetails={handleViewDetails}
                    setActiveTab={setActiveTab}
                  />
                  {/* Faculty Evaluation reviews */}
                  <FacultyReviewsPanel setActiveTab={setActiveTab} />
                </div>

                {/* Right - 4 cols */}
                <div className="lg:col-span-4">
                  <RightSidebar setActiveTab={setActiveTab} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "my-projects" && (
            <MyProjects
              onEditProject={handleEditProject}
              onViewDetails={handleViewDetails}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "submit-project" && (
            <SubmitProject
              projectId={selectedEditProjectId}
              onBack={handleBackToProjects}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "project-details" && selectedDetailProject && (
            <ProjectDetails
              project={selectedDetailProject}
              onBack={handleBackToProjects}
            />
          )}

          {activeTab === "team" && <TeamMembers />}
          {activeTab === "reviews" && <FacultyReviews />}
          {activeTab === "voting" && <PeerVoting />}
          {activeTab === "leaderboard" && <Leaderboard />}
          {activeTab === "events" && <EventsView />}
          {activeTab === "notifications" && <NotificationsView />}
          {activeTab === "profile" && <ProfileView />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

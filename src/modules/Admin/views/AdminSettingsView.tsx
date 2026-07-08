import React, { useState, useEffect } from "react";
import { Settings, Shield, Sliders, Database, Palette, Save, Download, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSettingsView() {
  const [facultyWeight, setFacultyWeight] = useState(85);
  const [instName, setInstName] = useState("State Technical University");
  const [maxUpload, setMaxUpload] = useState(50); // MB
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("settings")
        .select("scoring_faculty_percentage, scoring_peer_percentage")
        .eq("is_singleton", true)
        .single();

      if (data) {
        setFacultyWeight(data.scoring_faculty_percentage ?? 85);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleWeightChange = (val: number) => {
    setFacultyWeight(val);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("settings")
        .update({
          scoring_faculty_percentage: facultyWeight,
          scoring_peer_percentage: 100 - facultyWeight,
        })
        .eq("is_singleton", true);

      if (error) throw error;
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings.");
    }
  };
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 text-slate-800 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Settings className="h-5.5 w-5.5 text-slate-400" /> Platform Settings & Policies
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-semibold">Adjust global weighted scoring configurations, branding metadata, and database operations.</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Scoring Weights */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Sliders className="h-4 w-4 text-slate-450" /> Score Calculations Configuration
          </h3>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Evaluation Weight Balancer</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Determine weight distribution percentage between Faculty Grading and Peer Votes.</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                  Total: 100%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Faculty Rubric Weight</span>
                  <span className="text-slate-800">{facultyWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={facultyWeight}
                  onChange={(e) => handleWeightChange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Student Peer Vote Weight</span>
                  <span className="text-slate-800">{100 - facultyWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={100 - facultyWeight}
                  onChange={(e) => handleWeightChange(100 - parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: General & Branding */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Palette className="h-4 w-4 text-slate-450" /> Platform Branding & Limits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Institution / University Name</label>
              <input
                type="text"
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-350 font-semibold text-slate-800 placeholder:text-slate-450"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Max File Upload Limit (MB)</label>
              <input
                type="number"
                value={maxUpload}
                onChange={(e) => setMaxUpload(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-350 font-semibold text-slate-800 placeholder:text-slate-450"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Data Backup */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Database className="h-4 w-4 text-slate-450" /> Database Administration
          </h3>

          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 text-xs font-bold transition-all shadow-xs active:scale-95">
              <Download className="h-4 w-4" /> Download Backup SQL
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 text-xs font-bold transition-all shadow-xs active:scale-95">
              <RefreshCw className="h-4 w-4" /> Run Integrity Audit
            </button>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-2xl transition-all shadow-md active:scale-95">
          <Save className="h-4 w-4" /> Save Preferences
        </button>
      </div>
    </div>
  );
}

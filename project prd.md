Skill Hunt - CS Project Showcase & Judging Platform 
Client: Skill Hunt University 
1. Project Overview 
Skill Hunt University wants a web platform that lets CS students submit their projects with a repository link and 
live preview link, lets faculty judge those projects against a structured rubric with designation-based weightage, 
lets every student cast exactly one peer vote, and publishes a ranked leaderboard, all without spreadsheets, 
emails, or manual score tallying. 
This brief covers the complete platform: every required page, the full submission-to-results flow, the scoring 
engine with faculty and student weightage, and an admin panel to run events. It does not cover project code 
hosting, plagiarism detection, payment of any kind, or integration with the university ERP. 
2. Project Information 
Field 
Detail 
Project Type 
Client 
Full-stack Web App, CS Project Showcase & Judging 
Skill Hunt University 
Medium 
Responsive web app, mobile-first for students, desktop-optimized for faculty 
review 
Deliverable Type 
Working web application, database schema, scoring engine, admin panel, 
deployment 
Primary Goal 
Let a student submit a project and a weighted panel of faculty plus peers rank it 
fairly 
3. About Skill Hunt University 
Skill Hunt University runs semester project showcases across its CS, IT, and MCA departments. Evaluation 
today is informal: projects arrive over email and pen drives, judging criteria vary by evaluator, and students 
receive a grade with no feedback. The university has no existing platform and no digital record of past projects. 
Platform tone: Credible, competitive, easy to scan 
4. Main Goal 
Design and build a complete web platform where a student submits one project per event, faculty evaluate it on 
a fixed rubric with designation-weighted scores, every student gives exactly one peer point, and results publish 
to a public leaderboard. 
1. A full set of required pages covering submission, review, voting, and results. 
2. A scoring engine combining weighted faculty scores with capped peer votes. 
3. A role system with student, faculty, admin, and public access levels. 
4. An admin panel controlling the full event lifecycle from creation to published results. 
5. Auto-verification that submitted preview links are live. 
5. Requirements 
The platform must cover twelve required page types and the full journey from student registration to published 
results. 
5.1 Required Pages 
1. Public landing page with active event highlights and a leaderboard preview. 
2. Registration and login with college email restriction and role-based verification states. 
3. Student dashboard showing own submission, vote status, and event deadlines. 
4. Project submission form with title, abstract, tech tags, GitHub URL, preview URL, and screenshots. 
5. Project browse page listing all submissions with tag, department, and review-status filters. 
6. Project detail page with repo link, live/down preview badge, screenshots, and GitHub activity stats including 
commit count and last commit date. 
7. Faculty review page with criterion-by-criterion rubric scoring and comment fields. 
8. Peer voting interaction on project cards with a single transferable point per student. 
9. Public leaderboard page with rank, score, team, and preview links. 
10. Student results page with criterion-wise score breakdown and all faculty comments. 
11. Admin panel covering event lifecycle, faculty verification, and weight configuration. 
12. At least one empty state, for no submissions, no reviews yet, or unranked projects. 
5.2 Roles and Access 
Role Access 
Student Submit 1 project per event, edit until deadline, cast 1 peer vote, view own feedback 
after results 
Faculty Review any project via rubric, blocked from reviewing own guided projects 
Admin Create events, verify faculty, configure weights and rubric, publish results, export data 
Public View published leaderboard and project showcase pages, no login 
5.3 Scoring Weightage 
Faculty ratings are averaged using designation weights. Students do not rate; each student holds exactly one 
point per event. 
Evaluator Weight 
Vice Chancellor 10 
Dean 8 
HOD 6 
Professor 5 
Associate Professor 4 
Assistant Professor 3 
Student (peer vote) 1 point per student per event 
● Faculty score is a weighted average, not a sum, so one senior review cannot outweigh a panel. 
● All student points are normalized against the highest-voted project in the event. 
● Final score = faculty score × 0.85 + peer score × 0.15. The split is admin-configurable. 
● A project needs a minimum of 3 faculty reviews to appear on the leaderboard. 
5.4 Review Rubric 
Each faculty review rates six criteria from 1 to 10. 
Criterion Weight 
Innovation / Originality 20% 
Technical Depth 25% 
Code Quality 20% 
UI / UX 15% 
Documentation 10% 
Working Live Demo 10% 
● One review per faculty per project, editable until the review deadline. 
● An overall written comment of at least 30 characters is mandatory, so every student receives feedback. 
5.5 Peer Voting Rules 
● Voting opens only after the submission deadline, so everyone votes on final versions. 
● A student cannot vote for their own project or their own team's project. 
● The point is transferable until the review deadline; moving it shows where it currently sits. 
● Vote counts stay hidden from everyone until results are published. 
● The highest-voted project earns a People's Choice badge independent of final rank. 
5.6 Submission-to-Results Flow Sequence 
● The full journey is shown across distinct pages in the correct order: register → verify → submit → 
preview check → faculty review and peer voting in parallel → score computation → admin publish → 
leaderboard and feedback. 
● Each journey step has a matching page or page state in the platform. 
● GitHub URL and preview URL are shown as two separate fields, preview optional. 
● Preview links are checked once at submission time, then rechecked on a recurring interval of 6 hours or 
shorter, with the live or down badge showing the latest result. 
5.7 Navigation and Structure 
● Persistent navigation visible on landing, browse, dashboard, and leaderboard pages. 
● Clear back navigation on project detail, review, and submission pages. 
● Project detail links forward to the review page (faculty) and vote action (student) through distinct, role
gated actions. 
6. Visual and Technical Specs 
Spec 
Requirement 
Frontend 
Backend / Database 
Next.js 14 (App Router), Tailwind CSS 
Supabase: Postgres, Auth, Storage, Row-Level Security 
Background jobs 
Edge functions or cron for preview health checks and GitHub metadata 
sync 
Responsive breakpoints 
Minimum tap target 
360 px mobile minimum, 1280 px desktop review layout 
44 × 44 px for any interactive element on mobile 
Safe margin 
Performance 
Minimum 16 px side padding on all mobile layouts 
Page load under 2 seconds on campus Wi-Fi conditions 
Concurrency 
Accessibility 
500 concurrent users during result publication 
WCAG AA on all public pages 
6.1 Color Palette 
Purpose 
Color name 
Hex 
Primary 
Deep Navy 
Secondary 
#0F2A4A 
Bright Cyan 
Accent 
#22B8CF 
Amber Gold 
Success 
#F5A623 
Leaf Green 
Neutral Background 
#2F9E44 
Paper White 
#FAFBFC 
● No more than two additional supporting colors, each named with a hex code. 
● Status states use consistent color coding: live preview green, down preview red, unranked grey, 
pending verification amber. 
● No heavy dark theme as the primary background; an optional dark mode may come later. 
6.2 Typography 
Usage 
Font 
Notes 
Page titles and headings 
Any geometric or grotesque sans 
serif 
Bold weight, no script or decorative fonts 
Body text 
Any sans serif 
Regular weight, minimum 14px equivalent 
size for readability 
Buttons, badges, and labels 
Any sans serif 
Medium or semibold weight, consistent 
across all pages 
Not allowed: brush fonts, handwriting style fonts, heavily decorative or novelty fonts. 
7. Design Direction 
7.1 Do 
● Use card-based layouts with clear score and status badges. 
● Keep each page focused on one primary task per role. 
● Use strong visual hierarchy so a leaderboard scans in seconds. 
● Use consistent spacing, tables, and component styling across all pages. 
7.2 Do Not 
● A cluttered, portal-style layout with competing sidebars. 
● Small, dense text blocks in the faculty review interface. 
● Separate, inconsistent layouts for student and faculty beyond role-specific actions. 
● Any payment screen, form, or gateway UI. 
8. Reference Materials 
The references below show the tone and general structure expected for this platform. 
8.1 Visual Mockups 
Asset 
Applies to 
data/landing_reference.png 
data/dashboard_reference.png 
Public landing page 
Student dashboard 
data/submission_reference.png 
data/faculty_review_reference.png 
Project submission form 
Faculty review page 
data/leaderboard_reference.png 
Public leaderboard page 
These five images show the intended layout, navigation, and component structure for their respective pages. 
Where a reference conflicts with a written requirement elsewhere in this brief, the written requirement takes 
priority. 
8.2 Pattern References 
Pattern 
Reference description 
Submission gallery pattern 
Hackathon-style project gallery pages with one card per project showing 
name, tags, and a preview link 
Leaderboard pattern 
Competition ranking tables with rank, name, and score columns sorted by 
score 
Rubric review pattern 
Conference review forms pairing one score field with one comment field 
per criterion 
Single-vote pattern 
Community upvote models where each account holds one movable vote, 
adapted here to one point per event 
Each reference describes the general structure expected, not an exact layout to copy. Where a reference conflicts 
with a written requirement in this brief, the written requirement takes priority. 
9. Deliverables 
# 
Item 
Format 
1 
Deployed web application 
Live URL on free-tier hosting 
2 
Database schema with RLS policies 
SQL migration files 
3 
Scoring engine 
Server-side module with unit tests 
4 
Admin panel 
Included in the deployed app 
5 
Setup and handover document 
PDF or DOCX 
9.1 File Naming 
All repository files and documents follow the pattern skill-hunt_[item-name]_v[N].[ext], using lowercase kebab 
case with no spaces. 
Example: skill-hunt_handover-doc_v1.pdf 
9.2 Folder Structure 
skill-hunt/    
01_Application/      
skill-hunt_deployed-url_v1.pdf    
02_Schema/      
skill-hunt_schema_v1.sql    
03_ScoringEngine/      
skill-hunt_scoring-engine_v1.zip    
04_AdminPanel/      
skill-hunt_admin-guide_v1.pdf    
05_Handover/      
skill-hunt_handover-doc_v1.pdf 
9.3 Build and Submission Requirements 
● The application is deployed and reachable at a live URL at submission time, not only runnable locally. 
● The repository includes the schema migration files exactly as applied to the deployed database. 
● The scoring engine tests run with a single documented command with all tests passing. 
● Seed data includes at least one demo event, five demo projects, three faculty accounts of different 
designations, and ten student accounts, so a reviewer can inspect every page state without manual 
setup. 
● All environment variables and setup steps are listed in the handover document with no undocumented 
configuration. 
10. Scope Boundaries 
10.1 Do 
● Build one platform for one institution, Skill Hunt University only. 
● Cover the full journey from registration to published results. 
● Enforce one submission and one vote per student per event at the database level. 
● Keep all score computation server-side with reviews immutable after the deadline. 
10.2 Do Not 
● Build multi-college or multi-tenant SaaS support of any kind. 
● Host project code or run submitted applications on the platform. 
● Include payment, billing, or subscription features. 
● Include plagiarism detection beyond visible GitHub activity stats. 
● Integrate with university ERP or internal marks in this version. 
11. Tool Requirements 
No specific IDE or design tool is required. The stack is fixed to Next.js and Supabase for the build; the 
developer may use any supporting tools, provided the deliverables match the listed formats and the deployment 
runs on free-tier infrastructure suitable for a single college. 
12. Acceptance Checklist 
1. All twelve required page types are present and match the brief. 
2. The full submission-to-results journey works across distinct pages in order. 
3. Faculty scores compute as a designation-weighted average, verified against the formula. 
4. Each student can cast exactly one vote, cannot self-vote, and can transfer it until the review deadline. 
5. Vote counts remain hidden until results are published. 
6. Projects with fewer than 3 faculty reviews appear as unranked, not ranked. 
7. The final score respects the 85/15 faculty-peer split, and the split is admin-configurable. 
8. Preview links show a live or down badge that updates on the recurring health check. 
9. Every published result includes written faculty feedback visible to the student. 
10. All five deliverables are present and follow the naming convention. 
13. Evaluation Criteria 
● Completeness of the twelve required page types. 
● Accuracy of the scoring engine against the stated formulas and weights. 
● Correct enforcement of one submission and one vote per student per event. 
● Correct role gating: students cannot review, faculty cannot vote, guides cannot review own projects. 
● Visual consistency with the stated palette and design direction. 
● Usability of navigation across student, faculty, and admin journeys. 
● Reliability of the preview health check and GitHub stats display. 
● Clarity and completeness of the handover document. 
14. Final Goal 
The finished platform gives Skill Hunt University a complete, ready-to-run project showcase where a student 
submits once, a weighted panel judges fairly, every peer voice counts exactly once, and results publish to a 
leaderboard the whole college can see. A reviewer should be able to follow the journey from registration to 
results, verify every score against the stated formulas, and read written feedback on every project. The result 
should feel like one credible, competitive, easy-to-use platform. 
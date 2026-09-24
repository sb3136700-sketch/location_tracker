# 🎓 CAMPUSONE — Smart Campus Super Application

**Tagline:** *Move Smarter. Stay Safer. Study Better. Stay Connected.*

CampusOne unifies disconnected campus systems into a single, high-performance responsive web application for students, faculty, security, and administrators.

---

## 🚀 Key Modules & Architecture

1. **🚍 MOVE (Bus Tracker & Proximity System)**
   - Live interactive route map (OpenStreetMap & Leaflet) with simulated GPS labeled accurately
   - Real-time bus tracking, ETA countdown, speed, capacity, and route direction
   - **Haversine Proximity Engine**: Alerts students when their bus is within 500m of their preferred stop (e.g. *Main Gate*)
   - Background notification & Service Worker push integration with graceful fallback
   - Server-side SMS provider adapter architecture (keys protected server-side)

2. **🛡️ SAFETY (Emergency SOS & Campus Alerts)**
   - One-tap SOS dispatcher with categories: Medical, Security, Fire, Transport, Other
   - Permission-governed browser GPS location capture with clear consent
   - Unique SOS reference ID generation (`SOS-XXXXXX`)
   - Direct emergency hotline contacts (Campus Security, Medical Room, Transport Control, Women Support, College Office)
   - Filterable campus broadcast alerts (Emergency, Transport, Academic, Events, Placement)

3. **📚 STUDY (Smart Timetable & AI Study Planner)**
   - Smart daily & weekly schedule highlighting current class with countdown
   - Dynamic attendance tracking with configurable threshold (75% default) and risk indicator
   - Assignment tracker with priorities and one-click completion
   - **AI-Powered Study Planner**: Uses Google Gemini to generate custom study and revision timetables based on weak subjects, exam dates, and available hours

4. **🏫 CAMPUS LIFE (Notices, Lost & Found, Events)**
   - Department notices with category filters and unread badges
   - **Intelligent Lost & Found matching**: Computes similarity scores between lost reports and found items
   - Campus events showcase with seat booking, category filters, and `.ics` calendar sync

5. **🤖 CAMPUSONE AI ASSISTANT**
   - Floating interactive assistant answering queries about next class, next bus, attendance status, pending assignments, and campus directions
   - Server-side `@google/genai` integration with zero client key exposure and instant fallback

6. **🛠️ ADMIN PORTAL**
   - Live bus control: Add/edit buses, change status (On route, Delayed, Near campus, Arrived, Offline), update lat/lng coordinates and ETA
   - Attendance management: Real-time risk lists, manual adjustments, and low-attendance notifications
   - Emergency dispatch console: Live SOS incident monitor with status updates
   - Campus alerts and notice publishing
   - User administration: View, edit, and deactivate accounts

---

## 🔑 Demo Credentials (Symposium 5-Minute Flow)

The application includes an instant 1-click login on the authentication screen:

| Role | Email / ID | Password | Access |
|---|---|---|---|
| **Student** | `student@campusone.demo` | `student123` | Full Student Portal |
| **Admin** | `admin@campusone.demo` | `admin123` | Full Admin Operations Console |

*Note: Entering invalid credentials displays `"Invalid credentials. Access denied."` and blocks access.*

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Leaflet Maps
- **Backend**: Node.js Express server with Vite middleware proxy
- **AI**: `@google/genai` (Gemini 3.8 Flash model)
- **Database**: Supabase PostgreSQL schema (`supabase/schema.sql`) with Row-Level Security (RLS) & local resilient storage
- **PWA**: Web App Manifest (`manifest.json`), Service Worker (`sw.js`), Notification API

---

## 📦 Running & Deployment

### Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Production Build (Vercel & Cloud Run compatible)
```bash
npm run build
npm start
```

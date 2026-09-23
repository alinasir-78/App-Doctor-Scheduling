# 📱 Multi-Doctor WhatsApp AI Scheduling Agent

A professional, text-based WhatsApp AI appointment scheduling agent and clinic management hub. Built specifically for **Meta WhatsApp Business Cloud API**, with a mobile-responsive dashboard for administrators and doctors.

> **Note**: This is a pure WhatsApp scheduling solution—**no voice calls or callback features needed**. All client interactions, slot selections, confirmations, and reminders happen directly via WhatsApp text.

---

## 🎯 Features Overview

1. **Pure WhatsApp Text Booking Flow**:
   - Clients message the business WhatsApp number to book, view, reschedule, or cancel appointments.
   - Professional English persona configured specifically for your client's business.
   - Real-time availability calculation preventing overlapping bookings.

2. **Multi-Doctor & Multi-Specialty Support**:
   - Register multiple doctors, each with their own specialty, consultation fee, working shifts, and personal phone number.
   - Clients can choose a specific doctor, select a service to be matched with a specialist, or request the first available doctor.

3. **Multi-Patient Family Registration (1 Number, Multiple Profiles)**:
   - A single WhatsApp phone number can register multiple family members (Self, Child, Spouse, Parent).
   - Agent asks *"Who is this appointment for?"* and displays saved profiles with 1-click selection or *"Add new family member"*.

4. **24-Hour Automated Confirmation (Confirmed vs. Tentative)**:
   - AI agent pings clients 24 hours prior to their visit with 1-click `CONFIRM`, `RESCHEDULE`, or `CANCEL` actions.
   - If confirmed: Marked `🟢 Confirmed`.
   - If unconfirmed: Automatically shifted to `🟡 Tentative` so doctors know to hold or release the slot.

5. **Doctor Personal Notifications & Self-Service**:
   - The assigned doctor receives real-time SMS/WhatsApp alerts on their personal number for every booking, reschedule, and cancellation.
   - Doctors can text from their personal phone:
     - `schedule` — view today and tomorrow's appointments.
     - `unavailable tomorrow [reason]` — block slots and automatically flag impacted patients for rescheduling.

6. **Doctor Unavailability & Blackout Planner**:
   - Mark vacations, seminars, or time blocks in the dashboard.
   - Automatically detects booking conflicts and prompts automated patient rescheduling.

7. **Flexible for Any Business**:
   - Easily adaptable for Medical Clinics, Dental Practices, Therapy, Spas, Law Offices, and Consultants.

---

## 📲 How to Run & Access on Mobile Phone

There are two primary ways to operate this for your clients:

### 🌟 Method 1: Cloud Hosted + Mobile Web Management (Recommended for Clients)
Because WhatsApp needs to send webhooks to your server 24/7, the standard production approach is:
1. Deploy the Node.js backend to a cloud host (Render, Railway, Fly.io, or VPS).
2. The client bookmarks the portal link (e.g., `https://clinic-scheduler.com`) on their smartphone's home screen.
3. The dashboard is **100% mobile-responsive**—the doctor or clinic owner can configure schedules, check the weekly calendar, and manage bookings right from their mobile browser.
4. Patients interact seamlessly with the business's official WhatsApp number.

### 📱 Method 2: Running Locally on Android via Termux
If you or your client wish to run the Node.js backend directly on an Android smartphone:
1. Install **Termux** from F-Droid on the Android phone.
2. Transfer this zip file to the phone and extract it.
3. Open Termux and run:
   ```bash
   pkg update && pkg install nodejs git
   cd /path/to/extracted/whatsapp-doctor-agent
   npm install
   node src/server.js
   ```
4. Access the dashboard on the phone browser at `http://localhost:3000`.
5. To connect to WhatsApp Webhook, expose port 3000 to the internet using **Cloudflare Tunnel** (`cloudflared`) or **ngrok**:
   ```bash
   pkg install cloudflared
   cloudflared tunnel --url http://localhost:3000
   ```
   Paste the generated public URL into your Meta WhatsApp webhook settings.

---

## ⚡ Quickstart on Computer / VPS

```bash
# 1. Extract the zip file and enter directory
unzip whatsapp-doctor-agent.zip
cd whatsapp-doctor-agent

# 2. Run the quickstart script
./start.sh
# Server starts at http://localhost:3000
```

---

## 🌐 Connecting Meta WhatsApp Business Cloud API

1. Go to [Meta for Developers](https://developers.facebook.com) -> Create App -> Business.
2. Add **WhatsApp** product.
3. In the WhatsApp API Setup:
   - Note your **Phone Number ID** and **Access Token**.
4. In WhatsApp **Configuration**:
   - Webhook Callback URL: `https://your-server-domain.com/api/whatsapp/webhook`
   - Verify Token: `apex_clinic_secure_webhook_token_2026` (or whatever you customize in settings).
   - Under Webhook fields, subscribe to **`messages`**.
5. In the Clinic Dashboard (**⚙️ Clinic Persona & WhatsApp Setup**):
   - Enter your Phone Number ID and Access Token.
   - Click **Save All Changes**.

---

## 📂 Project Structure

```
whatsapp-doctor-agent/
├── src/
│   ├── database.js          # SQLite database schema & seed data
│   ├── slotManager.js       # Dynamic slot calculation & conflict detection
│   ├── aiAgent.js           # Conversational AI state machine (English only)
│   ├── reminderScheduler.js # 24h confirmation checker & status transition
│   ├── whatsappService.js   # Meta Cloud API webhook handler & message sender
│   └── server.js            # Express REST API & static server
├── public/
│   ├── index.html           # Clinic portal & interactive WhatsApp phone simulator
│   ├── app.js               # Reactive frontend logic
│   └── styles.css           # Clean, mobile-responsive medical styling
├── DEPLOYMENT_GUIDE.md      # Comprehensive production deployment manual
├── README.md                # Project overview & instructions
├── start.sh                 # One-click startup script
└── package.json             # Node.js dependencies
```

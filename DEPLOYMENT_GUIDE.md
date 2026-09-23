# 🚀 Multi-Doctor WhatsApp AI Scheduling Agent — Production Deployment Guide

This system is an enterprise-grade, multi-doctor appointment scheduling AI agent built for **WhatsApp Business Cloud API** with a real-time clinic management dashboard, dynamic doctor schedule configurator, 24-hour automated confirmation engine, multi-patient family registry, and instant doctor notifications.

---

## 🌟 Key Architecture & Capabilities

1. **Meta WhatsApp Cloud API Native Integration**
   - Official webhook endpoint at `/api/whatsapp/webhook`
   - Handles GET verification (`hub.challenge`, `hub.verify_token`)
   - Handles POST inbound events (text messages, quick replies, list selections)
   - Dispatches outbound WhatsApp messages via Meta Graph API v20.0

2. **Multi-Doctor Schedule & Availability Management**
   - Register unlimited doctors with custom specialties, colors, bios, and personal alert numbers.
   - Individual working days (Mon–Sun), shift hours, lunch breaks, slot durations, and buffer times.
   - Real-time slot calculator preventing double bookings across all doctors.

3. **Doctor Leave & Unavailability (Automated Patient Rescheduling)**
   - Doctors can report vacations, CME conferences, or urgent leave.
   - Automatically detects conflicting patient appointments and initiates 1-click or automated WhatsApp rescheduling.
   - Doctors can report unavailability directly from their personal WhatsApp numbers!

4. **Multi-Profile Registration (Multiple Names Under 1 WhatsApp Number)**
   - When a parent or family coordinator books, the agent asks:
     - *"Who is this appointment for? 1. Sarah (Self), 2. Leo (Child), 3. Robert (Spouse), or NEW family member"*
   - Remembers all family members permanently.

5. **24-Hour Automated Confirmation Engine**
   - Automated routine pings patients 24 hours prior to appointment.
   - If confirmed: status remains `🟢 Confirmed`.
   - If unconfirmed: automatically marked `🟡 Tentative` with visual indicators on the owner's weekly calendar.

6. **Instant Notifications on Doctor's Personal Phone**
   - Real-time alerts sent to the specific doctor's personal phone whenever a booking is created, rescheduled, or cancelled.

7. **Flexible for Any Business**
   - Easily adaptable for dental clinics, law firms, spas, wellness centers, therapy, and consultants via the Clinic Persona & Services settings.

---

## 🛠️ Local Run & Testing

```bash
# 1. Clone or navigate to the directory
cd /home/user/whatsapp-doctor-agent

# 2. Install dependencies
npm install

# 3. Start the application
npm start
# Default port is 3000 (http://localhost:3000)
```

---

## 🌐 Meta WhatsApp Cloud API Setup (Step-by-Step)

### Step 1: Create a Meta Developer App
1. Go to [developers.facebook.com](https://developers.facebook.com).
2. Create an App -> Choose **Business** type.
3. Under "Add products to your app", click **Set up** on **WhatsApp**.

### Step 2: Get Your Credentials
1. In the WhatsApp -> **API Setup** page:
   - Copy **Temporary Access Token** (or create a System User Permanent Token in Business Settings).
   - Copy **Phone Number ID**.
   - Note the Test WhatsApp number provided by Meta.

### Step 3: Configure Webhook & Subscribe WABA
1. Under WhatsApp -> **Configuration**:
   - Callback URL: `https://your-domain.com/api/whatsapp/webhook`
   - Verify Token: Enter your configured token (default in app: `apex_clinic_secure_webhook_token_2026`)
2. Click **Verify and Save**.
3. Under **Webhook fields**, click **Manage** and check `messages`.
4. **CRITICAL: Subscribe your WhatsApp Business Account (WABA) to the App**:
   By default in Meta Cloud API, webhooks are configured at the App level, but incoming messages from real WhatsApp users are routed through the WhatsApp Business Account (WABA).
   If your WABA is not subscribed, Meta will not forward incoming customer messages to your webhook URL!

   You can subscribe in either of two ways:
   - **Method A (Easiest - via Clinic Portal)**: Go to **⚙️ Clinic Persona & WhatsApp Setup** -> enter your **WABA ID** (`2231026294424950`) and **Access Token** -> click **"🔗 Subscribe WABA to Webhook"**.
   - **Method B (via curl)**:
     ```bash
     curl -X POST "https://graph.facebook.com/v20.0/2231026294424950/subscribed_apps" \
          -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
     ```
     You will receive `{"success": true}`. Real incoming messages from WhatsApp will now immediately hit your webhook!

### Step 4: Add Recipient Phone in Meta Test Sandbox (If in Development Mode)
If your Meta App is in **Development Mode** (Sandbox):
- WhatsApp requires you to add your personal phone number as an allowed recipient before Meta allows test conversations.
- In Meta App Dashboard -> **WhatsApp** -> **API Setup**:
  Look at **Step 1: Select phone numbers**. Under **"To"**, click the dropdown and choose **"Manage phone number list"**.
  Add your personal phone number and enter the 6-digit verification code Meta sends to your WhatsApp.
- Send the sample template message from Meta console to your phone to initiate the 24-hour customer service window, or send a message from your verified phone directly to the Meta phone number (`+1 555 159 5073`).

### Step 5: Add Credentials in the Admin Portal
1. Open the clinic dashboard -> **⚙️ Clinic Persona & WhatsApp Setup**.
2. Paste:
   - Phone Number ID (e.g., `1351164651405799`)
   - WhatsApp Business Account (WABA) ID (e.g., `2231026294424950`)
   - Meta Access Token
   - Webhook Verify Token
3. Click **Save All Changes**. Outbound WhatsApp messages will now be delivered to real WhatsApp phones!

---

## ☁️ Cloud Deployment Options

### Option A: Deploy on VPS (Ubuntu / Debian + PM2 + Nginx)

```bash
# 1. Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# 2. Clone project and install
git clone <your-repo> /var/www/doctor-agent
cd /var/www/doctor-agent
npm install

# 3. Start with PM2 (daemon & auto-restart on reboot)
pm2 start src/server.js --name "doctor-agent"
pm2 startup
pm2 save

# 4. Configure Nginx Reverse Proxy with SSL (Certbot)
sudo apt install -y nginx certbot python3-certbot-nginx
```

**Nginx Configuration (`/etc/nginx/sites-available/doctor-agent`):**
```nginx
server {
    server_name clinic.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/doctor-agent /etc/nginx/sites-enabled/
sudo certbot --nginx -d clinic.yourdomain.com
sudo systemctl restart nginx
```

---

### Option B: Deploy on Docker

**`Dockerfile`:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

Build and run:
```bash
docker build -t whatsapp-doctor-agent .
docker run -d -p 3000:3000 --name doctor-agent-instance -v $(pwd)/data:/app/data whatsapp-doctor-agent
```

---

## 🔄 Automated 24-Hour Confirmation CRON Job

You can schedule the confirmation check to run every hour using Linux cron:

```bash
# Run hourly scan
0 * * * * curl -s -X POST http://localhost:3000/api/reminders/run -H "Content-Type: application/json" -d '{"forceMarkUnconfirmed": false}' >> /var/log/doctor_agent_cron.log 2>&1
```

Or trigger it on-demand directly from the **AI 24-Hour Confirmation Banner** in the web dashboard!

# CLAUDE.md — Homepage Creation Master Guide

> **Purpose of this file:** When the user says "build me a homepage," proceed step by step from start to finish.
>
> Claude Code manages the entire process and provides detailed guidance for parts the user must handle personally.

---

## 🚀 Getting Started

When the user requests a homepage, follow the **5 Phases** below in order.

```
Phase 1: Planning (Interview)
    ↓
Phase 2: Frontend Development
    ↓
Phase 3: Backend Integration
    ↓
Phase 4: Deployment
    ↓
Phase 5: Admin Page (Optional)
```

**Get user confirmation after completing each Phase before moving on.**

---

# Phase 1: Planning (Interview)

## Claude Code's Responsibilities

1. Conduct interview using the **AskUserQuestion** Tool
2. Identify site type and ask tailored questions

## First Question: Identify Site Type

```
What type of website would you like to build?

A. Sales landing page (product / service / course)
B. Company / brand introduction site
C. Portfolio / personal site
D. Other
```

---

## Type A: Sales Landing Page Interview

> Use **AskUserQuestion Tool** to interview across the areas below for a high-converting landing page.
> Maximum 2–3 questions at a time. If unsure, suggest a default.

### 1️⃣ Product Information (Required)

| Question | Example |
|----------|---------|
| What is the product name? | "30-Day Launch Challenge" |
| What is the price? | $149 |
| What is the product format? | Challenge / eBook / Course / Template / Coaching / Physical product |

### 2️⃣ Target Customer (Essentials only)

| Question | Why it matters |
|----------|----------------|
| Who is this product for? (job, situation) | Headline targeting |
| What is their biggest pain point? | Writing the empathy section |
| What do they truly want? | Emphasizing benefits |
| What makes them hesitate to buy? | FAQ and guarantee copy |

### 3️⃣ Offer Structure

| Question | Example |
|----------|---------|
| Are there bonuses beyond the core product? | Checklist, template, 1:1 feedback, etc. |
| What is the refund/guarantee policy? | "Unconditional refund within 7 days" |
| Is there a scarcity element? | First 50 people / 48-hour limit / price increase coming |
| What should the CTA button say? | "Start Right Now" |

### 4️⃣ Button & Link Setup

| Question | Description |
|----------|-------------|
| Where should the "Apply" button go? | Payment page URL (e.g., Gumroad, Stripe, etc.) |
| Is a free consultation form needed? | Yes/No → if yes, proceed to consultation form interview |

### 5️⃣ Brand Logo (Optional)

| Question | Instructions |
|----------|--------------|
| Do you have a brand logo? | If yes, follow the guide below to place it in the folder |

```
📋 Brand Logo Registration Guide

1. Create a brand_logo folder in the project directory

   📁 project-folder/
   └── 📁 brand_logo/
       └── logo.png (or .svg, .jpg)

2. Place the logo file inside brand_logo/

3. Recommendations:
   - Format: PNG (transparent background) or SVG
   - Width: 200–500px
   - Filename: logo.png, logo.svg, etc.

4. Let us know when done!
   → It will be automatically applied to the landing page header
```

### 6️⃣ Origin Story (Optional, Strongly Recommended)

| Question | Purpose |
|----------|---------|
| What was your situation before? (Before) | Build empathy |
| What pain or failure did you experience? (Struggle) | Build trust |
| What was the turning point? (Turning Point) | Connect to solution |
| How are things different now? (After) | Prove results |

---

## Free Consultation Form Interview

> If a free consultation form is needed, conduct an additional interview to design a multi-step form.

### Consultation Form Question Design

| Question | Example |
|----------|---------|
| What information do you want to collect? | Name, contact, email, message, etc. |
| Any additional questions to ask? | "What's your current situation?", "Budget?", "Preferred timeline?" |
| What message should appear after submission? | "Received! We'll be in touch within 24 hours." |
| Which email should receive form submission alerts? | admin@example.com |

### Consultation Form Features

```
✅ Step-by-step questions in survey format
✅ Submissions saved to Supabase
✅ View submission history in admin page
✅ (Optional) Admin email notification on submission
✅ (Optional) Automatic confirmation email sent to applicant
```

---

### Landing Page Interview Completion Checklist

```
□ Product name, price, and format confirmed
□ Target customer defined
□ Pain points & desires identified
□ Offer structure confirmed (bonuses, guarantee, scarcity)
□ Button link set (Apply → payment page)
□ Consultation form designed (if needed)
□ Brand logo registration guide provided (brand_logo folder)
□ Origin story collected (optional)
□ Design direction / reference images confirmed
```

### Landing Page Output Structure

After completing the interview, write copy and build HTML in this structure:

```
1. Headline (suggest 3 versions)
2. Sub-headline
3. Pain empathy section
4. Solution presentation
5. Product intro + benefit list
6. Offer summary (visual)
7. Guarantee copy
8. 5 FAQs
9. Final CTA (Apply button → links to configured URL)
10. Free consultation form (step-by-step survey format)
11. P.S.
```

**Tone:** Speak the target's language — honest and relatable.

---

## Type B/C/D: General Website Interview

| Area | What to Confirm |
|------|-----------------|
| **1. Target & Purpose** | Who it's for and what the site is meant to achieve |
| **2. Required Pages** | Home, about, services, contact, blog, etc. |
| **3. Core Features** | Consultation form, booking system, payments, etc. |
| **4. Design Direction** | Reference images, colors, tone & manner |
| **5. Backend Needed?** | Form storage, email sending, etc. |
| **6. Admin Page Needed?** | Consultation management, blog management, etc. |

---

## Interview Rules (Common)

- Use **AskUserQuestion Tool**
- Maximum **2–3 questions** at a time
- **Never re-ask** something already confirmed
- "I don't know" or "Just decide for me" → **suggest a reasonable default and confirm**
- **End interview** when: all required areas are complete, or the user says "end interview"

**→ Proceed to Phase 2 after user confirmation**

---

# Phase 2: Frontend Development

## Claude Code's Responsibilities

1. Check `brand_logo/` folder → apply logo to header if present
2. Write HTML/CSS code
3. Apply responsive design
4. Connect button links (Apply → payment page)
5. Screenshot comparison verification (minimum 2 rounds)

### Logo Implementation

```html
<!-- Auto-applied if logo exists in brand_logo folder -->
<header>
  <img src="./brand_logo/logo.png" alt="Brand Logo" class="h-10">
  <!-- ... -->
</header>
```

## Reference Image Rules

- **Reference provided**: Match exactly. No improvements or additions.
- **No reference**: Follow the anti-generic guardrails below for high-quality design.

## Anti-Generic Guardrails

| Item | ❌ Forbidden | ✅ Required |
|------|-------------|------------|
| **Colors** | Tailwind defaults (indigo-500, blue-600) | Custom brand colors |
| **Shadows** | Single `shadow-md` | Layered shadows with color tints |
| **Fonts** | Same font for headings and body | Display + sans-serif combination |
| **Animation** | `transition-all` | `transform` and `opacity` only |
| **Interaction** | No hover states | hover, focus, and active — all three |

## Button State Design (Required)

Implement all states on every button:

```css
/* Default */
.btn { background: #brand-color; }

/* Hover */
.btn:hover { background: #darker-color; transform: scale(1.02); }

/* Focus (keyboard accessibility) */
.btn:focus { outline: none; ring: 2px; ring-color: #brand-color; }

/* Active (click) */
.btn:active { transform: scale(0.98); }

/* Disabled */
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
```

## Button Link Setup

```html
<!-- Apply button → navigates to payment page -->
<a href="https://payment-page-url.com" target="_blank">
  <button class="btn-primary">Apply Now</button>
</a>

<!-- Free consultation button → scrolls to form on page -->
<a href="#consultation-form">
  <button class="btn-secondary">Free Consultation</button>
</a>
```

## Free Consultation Form (Step-by-step Survey)

```html
<!-- Example step-by-step consultation form -->
<form id="consultation-form">
  <!-- Step 1: Basic info -->
  <div class="form-step">
    <label>Name</label>
    <input type="text" name="name" required>

    <label>Phone</label>
    <input type="tel" name="phone" required>

    <label>Email</label>
    <input type="email" name="email" required>
  </div>

  <!-- Step 2: Additional questions (designed in interview) -->
  <div class="form-step">
    <label>Tell us about your current situation</label>
    <textarea name="situation"></textarea>

    <label>What outcome are you hoping for?</label>
    <textarea name="goal"></textarea>
  </div>

  <button type="submit">Submit Consultation Request</button>
</form>
```

## Output Defaults

- Single `index.html` with inline styles
- Tailwind CSS CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive design

## Screenshot Verification

```
1. Serve locally (node serve.mjs)
2. Take screenshot (node screenshot.mjs http://localhost:3000)
3. Compare against reference → fix any mismatches
4. Repeat at least 2 times
```

## Phase 2 Completion Checklist

```
□ All page HTML/CSS complete
□ Responsive design applied
□ Button states (hover, focus, active, disabled) implemented
□ Apply button → payment page link connected
□ Free consultation form UI complete (step-by-step format)
□ Screenshot comparison verification done (minimum 2 rounds)
```

**→ Proceed to Phase 3 after user confirmation**

---

# Phase 3: Backend Integration

> **Skip to Phase 4 if no backend is needed.**

---

## Why Is Backend Needed?

```
[Without backend]
User fills out form → submits → ❌ nothing happens

[With backend]
User fills out form → submits → ✅ data saved → ✅ admin notified
                                              → ✅ viewable in admin page
```

---

## 3-1. Supabase Setup (Data Storage)

### What is Supabase? Why use it?

```
Supabase = cloud database + auto-generated API

Why you need it:
- You need a "warehouse" to store consultation form data
- Like a spreadsheet, but automatically accessible from your website
- You can view submission history in the admin page

Why Supabase:
- Generous free tier (500MB, 50,000 rows/month)
- Simple setup (done in 5 minutes)
- No SQL knowledge required (we provide the queries)
```

### 👤 User's Responsibilities

```
📋 Supabase Setup Guide

1. Go to https://supabase.com → sign up / log in

2. Click "New Project"
   - Project name: [suggested project name]
   - Database password: set a strong password
   - Region: Northeast Asia (or your nearest region)
   - Click "Create new project"

3. Once the project is ready (takes 2–3 minutes):
   - Go to Settings → API
   - Copy these two values and share them:

   ✅ Project URL: https://xxxxxxxx.supabase.co
   ✅ anon public key: eyJhbGci...
```

### 🤖 Claude Code's Responsibilities (after keys are provided)

1. Configure Supabase client
2. Provide table creation SQL
3. Connect form → Supabase save logic
4. Connect admin page → data query logic

---

## Table Creation SQL

### What is SQL and why do we need it?

```
SQL = the language used to give commands to a database

Why you need to create a table:
- You need a "container" to store consultation form data
- Think of it as creating a new sheet in Excel with column headers
- Defines what information to store: name, email, phone, message, etc.

You only do this once:
- Run it once and you're done
- Every form submission automatically adds a new row
```

### SQL Code (run in Supabase SQL Editor)

```sql
-- Create the consultations table
-- (like creating a new sheet in Excel and naming the columns)

CREATE TABLE consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,     -- unique ID (auto-generated)
  name TEXT NOT NULL,                                -- name (required)
  email TEXT NOT NULL,                               -- email (required)
  phone TEXT,                                        -- phone number
  situation TEXT,                                    -- current situation (survey question)
  goal TEXT,                                         -- desired outcome (survey question)
  message TEXT,                                      -- additional message
  status TEXT DEFAULT 'pending',                     -- processing status (pending/done)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  -- submission time (auto)
);

-- Enable security
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit the form
CREATE POLICY "Anyone can insert" ON consultations
  FOR INSERT WITH CHECK (true);
```

---

## 3-2. Resend Setup (Email Sending)

### What is Resend? Why use it?

```
Resend = a service that sends emails via code

Why you need it:
- Send admin notification emails when a consultation is submitted
- Send automatic confirmation emails to applicants
- No need to manually open Gmail and send messages

Why Resend:
- Free tier: 3,000 sends/month
- Simple setup (just needs an API key)
- High deliverability — won't land in spam
```

### 👤 User's Responsibilities

```
📋 Resend Setup Guide

1. Go to https://resend.com → sign up / log in
2. API Keys → Create API Key
3. Copy the key shown (only shown once!)
   ✅ API Key: re_xxxxxxxx...
```

### 🤖 Claude Code's Responsibilities (after key is provided)

1. Create email sending API route
2. Connect auto-send on form submission:
   - To admin: "New consultation request received"
   - To applicant: "Your consultation request has been submitted"

### 📧 Email Sending Structure (FROM vs TO)

```
┌─────────────────────────────────────────────────────────┐
│  FROM (sender)          →    TO (recipient)             │
│  ─────────────────           ─────────────              │
│  Requires Resend domain       Any email works           │
└─────────────────────────────────────────────────────────┘
```

| Type | Description | Example |
|------|-------------|---------|
| **FROM (sender)** | Domain verification needed. Without it, sends from `onboarding@resend.dev` | `noreply@yourdomain.com` |
| **TO (recipient)** | Any email works. Unrelated to your Resend account | `admin@gmail.com` |

```javascript
// Code example
await resend.emails.send({
  from: 'onboarding@resend.dev',  // Resend default (no domain verification)
  to: 'myemail@gmail.com',        // 👈 notification email (any address works)
  subject: 'New consultation request received',
  html: '...'
});
```

**Summary:**
- Email to receive form notifications = **any email** (Gmail, etc.)
- Resend account email = for login only, unrelated to sending/receiving
- Domain verification = only needed if you want FROM to show your own domain

---

## 3-3. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
RESEND_API_KEY=re_xxxxxxxx...
```

### ⚠️ Security Rules

- ❌ Never hardcode API keys directly in code
- ❌ Never commit `.env` files to GitHub
- ✅ Always add `.env` to `.gitignore`

## Phase 3 Completion Checklist

```
□ Supabase setup complete
□ Table creation SQL executed
□ Form submission → DB save test successful
□ Submission history viewable in admin page
□ (Optional) Resend setup complete
□ (Optional) Email sending test successful
□ .env.local created, .gitignore verified
```

**→ Proceed to Phase 4 after user confirmation**

---

# Phase 4: Deployment (Vercel)

## Why GitHub and Vercel?

```
Current state:
- Only visible on your computer (localhost)
- No one else can access it

Why GitHub:
- A "repository" that stores code on the internet
- Acts as a backup (safe even if your computer breaks)
- Vercel pulls code from here

Why Vercel:
- Turns your code into a real website
- Provides a publicly accessible URL from anywhere
- Free HTTPS (secure connection) included
- Automatically redeploys when code changes

Flow:
Your computer → GitHub (store code) → Vercel (deploy website)
                                            ↓
                              https://your-site.vercel.app
```

---

## 4-1. GitHub Setup

### 👤 User's Responsibilities

```
📋 Create a GitHub Repository

1. Go to https://github.com → log in
2. Click "+" → "New repository"
3. Share the generated URL:
   ✅ https://github.com/[username]/[repo-name]
```

### 🤖 Claude Code's Responsibilities

```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin [URL] && git push -u origin main
```

---

## 4-2. Vercel Deployment

### 👤 User's Responsibilities

```
📋 Vercel Deployment Guide

1. Go to https://vercel.com → log in with GitHub
2. "Add New..." → "Project"
3. Select your repository → Import → Deploy
4. Share the URL after completion:
   ✅ https://[project-name].vercel.app
```

---

## 4-3. Environment Variables in Vercel

### Why register environment variables in Vercel?

```
Your .env.local file only exists on your computer.
Vercel's servers don't know about it — you need to tell them separately.

Vercel environment variables = telling Vercel's servers your API keys
```

### 👤 User's Responsibilities

```
Vercel → Settings → Environment Variables

NEXT_PUBLIC_SUPABASE_URL = [value]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [value]
RESEND_API_KEY = [value]

→ Save and Redeploy
```

---

## 4-4. Custom Domain (Optional)

```
Vercel → Settings → Domains → enter your domain

DNS settings:
- A record: @ → 76.76.21.21
- CNAME: www → cname.vercel-dns.com
```

## Phase 4 Completion Checklist

```
□ GitHub push complete
□ Vercel deployment complete
□ Environment variables registered and redeployed
□ Form submission test on deployed site successful
□ (Optional) Custom domain connected
```

**→ Proceed to Phase 5 if needed, after user confirmation**

---

# Phase 5: Admin Page (Optional)

> **Skip if not needed.**

## 🤖 Claude Code's Responsibilities

1. Create admin page
2. Implement password protection
3. Connect to Supabase (query consultation submission list)

## Admin Page Structure

| Tab | Feature |
|-----|---------|
| **Consultation Management** | View submission list, update status (pending → done) |
| **Detail View** | View full survey responses for each submission |
| **Statistics** | Total submissions, today's count, etc. |

## Admin Page UI Example

```
┌─────────────────────────────────────────────────────────┐
│  📋 Consultation Management                             │
├─────────────────────────────────────────────────────────┤
│  Name       | Email            | Status  | Date    | Detail │
│  ─────────────────────────────────────────────────────  │
│  John Doe   | john@email.com  | Pending | Jan 24  | [View] │
│  Jane Smith | jane@email.com  | Done    | Jan 24  | [View] │
│  Bob Lee    | bob@email.com   | Pending | Jan 24  | [View] │
└─────────────────────────────────────────────────────────┘
```

## Security Requirements

```
□ Password protection implemented
□ Hard-to-guess route path (/dashboard-x7k2, etc.)
□ Session timeout configured
```

## Phase 5 Completion Checklist

```
□ Admin page code complete
□ Password protection working
□ Consultation submission list loading from Supabase
□ Status update feature working
□ Deployed and tested
```

---

# 🔒 Security Checklist

| Area | Items |
|------|-------|
| **Authentication** | AuthN/AuthZ separation, least privilege |
| **Attack Prevention** | CORS, CSRF, XSS, SQL injection |
| **Communication** | HTTPS, security headers, cookie security |
| **Operations** | Rate limiting, secret management, audit logs |

---

# ⚠️ Strict Rules

## Absolutely Forbidden

- Starting code before completing the interview
- Hardcoding API keys directly in code
- Deploying admin page without password protection
- Using `transition-all`
- Using Tailwind default blue/indigo as the main color
- Deploying buttons without hover/focus/active states

## Always Required

- Conduct interview using **AskUserQuestion Tool**
- Get user confirmation after each Phase
- Provide detailed guides for anything the user must do themselves
- Store all environment variables in `.env` files only
- Apply all button states on every button

---

# 🎯 Full Process Summary

```
Phase 1: Planning ──────────────────────────────────────┐
  └── Interview via AskUserQuestion Tool                │
  └── Sales landing: product/target/offer/link/form     │
        ↓                                               │
Phase 2: Frontend Development ─────────────────────────┤
  └── HTML/CSS, button states, form UI                  │
  └── Apply button → payment page link                  │
  └── Consultation form → step-by-step survey           │
        ↓                                               │
Phase 3: Backend Integration ──────────────────────────┤
  └── Supabase: save consultation form data             │  🤖 Claude Code
  └── Resend: send email notifications                  │  👤 User Collaboration
        ↓                                               │
Phase 4: Deployment ───────────────────────────────────┤
  └── GitHub: code repository                          │
  └── Vercel: website deployment                       │
        ↓                                               │
Phase 5: Admin Page (Optional) ─────────────────────────┘
  └── View & manage consultation submissions

✅ Done!
```

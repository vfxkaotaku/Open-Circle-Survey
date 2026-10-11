# 📊 Google Sheets Setup Guide for Open Circle Form

Follow these simple steps to connect your **Open Circle Registration Survey** to your **Google Spreadsheet**. Every time someone submits the form, a new row will automatically appear in your sheet!

---

## ⚡ Quick 3-Minute Setup

### Step 1: Create a New Google Sheet
1. Go to [sheets.new](https://sheets.new) in your web browser.
2. Name your spreadsheet at the top left, for example:  
   `Open Circle - Community Survey Responses`
3. Leave the sheet blank — **our script will automatically create, format, and freeze all 18 column headers with OpenSkool dark & neon styling!**

---

### Step 2: Open Apps Script
1. In the Google Sheets top menu, click **Extensions** → **Apps Script**.
2. A new tab will open with code editor showing `function myFunction() { ... }`.
3. Select everything in the editor and **delete it**.

---

### Step 3: Paste the Connector Script
1. Open [`GoogleAppsScript.js`](GoogleAppsScript.js) in this folder.
2. Copy all the code from that file and paste it into the Google Apps Script editor.
3. Click the **Save** icon (💾) or press `Ctrl + S`.
4. Name your project (e.g., `Open Circle Webhook`).

---

### Step 4: Deploy as a Web App (Critical Settings)
1. Click the blue **Deploy** button at the top right → select **New deployment**.
2. Click the **gear icon (⚙️)** next to *Select type* → choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Open Circle Survey API`
   - **Execute as**: `Me (<your-email>@gmail.com)`
   - **Who has access**: **`Anyone`** ⚠️ *(Must be set to "Anyone" so visitors can submit the form)*
4. Click **Deploy**.

---

### Step 5: Authorize Permissions
1. Google will prompt: *"Authorization required"*. Click **Authorize access**.
2. Choose your Google account.
3. If you see *"Google hasn’t verified this app"*:
   - Click **Advanced** (small link at bottom left).
   - Click **Go to Open Circle Webhook (unsafe)**.
   - Click **Allow**.
4. Once deployed, you will see a box with your **Web app URL** that looks like:  
   `https://script.google.com/macros/s/AKfycby.../exec`
5. Click **Copy** to copy this URL.

---

### Step 6: Connect to Your Webpage
You have **two easy ways** to connect the URL:

#### Method A: Right in the Browser (No Code Editing Needed!)
1. Double-click [`open_circle_registration.html`](open_circle_registration.html) to open it in Chrome/Edge.
2. Advance through to **Step 4 (Review)**.
3. You will see a box above the Submit button:  
   `Google Sheet: ○ Demo Mode` → Click **"Connect / Set Sheet URL"**.
4. Paste your Web app URL and click **OK**.
5. It will turn green: `● Live Connected`! Any submission from this browser will now be sent directly to your sheet!

#### Method B: Paste into the Code (Permanent for all users)
1. Open [`open_circle_registration.html`](open_circle_registration.html) in your code editor.
2. Go to line ~453 inside the `<script>` tag:
   ```javascript
   var GOOGLE_SHEET_URL = "PASTE_YOUR_WEB_APP_URL_HERE";
   ```
3. Save the file. Now anyone who opens the form will have their submissions sent to your Google Sheet!

---

## 🧪 How to Test It

### Test from Apps Script:
In the Apps Script editor toolbar, change the function dropdown from `doPost` to **`testSubmit`** and click **Run**.  
Switch to your Google Sheet tab — you will instantly see a formatted header row and a test row!

### Test from the Webpage:
Open [`open_circle_registration.html`](open_circle_registration.html), fill out the survey, and click **Complete & Submit**.  
A new row with all selected tools, models, quiz answer, and interests will appear in your Google Sheet immediately.

---

## 📋 Columns Recorded in Google Sheets

| # | Column Header | Description |
|---|---|---|
| 1 | **Submission Time** | Timestamp in IST / local time |
| 2 | **Full Name** | Participant's name |
| 3 | **Email Address** | Email for community invite & communication |
| 4 | **College / Organization / Company** | College or workplace |
| 5 | **Current Role** | Student / Professional / Educator etc. |
| 6 | **Field of Study / Work** | e.g. Computer Science, AI, Mechanical |
| 7 | **Devices Used for AI** | Laptop, Phone, Tablet, etc. (with "Other" expanded) |
| 8 | **AI Tools Used** | ChatGPT, Gemini, Claude, Copilot, etc. |
| 9 | **Pro / Advanced AI Models** | Claude 3.5, GPT-4o, DeepSeek, Llama, etc. |
| 10 | **AI Use Cases** | Coding, Studying, Research, Design, etc. |
| 11 | **AI Confidence Level** | 1 to 5 scale (e.g. `3 / 5`) |
| 12 | **Usage Frequency** | Daily, Multiple times a day, Weekly, etc. |
| 13 | **Generative AI Quiz Response** | Selected answer + (Correct / Incorrect) label |
| 14 | **Learning Interests** | Workshops, Coding, Automation, Robotics, etc. |
| 15 | **Preferred Learning Format** | Live workshops, Real-world projects, Hackathons |
| 16 | **Problem to Solve with AI** | Participant's specific problem or use case |
| 17 | **2-Year AI Thoughts / Perspective** | Freeform thoughts on the future of AI |
| 18 | **Participation Interest** | Yes definitely / Maybe / Exploring |

---

## 💡 Troubleshooting Tips

- **Responses not showing up?**  
  Ensure you selected **"Anyone"** under *Who has access* when deploying. If it is set to *"Only myself"*, submissions from web forms will fail.
- **Made a change to the Apps Script?**  
  Remember that whenever you edit the script, you must click **Deploy** → **Manage deployments** → click the edit pencil icon → change Version to **New version** → click **Deploy**.
- **Questions?** Contact `openschool@gmail.com`.

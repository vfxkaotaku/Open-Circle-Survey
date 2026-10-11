/**
 * ==============================================================================
 * OPEN CIRCLE REGISTRATION SURVEY - GOOGLE SHEETS CONNECTOR SCRIPT
 * Community by OpenSkool
 * ==============================================================================
 *
 * HOW TO INSTALL IN GOOGLE SHEETS:
 * 1. Open your Google Sheet (e.g. go to https://sheets.new)
 * 2. Click "Extensions" in top menu -> select "Apps Script"
 * 3. Delete any code currently in the editor (delete myFunction)
 * 4. Paste this ENTIRE file into the editor.
 * 5. Click the Save icon (💾) or press Ctrl+S.
 *
 * ⚠️ CRITICAL DEPLOYMENT STEP:
 * If you already deployed before:
 *   - Click "Deploy" -> "Manage deployments"
 *   - Click the pencil icon (✏️ Edit) next to your Web App
 *   - Under "Version", change from the old version to "New version"
 *   - Click "Deploy"
 *
 * If this is your first deployment:
 *   - Click "Deploy" -> "New deployment"
 *   - Click the gear icon (⚙️) next to "Select type" -> choose "Web app"
 *   - Description: "Open Circle Form Webhook"
 *   - Execute as: "Me" (your Google account)
 *   - Who has access: "Anyone" (REQUIRED! Allows public form to submit)
 *   - Click "Deploy" and authorize permissions when prompted.
 *
 * 6. Copy the "Web app URL" (starts with https://script.google.com/macros/s/.../exec)
 * ==============================================================================
 */

// If your script is created outside the sheet, paste your Google Sheet ID here:
// (Leave as is if you opened this script from inside Google Sheets via Extensions > Apps Script)
var OPTIONAL_SPREADSHEET_ID = "";

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "Server busy, please retry" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var result = saveRowToSheet(data);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  // If test parameters are passed via URL (e.g. ?fullName=Test&email=test@example.com)
  if (e && e.parameter && e.parameter.fullName) {
    var result = saveRowToSheet(e.parameter);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Health check response
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "online",
      message: "Open Circle Google Sheet Webhook is active and ready to receive submissions!",
      timestamp: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function saveRowToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss && OPTIONAL_SPREADSHEET_ID) {
    ss = SpreadsheetApp.openById(OPTIONAL_SPREADSHEET_ID);
  }
  if (!ss) {
    throw new Error("No Google Sheet connected. Please make sure this script was created from Extensions > Apps Script inside your Google Sheet.");
  }

  var sheet = ss.getActiveSheet() || ss.getSheets()[0];

  var headers = [
    "Submission Time",
    "Full Name",
    "Email Address",
    "College / Organization / Company",
    "Current Role",
    "Field of Study / Work",
    "Devices Used for AI",
    "AI Tools Used",
    "Pro / Advanced AI Models",
    "AI Use Cases",
    "AI Confidence Level",
    "Usage Frequency",
    "Generative AI Quiz Response",
    "Learning Interests",
    "Preferred Learning Format",
    "Problem to Solve with AI",
    "2-Year AI Thoughts / Perspective",
    "Participation Interest"
  ];

  // If sheet is empty, create styled header row (OpenSkool Navy & Neon Green)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0F172A"); // Dark Navy
    headerRange.setFontColor("#7ACC00"); // OpenSkool Neon Green
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(11);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 40);
    sheet.setFrozenRows(1);
  }

  var row = [
    data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    data.fullName || "",
    data.email || "",
    data.organization || "",
    data.role || "",
    data.fieldOfStudy || "",
    data.aiDevices || "",
    data.aiTools || "",
    data.proModels || "",
    data.aiUseCases || "",
    data.confidence || "",
    data.frequency || "",
    data.quizAnswer || "",
    data.interests || "",
    data.learningFormat || "",
    data.problemToSolve || "",
    data.industryThoughts || "",
    data.participationInterest || ""
  ];

  sheet.appendRow(row);

  var lastRow = sheet.getLastRow();
  var newRowRange = sheet.getRange(lastRow, 1, 1, headers.length);
  newRowRange.setVerticalAlignment("middle");
  newRowRange.setFontSize(10);

  return { result: "success", row: lastRow };
}

/**
 * Run this function directly inside the Apps Script editor (select 'testSubmit' and click 'Run')
 * to verify that a row appears in your Google Sheet immediately!
 */
function testSubmit() {
  var testData = {
    fullName: "Open Circle Member (Test)",
    email: "member@openskool.com",
    organization: "OpenSkool Learning Lab",
    role: "Undergraduate student",
    fieldOfStudy: "Computer Engineering",
    aiDevices: "Laptop / MacBook, Smartphone",
    aiTools: "ChatGPT, Google Gemini, Claude",
    proModels: "Claude 3.5 Sonnet / Opus, GPT-4o",
    aiUseCases: "Coding, debugging, or technical projects",
    confidence: "4 / 5",
    frequency: "Daily",
    quizAnswer: "It can generate new content based on patterns learned from data (Correct)",
    interests: "AI automation and productivity, Coding and app development",
    learningFormat: "Live hands-on workshops",
    problemToSolve: "Building autonomous agents and workflows",
    industryThoughts: "Excited for interactive AI tools and multimodal agents",
    participationInterest: "Yes, definitely"
  };
  var res = saveRowToSheet(testData);
  Logger.log("Result: " + JSON.stringify(res));
}

/**
 * ==============================================================================
 * OPEN CIRCLE REGISTRATION SURVEY - GOOGLE SHEETS CONNECTOR SCRIPT
 * Community by OpenSkool
 * ==============================================================================
 *
 * HOW TO INSTALL IN GOOGLE SHEETS:
 * 1. Open your Google Sheet (e.g. go to https://sheets.new)
 * 2. Click "Extensions" in the top menu -> select "Apps Script"
 * 3. Delete any code in the editor and PASTE this entire file content.
 * 4. Click the Save icon (💾) or press Ctrl+S.
 * 5. Click "Deploy" (top right) -> "New deployment"
 * 6. Click the gear icon (⚙️) next to "Select type" -> choose "Web app"
 * 7. Set:
 *    - Description: "Open Circle Form Webhook"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (IMPORTANT! This allows your HTML form to submit)
 * 8. Click "Deploy" and authorize permissions when prompted.
 * 9. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...)
 * 10. Paste this URL into `open_circle_registration.html` at `GOOGLE_SHEET_URL = "..."`
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Wait up to 30 seconds for lock to avoid race conditions with multiple submissions
    lock.waitLock(30000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "Server busy, try again" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse incoming JSON data
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

    // Define column headers
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

    // If sheet is empty (first ever response), set up header row with OpenSkool dark & neon styling
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#0F172A"); // Dark Slate/Navy
      headerRange.setFontColor("#7ACC00"); // OpenSkool Neon Green
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 40);
      sheet.setFrozenRows(1);
    }

    // Prepare row data corresponding to columns
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

    // Append response to sheet
    sheet.appendRow(row);

    // Style the new row
    var lastRow = sheet.getLastRow();
    var newRowRange = sheet.getRange(lastRow, 1, 1, headers.length);
    newRowRange.setVerticalAlignment("middle");
    newRowRange.setFontSize(10);

    return ContentService.createTextOutput(JSON.stringify({ result: "success", row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check endpoint: When visited in a browser, verifies the Web App is online.
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "online",
      message: "Open Circle Google Sheet Form Webhook is live and ready to receive submissions!",
      timestamp: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Quick Test Function:
 * You can select "testSubmit" from the function dropdown in Apps Script and click "Run"
 * to instantly verify that a test row is added to your sheet!
 */
function testSubmit() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        fullName: "Test Member",
        email: "test@openskool.com",
        organization: "OpenSkool Lab",
        role: "Undergraduate student",
        fieldOfStudy: "Computer Engineering",
        aiDevices: "Laptop / MacBook, Smartphone",
        aiTools: "ChatGPT, Google Gemini, Claude",
        proModels: "Claude 3.5 Sonnet / Opus, GPT-4o",
        aiUseCases: "Coding, debugging, or technical projects",
        confidence: "4 / 5",
        frequency: "Daily",
        quizAnswer: "Generates new content based on patterns learned from data (Correct)",
        interests: "AI automation and productivity, Coding and app development",
        learningFormat: "Live hands-on workshops",
        problemToSolve: "Automate repetitive data entry and build AI agents",
        industryThoughts: "Looking forward to personalized AI tutors and agentic workflows",
        participationInterest: "Yes, definitely"
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log("Result: " + result.getContent());
}

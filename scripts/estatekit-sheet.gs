/**
 * EstateKit funnel -> Google Sheets
 * =================================
 * Paste this into the bound Apps Script of a new Google Sheet
 * (Extensions -> Apps Script), then:
 *
 *   1. Run  setupSheet()  once. It builds all three tabs and their formulas.
 *   2. Deploy -> New deployment -> Web app
 *        Execute as:      Me
 *        Who has access:  Anyone
 *   3. Copy the /exec URL into VITE_SHEETS_ENDPOINT in the site env.
 *
 * Editing this file later does NOT change what /exec serves — you have to
 * publish a new version: Deploy > Manage deployments > Edit > New version.
 *
 * Six event types arrive from the site. The three lead-level ones are matched
 * by email, so a booking or a thank-you visit updates the row the submission
 * created rather than appending a new one. The three traffic ones have no
 * identity and just increment today's counters.
 *
 *   submission  - qualifying form completed (creates the Closer row)
 *   booking     - Cal.com booking confirmed
 *   engagement  - thank-you page visit summary, sent on exit
 *   pageview    - /pitch loaded
 *   form_start  - first question answered
 *   dropoff     - abandoned mid-form, carries the step number
 */

var CLOSER = "Closer";
var KPIS = "KPIs";
var TRAFFIC = "Traffic";

// Traffic is a daily counter tab, not one row per person — a pageview has no
// identity to attach to. Each event finds today's row and increments it.
var TRAFFIC_HEADERS = [
  "Date", "Pageviews", "Form starts", "Completed", "Drop-offs",
  "Drop @Q1", "Drop @Q2", "Drop @Q3", "Drop @Q4", "Drop @contact"
];
var TRAFFIC_DAYS = 120;

// Closer tab columns, 1-indexed. Everything from REACHED rightwards is the
// closer's to fill in; everything left of it is written by the funnel.
var COL = {
  TIMESTAMP: 1, DATE: 2, NAME: 3, PHONE: 4, EMAIL: 5,
  AREA: 6, PPRA: 7, DEALS: 8, TIMELINE: 9,
  SCORE: 10, BAND: 11, QUALIFIED: 12,
  BOOKED: 13, APPT_AT: 14,
  TY_SCORE: 15, TY_DETAIL: 16,
  REACHED: 17, SHOWED: 18, OUTCOME: 19, DEAL_VALUE: 20, NOTES: 21
};

var HEADERS = [
  "Timestamp", "Date", "Name", "Phone", "Email",
  "Area", "PPRA", "Deals 12mo", "Timeline",
  "Score", "Band", "Qualified",
  "Booked", "Appt at",
  "TY engagement", "TY detail",
  "Reached", "Showed", "Outcome", "Deal value", "Notes"
];

// Our funnel, step by step: spend -> application -> qualified -> booked ->
// showed -> closed. Every rate is the conversion between two adjacent steps,
// and every cost is spend divided by that step, so a blowout is traceable to
// the exact stage that caused it.
var KPI_HEADERS = [
  "Date", "Ad spend",
  "Pageviews", "Form starts", "Start rate",
  "Applications", "Completion rate", "Cost / application",
  "Qualified", "Qualified %", "Cost / qualified", "Avg score",
  "Booked", "Booked % of qual.", "Cost / booking",
  "Showed", "Show rate", "Cost / show",
  "Closed", "Close rate", "Cost / client",
  "Revenue", "Profit", "ROAS", "Avg TY engagement"
];

var KPI_DAYS = 120;

/** Standard package price; the closer overrides the cell if a deal differs. */
var DEFAULT_DEAL_VALUE = 3000;

// -- Entry point -----------------------------------------------------------

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.type === "submission") recordSubmission(body);
    else if (body.type === "booking") recordBooking(body);
    else if (body.type === "engagement") recordEngagement(body);
    else if (body.type === "pageview") bumpTraffic(2);
    else if (body.type === "form_start") bumpTraffic(3);
    else if (body.type === "dropoff") recordDropoff(body);
    return ok({ ok: true });
  } catch (err) {
    return ok({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function ok(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// -- Writers ---------------------------------------------------------------

function recordSubmission(d) {
  var sheet = tab(CLOSER);
  if (!sheet) throw new Error("Run setupSheet() before accepting events.");

  var now = new Date();
  var row = [];
  for (var i = 0; i < HEADERS.length; i++) row.push("");

  row[COL.TIMESTAMP - 1] = now;
  row[COL.DATE - 1] = Utilities.formatDate(now, tz(), "yyyy-MM-dd");
  row[COL.NAME - 1] = d.name || "";
  row[COL.PHONE - 1] = d.phone || "";
  row[COL.EMAIL - 1] = (d.email || "").toLowerCase();
  row[COL.AREA - 1] = d.area || "";
  row[COL.PPRA - 1] = d.ppra || "";
  row[COL.DEALS - 1] = d.deals || "";
  row[COL.TIMELINE - 1] = d.timeline || "";
  row[COL.SCORE - 1] = d.score == null ? "" : d.score;
  row[COL.BAND - 1] = d.band || "";
  row[COL.QUALIFIED - 1] = d.qualified ? "Yes" : "No";
  row[COL.BOOKED - 1] = "No";
  row[COL.OUTCOME - 1] = "Pending";
  // Standard package price — overwrite the cell if a deal closes at anything
  // else. Only rows marked Won are summed into Revenue, so this sitting on a
  // pending lead costs nothing.
  row[COL.DEAL_VALUE - 1] = DEFAULT_DEAL_VALUE;

  sheet.appendRow(row);
  applyRowValidation(sheet, sheet.getLastRow(), 1);
}

function recordBooking(d) {
  var r = findRowByEmail(d.email);
  if (!r) return;
  var sheet = tab(CLOSER);
  sheet.getRange(r, COL.BOOKED).setValue("Yes");
  if (d.startTime) {
    sheet.getRange(r, COL.APPT_AT).setValue(formatAppt(d.startTime));
  }
}

/** "2026-09-23T10:00:00+02:00" -> "Wed 23 Sep, 10:00". */
function formatAppt(iso) {
  var parsed = new Date(iso);
  if (isNaN(parsed.getTime())) return iso;
  return Utilities.formatDate(parsed, tz(), "EEE d MMM, HH:mm");
}

function recordEngagement(d) {
  var r = findRowByEmail(d.email);
  if (!r) return;
  var sheet = tab(CLOSER);
  if (d.score != null) sheet.getRange(r, COL.TY_SCORE).setValue(d.score);
  if (d.detail) sheet.getRange(r, COL.TY_DETAIL).setValue(d.detail);
}

/** Adds 1 to a counter column on today's Traffic row, creating it if needed. */
function bumpTraffic(column, amount) {
  var sheet = tab(TRAFFIC);
  if (!sheet) return;

  var today = Utilities.formatDate(new Date(), tz(), "yyyy-MM-dd");
  var last = sheet.getLastRow();
  var row = 0;

  if (last >= 2) {
    var dates = sheet.getRange(2, 1, last - 1, 1).getDisplayValues();
    for (var i = 0; i < dates.length; i++) {
      if (dates[i][0] === today) { row = i + 2; break; }
    }
  }
  if (!row) {
    row = last + 1;
    sheet.getRange(row, 1).setValue(today);
    writeTrafficFormulas(sheet, row);
  }

  var cell = sheet.getRange(row, column);
  cell.setValue((Number(cell.getValue()) || 0) + (amount || 1));
}

/** Total drop-offs, plus the step they quit on so a bad question shows up. */
function recordDropoff(d) {
  bumpTraffic(5);
  var step = Number(d.step);
  if (step >= 1 && step <= 5) bumpTraffic(5 + step);
}

/** Most recent row for an email - a lead who re-applies updates their latest. */
function findRowByEmail(email) {
  if (!email) return null;
  var sheet = tab(CLOSER);
  var last = sheet.getLastRow();
  if (last < 2) return null;

  var target = String(email).toLowerCase().trim();
  var values = sheet.getRange(2, COL.EMAIL, last - 1, 1).getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]).toLowerCase().trim() === target) return i + 2;
  }
  return null;
}

function tab(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function tz() {
  return SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
}

// -- One-time setup --------------------------------------------------------

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  buildCloser(ss);
  buildTraffic(ss);
  buildKpis(ss);
  SpreadsheetApp.getUi().alert(
    "Tabs are ready. Now: Deploy > Manage deployments > Edit > New version.");
}

function buildTraffic(ss) {
  var sheet = ss.getSheetByName(TRAFFIC) || ss.insertSheet(TRAFFIC);
  sheet.clear();

  sheet.getRange(1, 1, 1, TRAFFIC_HEADERS.length).setValues([TRAFFIC_HEADERS])
    .setFontWeight("bold").setBackground("#1F223C").setFontColor("#FFFFFF")
    .setWrap(true).setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 40);
  sheet.setColumnWidth(1, 95);
  for (var c = 2; c <= TRAFFIC_HEADERS.length; c++) sheet.setColumnWidth(c, 92);

  var today = new Date();
  var rows = [];
  for (var i = 0; i < TRAFFIC_DAYS; i++) {
    var d = new Date(today.getTime() - i * 86400000);
    rows.push([Utilities.formatDate(d, tz(), "yyyy-MM-dd")]);
  }
  sheet.getRange(2, 1, rows.length, 1).setValues(rows);

  // Counters start empty; bumpTraffic fills them in as events arrive.
  sheet.getRange(2, 2, TRAFFIC_DAYS, TRAFFIC_HEADERS.length - 1)
    .setNumberFormat("0");
  for (var r = 2; r < 2 + TRAFFIC_DAYS; r++) writeTrafficFormulas(sheet, r);
}

/** Completed is the one derived column - it already lives on Closer. */
function writeTrafficFormulas(sheet, r) {
  sheet.getRange(r, 4).setFormula("=COUNTIFS(Closer!$B:$B,A" + r + ")");
}

function buildCloser(ss) {
  var sheet = ss.getSheetByName(CLOSER) || ss.insertSheet(CLOSER);
  sheet.clear();
  sheet.clearConditionalFormatRules();
  // clear() leaves data validation behind, and a stale Yes/No rule on a header
  // cell will reject the header text — so drop the rules before writing.
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
    .clearDataValidations();

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight("bold").setBackground("#1F223C").setFontColor("#FFFFFF")
    .setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(3);
  sheet.setRowHeight(1, 34);

  var lastRow = sheet.getMaxRows() - 1;

  // Funnel-written columns get a tint so it is obvious they are not yours.
  sheet.getRange(2, 1, lastRow, COL.TY_DETAIL).setBackground("#F6F8FC");

  var widths = [140, 95, 150, 125, 210, 150, 130, 90, 120, 60, 95, 80,
                75, 150, 110, 300, 85, 70, 105, 115, 320];
  for (var c = 0; c < widths.length; c++) sheet.setColumnWidth(c + 1, widths[c]);

  applyRowValidation(sheet, 2, lastRow);

  sheet.getRange(2, COL.DEAL_VALUE, lastRow, 1).setNumberFormat("R#,##0");
  sheet.getRange(2, COL.TY_SCORE, lastRow, 1).setNumberFormat("0");

  // Colour the engagement score so a cold lead is visible at a glance.
  var tyRange = sheet.getRange(2, COL.TY_SCORE, lastRow, 1);
  sheet.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .setGradientMaxpointWithValue("#B7E1CD", SpreadsheetApp.InterpolationType.NUMBER, "75")
      .setGradientMidpointWithValue("#FFF2CC", SpreadsheetApp.InterpolationType.NUMBER, "45")
      .setGradientMinpointWithValue("#F4C7C3", SpreadsheetApp.InterpolationType.NUMBER, "0")
      .setRanges([tyRange]).build()
  ]);
}

function applyRowValidation(sheet, startRow, numRows) {
  // Row 1 holds the headers; validating it would reject its own text.
  if (!sheet || startRow < 2) return;
  var n = numRows || 1;
  var yesNo = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Yes", "No"], true).setAllowInvalid(false).build();
  var outcome = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Pending", "Won", "Lost", "No-show", "Rescheduled"], true)
    .setAllowInvalid(false).build();

  sheet.getRange(startRow, COL.REACHED, n, 1).setDataValidation(yesNo);
  sheet.getRange(startRow, COL.SHOWED, n, 1).setDataValidation(yesNo);
  sheet.getRange(startRow, COL.OUTCOME, n, 1).setDataValidation(outcome);
}

function buildKpis(ss) {
  var sheet = ss.getSheetByName(KPIS) || ss.insertSheet(KPIS, 0);
  sheet.clear();

  sheet.getRange(1, 1, 1, KPI_HEADERS.length).setValues([KPI_HEADERS])
    .setFontWeight("bold").setBackground("#1F223C").setFontColor("#FFFFFF")
    .setWrap(true).setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
  sheet.setRowHeight(1, 46);

  var today = new Date();
  var rows = [];
  for (var i = 0; i < KPI_DAYS; i++) {
    var d = new Date(today.getTime() - i * 86400000);
    rows.push([Utilities.formatDate(d, tz(), "yyyy-MM-dd")]);
  }
  sheet.getRange(2, 1, rows.length, 1).setValues(rows);

  for (var r = 2; r < 2 + KPI_DAYS; r++) writeKpiFormulas(sheet, r);

  var money = [2, 8, 11, 15, 18, 21, 22, 23];
  for (var m = 0; m < money.length; m++) {
    sheet.getRange(2, money[m], KPI_DAYS, 1).setNumberFormat("R#,##0");
  }
  var pct = [5, 7, 10, 14, 17, 20];
  for (var p = 0; p < pct.length; p++) {
    sheet.getRange(2, pct[p], KPI_DAYS, 1).setNumberFormat("0.0%");
  }
  sheet.getRange(2, 24, KPI_DAYS, 1).setNumberFormat("0.00\"x\"");
  var whole = [3, 4, 6, 9, 12, 13, 16, 19, 25];
  for (var w = 0; w < whole.length; w++) {
    sheet.getRange(2, whole[w], KPI_DAYS, 1).setNumberFormat("0");
  }

  // Ad spend is the only cell you type into.
  sheet.getRange(2, 2, KPI_DAYS, 1).setBackground("#FFF2CC");

  sheet.setColumnWidth(1, 95);
  for (var c = 2; c <= KPI_HEADERS.length; c++) sheet.setColumnWidth(c, 92);
}

/**
 * Everything except Date and Ad spend is derived from the Closer tab.
 *
 * Closer columns referenced: B date, J score, L qualified, M booked,
 * O TY engagement, R showed, S outcome, T deal value.
 */
function writeKpiFormulas(sheet, r) {
  var d = "A" + r;
  var spend = "B" + r;
  var views = "C" + r;
  var starts = "D" + r;
  var apps = "F" + r;
  var qualified = "I" + r;
  var booked = "M" + r;
  var showed = "P" + r;
  var closed = "S" + r;
  var revenue = "V" + r;
  var profit = "W" + r;

  var onDate = "Closer!$B:$B," + d;
  var fromTraffic = function (col) {
    return "=IFERROR(SUMIFS(Traffic!$" + col + ":$" + col +
      ",Traffic!$A:$A," + d + "),0)";
  };
  var safe = function (num, den) {
    return "=IFERROR(IF(" + den + "=0,\"\"," + num + "/" + den + "),\"\")";
  };
  var countWhere = function (col, value) {
    return "=COUNTIFS(" + onDate + ",Closer!$" + col + ":$" + col +
      ",\"" + value + "\")";
  };
  // Blank cells would drag an average down, so only score rows that have one.
  var avgWhere = function (col) {
    return "=IFERROR(IF(COUNTIFS(" + onDate + ",Closer!$" + col + ":$" + col +
      ",\">0\")=0,\"\",AVERAGEIFS(Closer!$" + col + ":$" + col + "," + onDate +
      ",Closer!$" + col + ":$" + col + ",\">0\")),\"\")";
  };

  // Top of funnel — where most of the loss actually happens
  sheet.getRange(r, 3).setFormula(fromTraffic("B"));
  sheet.getRange(r, 4).setFormula(fromTraffic("C"));
  sheet.getRange(r, 5).setFormula(safe(starts, views));

  // Application stage
  sheet.getRange(r, 6).setFormula("=COUNTIFS(" + onDate + ")");
  sheet.getRange(r, 7).setFormula(safe(apps, starts));
  sheet.getRange(r, 8).setFormula(safe(spend, apps));

  // Qualification stage
  sheet.getRange(r, 9).setFormula(countWhere("L", "Yes"));
  sheet.getRange(r, 10).setFormula(safe(qualified, apps));
  sheet.getRange(r, 11).setFormula(safe(spend, qualified));
  sheet.getRange(r, 12).setFormula(avgWhere("J"));

  // Booking stage
  sheet.getRange(r, 13).setFormula(countWhere("M", "Yes"));
  sheet.getRange(r, 14).setFormula(safe(booked, qualified));
  sheet.getRange(r, 15).setFormula(safe(spend, booked));

  // Show stage
  sheet.getRange(r, 16).setFormula(countWhere("R", "Yes"));
  sheet.getRange(r, 17).setFormula(safe(showed, booked));
  sheet.getRange(r, 18).setFormula(safe(spend, showed));

  // Close stage
  sheet.getRange(r, 19).setFormula(countWhere("S", "Won"));
  sheet.getRange(r, 20).setFormula(safe(closed, showed));
  sheet.getRange(r, 21).setFormula(safe(spend, closed));

  // Money
  sheet.getRange(r, 22).setFormula(
    "=SUMIFS(Closer!$T:$T," + onDate + ",Closer!$S:$S,\"Won\")");
  sheet.getRange(r, 23).setFormula("=IFERROR(" + revenue + "-" + spend + ",\"\")");
  sheet.getRange(r, 24).setFormula(safe(revenue, spend));

  // Is the thank-you page actually being consumed?
  sheet.getRange(r, 25).setFormula(avgWhere("O"));
}

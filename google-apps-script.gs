/* ============================================================
   Cena — Waitlist backend (Google Apps Script Web App)
   ------------------------------------------------------------
   What it does on each signup:
     1. Appends [Timestamp, Email, Source] to the "Waitlist" sheet
     2. Emails the user a "Thank you for signing up for Cena" message
   Setup steps are in WAITLIST_SETUP.md.
   ============================================================ */

function doPost(e) {
  try {
    var email  = ((e && e.parameter && e.parameter.email)  || '').trim();
    var source = ((e && e.parameter && e.parameter.source) || '').trim();

    // server-side guard (the page also validates before sending)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'invalid email' });
    }

    // append to the spreadsheet this script is bound to
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Waitlist') || ss.insertSheet('Waitlist');
    if (sheet.getLastRow() === 0) sheet.appendRow(['Timestamp', 'Email', 'Source']);

    // avoid duplicate signups (optional but tidy)
    var existing = sheet.getRange(1, 2, Math.max(sheet.getLastRow(), 1), 1).getValues().flat();
    if (existing.indexOf(email) === -1) {
      sheet.appendRow([new Date(), email, source]);
    }

    sendConfirmation_(email);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Health check — visiting the URL in a browser shows this.
function doGet() {
  return json({ ok: true, status: 'cena waitlist is live' });
}

function sendConfirmation_(email) {
  var subject = 'Thank you for signing up for Cena';
  var plain =
    'Thanks for joining the Cena waitlist.\n\n' +
    'Cena is your all-in-one dining agent — it finds the food you\'re craving, books the ' +
    'table, and learns your taste over time. We\'re starting in Charlotte, and we\'ll email ' +
    'you the moment early access opens in your area.\n\n' +
    'Talk soon,\nThe Cena team';

  var html =
    '<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;color:#1E1B16;line-height:1.6">' +
      '<div style="font-family:Georgia,serif;font-size:30px;font-weight:600;letter-spacing:-1px;color:#1E1B16">cena</div>' +
      '<h1 style="font-family:Georgia,serif;font-weight:600;font-size:22px;margin:22px 0 10px">Thank you for signing up for Cena.</h1>' +
      '<p style="color:#6B6053;margin:0 0 14px">Cena is your all-in-one dining agent — it finds the food you\'re craving, ' +
      'books the table, and learns your taste over time.</p>' +
      '<p style="color:#6B6053;margin:0 0 22px">We\'re starting in <b style="color:#1E1B16">Charlotte</b>, and we\'ll email you the ' +
      'moment early access opens in your area.</p>' +
      '<p style="color:#6B6053;margin:0">Talk soon,<br>The Cena team</p>' +
      '<div style="border-top:1px solid #E2D9C8;margin-top:24px;padding-top:14px;font-size:12px;color:#9A8E7C">' +
      'You\'re receiving this because you joined the Cena waitlist.</div>' +
    '</div>';

  MailApp.sendEmail({ to: email, subject: subject, name: 'Cena', body: plain, htmlBody: html });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

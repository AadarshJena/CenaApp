# Cena — waitlist + going live

Two parts: **A.** make the waitlist actually collect emails + send the confirmation,
and **B.** put the site on the web with a shareable link.

---

## A. Waitlist backend (Google Sheet + confirmation email)

The form posts to a free Google Apps Script "web app" that you own. It writes each
signup to a Google Sheet and emails the person a "Thank you for signing up for Cena"
message — no servers, no cost.

### 1. Create the sheet
1. Go to <https://sheets.google.com> and create a blank spreadsheet. Name it
   **Cena Waitlist** (the script auto-creates a tab called `Waitlist`).

### 2. Add the script
1. In that sheet: **Extensions → Apps Script**.
2. Delete the starter `function myFunction() {}`.
3. Open **`google-apps-script.gs`** from this project, copy everything, paste it in.
4. Click the **Save** icon.

### 3. Deploy it as a web app
1. Click **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" → choose **Web app**.
3. Set:
   - **Execute as:** *Me* (so it can write the sheet and send mail from your Gmail)
   - **Who has access:** *Anyone*
4. Click **Deploy**.
5. **Authorize access** when prompted. You'll see "Google hasn't verified this app" —
   that's expected for your own script: click **Advanced → Go to (your project) (unsafe) → Allow**.
6. Copy the **Web app URL** (it ends in `/exec`).

### 4. Connect it to the site
1. Open **`app.js`**, find this line near the bottom:
   ```js
   const WAITLIST_ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
2. Replace the placeholder with the `/exec` URL you copied. Save.
3. (If the site is already deployed, redeploy — see part B.)

**Test:** open the page, enter a real address, click *Join the waitlist*. A new row
should appear in the sheet within a few seconds, and the confirmation email should
arrive (check spam the first time).

### Notes
- **Editing the script later:** use **Deploy → Manage deployments → ✏️ edit →
  Version: New version → Deploy** to keep the *same* `/exec` URL. (A brand-new
  deployment gives a new URL you'd have to paste again.)
- **Email limit:** a normal Gmail account can send ~100 confirmation emails/day
  (Google Workspace ~1,500). Fine for an early waitlist.
- Confirmation emails are sent **from your Gmail address** — recipients will see it.
- The script de-duplicates: the same email won't be added twice.

---

## B. Put it online with Vercel

The site is fully static (HTML/CSS/JS + images), so there's no build step.
The included **`.vercelignore`** keeps dev/brand files (this doc, the styleguide,
the `.gs` script, etc.) out of the public deploy.

### Option 1 — Vercel CLI (fastest, no GitHub needed)
```bash
npm i -g vercel        # one-time install
cd "Cena Landing Page" # this project folder
vercel                 # log in when prompted, accept the defaults
vercel --prod          # promote to your public production URL
```
You'll get a link like `https://cena-landing-page.vercel.app` — that's the one you share.

### Option 2 — GitHub + Vercel dashboard
1. Push this folder to a new GitHub repo.
2. Go to <https://vercel.com> → **Add New… → Project** → import the repo.
3. Framework Preset: **Other** (no build command, output is the root). Click **Deploy**.
4. Every future `git push` auto-deploys. Your link is `https://<project>.vercel.app`.

### Order of operations
Paste the Apps Script URL into `app.js` (part A, step 4) **before** deploying — or just
redeploy after pasting it. The form works the moment the deployed `app.js` has the URL.

### Custom domain (optional)
In the Vercel project: **Settings → Domains → Add** and follow the DNS steps to point
e.g. `cena.com` at the site.

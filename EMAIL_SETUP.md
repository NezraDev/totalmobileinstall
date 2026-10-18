# Service-request email on Netlify

The booking form sends requests to the same-origin `/api/contact` path. Netlify routes it to `netlify/functions/contact.mjs`, which calls Resend through the shared server-only handler in `server/contact.mjs`. The browser never receives the Resend key, and production does not need a separate backend URL.

## Activate

1. In Resend, verify `totalmobileglass.com` and create a **Sending access** API key restricted to that domain. Revoke any key that was pasted into chat and use a fresh key. Resend displays a new key once, so copy it directly into Netlify; do not send it in chat or commit it to the repository.
2. Deploy this repository to Netlify from GitHub or with the Netlify CLI so the site and function deploy together. A manual upload of only `dist` publishes the static pages but not the function.
3. In **Netlify → Site configuration → Environment variables**, add:

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | The private Resend sending key. Ensure its scope includes Functions (or all scopes). |
   | `RESEND_FROM` | `Total Mobile Install <amartin@totalmobileglass.com>` after domain verification. |
   | `ALLOWED_ORIGINS` | Optional additional exact site origins, comma-separated, without paths or trailing slashes. The function also accepts Netlify's primary `URL`. |

   Keep `RESEND_API_KEY` out of `netlify.toml`, `.env.example`, all `VITE_` variables, and the browser bundle. Netlify Functions read server variables from `process.env`; values defined in `netlify.toml` are not available to functions. [Netlify Functions environment variables](https://docs.netlify.com/build/functions/environment-variables/)
4. Save the variables and trigger a new Netlify deploy. Confirm the deployment lists the `contact` function and that `/api/contact` is routed to it. The endpoint returns `405` for a GET request; that response confirms the path is live, not that Resend credentials or delivery work.
5. Submit one authorized real test request and check Resend's logs and both receiving inboxes. No real email is sent by the automated checks.

Each request notification goes to **quotes@totalmobileglass.com** and **amartin@totalmobileglass.com**, from **Total Mobile Install <amartin@totalmobileglass.com>**. The customer's address is the Reply-To address. Reply from the Amartin mailbox to send your response from Amartin; Resend sends notifications but does not host or control the inboxes. A successful API acceptance is not proof of inbox delivery or an appointment confirmation.

## Behavior and limits

- The server revalidates service and mobile/shop compatibility, field types and lengths, location, and preferred dates.
- Requests must be JSON, stay under 16 KB, pass exact-origin checks, and leave the anti-spam field empty. Provider calls time out after 10 seconds.
- In-memory limits allow five requests per customer email and 20 requests per client IP per warm function instance in 15 minutes. Function instances can restart or scale independently, so these limits are best-effort rather than a shared global quota. Add shared rate limiting and stronger bot protection if traffic requires it.
- Identical normalized requests in the same 15-minute window share a Resend idempotency key. Retries across windows may send again; automatic retry is disabled.
- The service does not log or store customer records, credentials, or email bodies. Resend handles email processing under the business's account.

Run `npm run check` for content, integration, and mocked email checks, and `npm run build` for the production site. These checks do not send real email. For local backend development, run `npm run start:email` with `RESEND_API_KEY`, `RESEND_FROM`, and `ALLOWED_ORIGINS=http://localhost:5173`; set `VITE_CONTACT_ENDPOINT=http://localhost:3001/api/contact` in the local frontend environment. Keep the local endpoint setting out of production.

Official references: [Resend email API](https://resend.com/docs/api-reference/emails/send-email), [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction), [Netlify Functions](https://docs.netlify.com/build/functions/overview/), [Netlify Function environment variables](https://docs.netlify.com/build/functions/environment-variables/).

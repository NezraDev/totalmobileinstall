# Service-request email on Netlify

The booking form sends requests to the same-origin `/api/contact` path. Netlify routes it to `netlify/functions/contact.mjs`, which calls Resend through the shared server-only handler in `server/contact.mjs`. The browser never receives the Resend key, and production does not need a separate backend URL.

## Activate

1. In Resend, use the verified domain **`totalmobileinstall.com`** and add its generated DNS records to the authoritative DNS zone for **`totalmobileinstall.com`**. Use the exact record names and values shown in Resend. The sender will be `Total Mobile Install <amartin@totalmobileinstall.com>`. Create a **Sending access** API key scoped to `totalmobileinstall.com`. Revoke any key that was pasted into chat and use a fresh key. Resend displays a new key once, so copy it directly into Netlify; do not send it in chat or commit it to the repository.
2. Deploy this repository to Netlify from GitHub or with the Netlify CLI so the site and function deploy together. A manual upload of only `dist` publishes the static pages but not the function.
3. In **Netlify → Site configuration → Environment variables**, add:

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | The private Resend sending key. Ensure its scope includes Functions (or all scopes). |
   | `ALLOWED_ORIGINS` | Optional additional exact site origins, comma-separated, without paths or trailing slashes. The function also accepts Netlify's primary `URL`. |

   The server code sets the sender to `Total Mobile Install <amartin@totalmobileinstall.com>`; you do not need a `RESEND_FROM` variable. Keep the real `RESEND_API_KEY` value out of `netlify.toml`, `.env.example` (which only lists it empty), all `VITE_` variables, and the browser bundle. Netlify Functions read server variables from `process.env`; values defined in `netlify.toml` are not available to functions. [Netlify Functions environment variables](https://docs.netlify.com/build/functions/environment-variables/)
4. Save the variables and trigger a new Netlify deploy. Confirm the deployment lists the `contact` function and that `/api/contact` is routed to it. The endpoint returns `405` for a GET request; that response confirms the path is live, not that Resend credentials or delivery work.
5. Submit one authorized real test request and check Resend's logs and both receiving inboxes. No real email is sent by the automated checks.

Each notification has branded HTML and a plain-text fallback, both built in `server/requestEmail.mjs`. The HTML logo loads from `https://totalmobileinstall.com/images/brand/logo.png`, and customer text is escaped before it enters the HTML.

Each request notification goes to the existing inboxes **quotes@totalmobileglass.com** and **amartin@totalmobileglass.com**. Those recipient addresses remain unchanged. Its From address is `Total Mobile Install <amartin@totalmobileinstall.com>`; Resend must mark `totalmobileinstall.com` **Verified** and the API key must be authorized for it. The customer's address is the Reply-To address. Reply from the Amartin mailbox to send your response from that mailbox; Resend sends notifications but does not host or control the inboxes. A successful API acceptance is not proof of inbox delivery or an appointment confirmation.

## Customer copy through Gmail

After Resend accepts the team notification, the customer gets a branded copy through Gmail. Create a Google App Password on the sending account (2-Step Verification is required), then set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env.local` for local work and in Netlify server environment variables for production. Never commit either value or give them a `VITE_` prefix. Without both values, or if Gmail fails, the booking still succeeds and the customer sees no copy message. Replies go to `quotes@totalmobileglass.com`. The copy leaves out the free-text message so the form cannot relay custom messages to someone else. Gmail applies its own daily sending limits.

## One-click customer buttons

The Urgent and Quotation or Inquiry buttons in the customer copy open `/api/request-action` with an encrypted link that expires after seven days. That page sends the team email through Resend after a short scripted pause, so a scanner that only fetches the link sends nothing. Each button can send again after a 5-minute cooldown, with a countdown on the page. Server memory and a browser cookie enforce the cooldown, and a Resend idempotency key per 5-minute window blocks duplicates across server instances. The encryption key comes from `RESEND_API_KEY`, so replacing that key turns off links already sent. Local test links use `http://localhost:3001` and only work on the computer running `npm run start:email`.

## Behavior and limits

- The server revalidates service and mobile/shop compatibility, field types and lengths, location, and preferred dates.
- Requests must be JSON, stay under 16 KB, pass exact-origin checks, and leave the anti-spam field empty. Provider calls time out after 10 seconds.
- In-memory limits allow five requests per customer email and 20 requests per client IP per warm function instance in 15 minutes. Function instances can restart or scale independently, so these limits are best-effort rather than a shared global quota. Add shared rate limiting and stronger bot protection if traffic requires it.
- Identical normalized requests in the same 15-minute window share a Resend idempotency key. Retries across windows may send again; automatic retry is disabled.
- The service does not log or store customer records, credentials, or email bodies. Resend handles email processing under the business's account.

Run `npm run check` for content, integration, and mocked email checks, and `npm run build` for the production site. These checks do not send real email. For local development in VS Code, create or update the ignored root `.env.local` file with `RESEND_API_KEY`, `ALLOWED_ORIGINS=http://localhost:5173`, and `VITE_CONTACT_ENDPOINT=http://localhost:3001/api/contact`. The `start:email` script reads `.env.local` server-side; Vite only exposes variables prefixed `VITE_`. Open two integrated terminals and run `npm run start:email` in one and `npm run dev` in the other. Never commit `.env.local`, put the key in a `VITE_` variable, or copy the real value into `.env.example`. Keep the local endpoint setting out of production.

Official references: [Resend email API](https://resend.com/docs/api-reference/emails/send-email), [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction), [Netlify Functions](https://docs.netlify.com/build/functions/overview/), [Netlify Function environment variables](https://docs.netlify.com/build/functions/environment-variables/).

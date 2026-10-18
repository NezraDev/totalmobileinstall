# Service-request email on Netlify

The booking form sends requests to the same-origin `/api/contact` path. Netlify routes it to `netlify/functions/contact.mjs`, which calls Resend through the shared server-only handler in `server/contact.mjs`. The browser never receives the Resend key, and production does not need a separate backend URL.

## Activate

1. In Resend, open **Domains** and use the domain whose status is **Verified**. If `service.totalmobileglass.com` is the verified domain, use a sender on that exact subdomain, such as `Total Mobile Install <amartin@service.totalmobileglass.com>`. Verifying the subdomain is separate from verifying `totalmobileglass.com`. Create a **Sending access** API key scoped to the same verified domain. Revoke any key that was pasted into chat and use a fresh key. Resend displays a new key once, so copy it directly into Netlify; do not send it in chat or commit it to the repository.
2. Deploy this repository to Netlify from GitHub or with the Netlify CLI so the site and function deploy together. A manual upload of only `dist` publishes the static pages but not the function.
3. In **Netlify → Site configuration → Environment variables**, add:

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | The private Resend sending key. Ensure its scope includes Functions (or all scopes). |
   | `RESEND_FROM` | A sender on the exact Resend-verified domain; for a verified subdomain, use `Total Mobile Install <amartin@service.totalmobileglass.com>`. |
   | `ALLOWED_ORIGINS` | Optional additional exact site origins, comma-separated, without paths or trailing slashes. The function also accepts Netlify's primary `URL`. |

   Keep `RESEND_API_KEY` out of `netlify.toml`, `.env.example`, all `VITE_` variables, and the browser bundle. Netlify Functions read server variables from `process.env`; values defined in `netlify.toml` are not available to functions. [Netlify Functions environment variables](https://docs.netlify.com/build/functions/environment-variables/)
4. Save the variables and trigger a new Netlify deploy. Confirm the deployment lists the `contact` function and that `/api/contact` is routed to it. The endpoint returns `405` for a GET request; that response confirms the path is live, not that Resend credentials or delivery work.
5. Submit one authorized real test request and check Resend's logs and both receiving inboxes. No real email is sent by the automated checks.

Each request notification goes to **quotes@totalmobileglass.com** and **amartin@totalmobileglass.com**. Its From address is the `RESEND_FROM` value configured above; that sender's domain must exactly match a domain marked **Verified** in Resend. The customer's address is the Reply-To address. Reply from the Amartin mailbox to send your response from that mailbox; Resend sends notifications but does not host or control the inboxes. A successful API acceptance is not proof of inbox delivery or an appointment confirmation.

## Behavior and limits

- The server revalidates service and mobile/shop compatibility, field types and lengths, location, and preferred dates.
- Requests must be JSON, stay under 16 KB, pass exact-origin checks, and leave the anti-spam field empty. Provider calls time out after 10 seconds.
- In-memory limits allow five requests per customer email and 20 requests per client IP per warm function instance in 15 minutes. Function instances can restart or scale independently, so these limits are best-effort rather than a shared global quota. Add shared rate limiting and stronger bot protection if traffic requires it.
- Identical normalized requests in the same 15-minute window share a Resend idempotency key. Retries across windows may send again; automatic retry is disabled.
- The service does not log or store customer records, credentials, or email bodies. Resend handles email processing under the business's account.

Run `npm run check` for content, integration, and mocked email checks, and `npm run build` for the production site. These checks do not send real email. For local development in VS Code, create or update the ignored root `.env.local` file with `RESEND_API_KEY`, `RESEND_FROM`, `ALLOWED_ORIGINS=http://localhost:5173`, and `VITE_CONTACT_ENDPOINT=http://localhost:3001/api/contact`. The From value must use the exact Resend-verified domain; if `service.totalmobileglass.com` is marked Verified, use `Total Mobile Install <amartin@service.totalmobileglass.com>`. The `start:email` script reads `.env.local` server-side; Vite only exposes variables prefixed `VITE_`. Open two integrated terminals and run `npm run start:email` in one and `npm run dev` in the other. Never commit `.env.local`, put the key in a `VITE_` variable, or copy it into `.env.example`. Keep the local endpoint setting out of production.

Official references: [Resend email API](https://resend.com/docs/api-reference/emails/send-email), [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction), [Netlify Functions](https://docs.netlify.com/build/functions/overview/), [Netlify Function environment variables](https://docs.netlify.com/build/functions/environment-variables/).

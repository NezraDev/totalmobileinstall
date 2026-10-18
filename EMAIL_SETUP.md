# Direct service-request email

The booking form now uses **Send service request**, not an email draft. It only shows success after the backend receives a successful Resend response with an email ID. Provider acceptance does not confirm inbox delivery or an appointment.

The existing Sites deployment is static. `server/contact.mjs` is a separate, dependency-free Node 22 service deployable on Render. No Render or Resend account credentials were supplied, so the backend is not live yet. The frontend intentionally disables sending while `VITE_CONTACT_ENDPOINT` is blank.

## Activate

1. Verify `totalmobileglass.com` in Resend and create a sending API key. Once the domain is verified, use `Total Mobile Install <amartin@totalmobileglass.com>` as the sender.
2. Put this repository in a Git repository accessible to your Render account. Create a Blueprint from `render.yaml` (or a Node Web Service with build command `node --version`, start command `node server/contact.mjs`, and health path `/health`). The service root must contain `server/` and `src/`. Select the Render plan appropriate for the business; deployment may incur charges.
3. In **Render → service → Environment**, set:

   | Server variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Private Resend sending key; never use a `VITE_` prefix |
   | `RESEND_FROM` | `Total Mobile Install <amartin@totalmobileglass.com>` (after domain verification) |
   | `ALLOWED_ORIGINS` | Exact website origins separated by commas, without paths or trailing slashes. The Blueprint contains the existing Site origin. Add the custom domain if used. |

4. Deploy the service and verify `/health` returns `{"ok":true}`. Health verifies the process, not credentials or deliverability.
5. Set the website's public build value `VITE_CONTACT_ENDPOINT` to the service's actual HTTPS URL followed by `/api/contact`. Rebuild and publish the frontend. Do not place the server key in the website build settings.
6. Submit one authorized real booking test and check Resend's delivery logs and the receiving mailbox. No real email was sent during automated verification.

Each request notification is sent to **quotes@totalmobileglass.com** and **amartin@totalmobileglass.com**, from **Total Mobile Install <amartin@totalmobileglass.com>**. The customer's address is the reply-to address, so replying to the notification addresses the customer. Send that reply from the Amartin mailbox to ensure the reply comes from Amartin; Resend sends the notification but does not host or control either inbox. The server ignores arbitrary sender/recipient fields and returns no provider error details or secrets. No automatic customer confirmation email is sent.

## Behavior and limits

- Validates service and mobile/shop compatibility, field lengths/types, location and preferred dates again on the server.
- Accepts JSON only, caps requests at 16 KB, checks the exact Origin, rejects filled honeypots, and times out provider calls after 10 seconds.
- In-memory limits expire after 15 minutes: five attempts per customer email, plus 200 requests across a Render instance (20 per socket IP for local/other hosting). Render shares proxy socket addresses, so the server does not trust client-supplied forwarding headers. Origin checks are not authentication.
- Identical normalized requests in the same 15-minute bucket share a Resend idempotency key. Retries across bucket boundaries may send again. No automatic retry is performed.
- Limits reset on restart and are not shared between instances. The Blueprint specifies one instance. Add persistent/shared rate limiting and stronger bot protection if traffic requires scaling.
- No customer records, credentials, or email bodies are logged or stored by this service. Resend handles email processing under the business's account.

Run `npm run test:email` for mocked provider tests and local HTTP health checks. Run `npm run start:email` with server environment values for local backend development. For local form testing, use a loopback endpoint in `VITE_CONTACT_ENDPOINT` and explicitly allow the local website origin in `ALLOWED_ORIGINS`.

Official references: [Resend email API](https://resend.com/docs/api-reference/emails/send-email), [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction), [Render Node deployment](https://render.com/docs/deploy-node-express-app).

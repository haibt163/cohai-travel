# P1 notifications

Last reviewed: 10 September 2026.

## Production contract

Notifications are a delivery concern, not part of the booking transaction. A booking or contact request must be committed successfully before any notification job is emitted. A failed notification must never roll back a successful booking.

### Events

- `booking.confirmed` — send a customer confirmation containing the booked product, departure/date, guests, amount and support contact.
- `booking.cancelled` — send a cancellation confirmation and the released inventory context where appropriate.
- `contact.received` — send an operator alert for a newly received public inquiry.

## Delivery channels

The first production implementation should use one provider-backed transactional email adapter, with WhatsApp/SMS as a later channel. The adapter should accept an immutable event payload and return a provider message id plus delivery state. Retries belong to a queue/worker layer and must use idempotency keys derived from the domain event id.

## Current state

The repository has the domain events and operator inbox surfaces needed for the next integration step, but no fake mail sender is installed. Until provider credentials, sender identity, retry policy and delivery monitoring are configured, the application must not claim that confirmation emails or WhatsApp messages are being delivered.

Recommended production controls: verified sending domain, SPF/DKIM/DMARC, rate limits, secret storage, structured provider logs, bounded retries with backoff, and an operator-visible failure state.

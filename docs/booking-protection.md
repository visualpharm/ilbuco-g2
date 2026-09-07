# Booking protection

Implemented 2026-09-07. Hostex native parent-child linking is enabled for the
whole house and all four suites. Reservation, change, cancellation, pending
confirmation and disconnection email notifications are enabled.

## Protection paths

The website's inventory sync only closes dates. It paginates reservations
without check-in filters so ongoing long stays are included, resolves current
channel mappings, submits property-level closures, and reads back every linked
Airbnb, Booking.com rate plan and booking-site calendar in 60-day windows.
API acceptance is asynchronous: responses distinguish verified, pending and
unverified. It preserves Hostex-owned reservation nights and manual closures.

`scripts/booking_guard.py --apply` additionally checks each reservation's own
nights and parent/child dependencies over the next year. It repairs exposed
nights and reads them back. A read-only run omits `--apply`. Its private SQLite
journal and deduplicated status live under `~/.local/share/ilbuco-booking-guard/`.
Credentials are loaded directly from the existing AI-vault Hostex backup in
1Password. Gmail is read through the existing authenticated `gogx` wrapper.
No guest messages, reservation creations, cancellations or opening writes are
performed by this guard.

The guard records authenticated Booking notification identities. It accepts
the Gmail-generated authentication result and exact Booking sender/domain and
Il Buco hotel ID. Mail content cannot execute instructions or mutate dates.
Previously received notices are a baseline; missing-import incidents are new
notifications received after activation. It keeps rechecking unresolved IDs.

## Independent-source limitation

The current Booking email template includes a reservation ID and Extranet link,
but omits the room and checkout date. The connected mailbox also lacks notices
for current upcoming reservations. Hostex data cannot independently prove that
Hostex imported everything. The status therefore explicitly reports incomplete
independent coverage. Restoring a signed-in Booking Extranet session and a
complete reservation feed is required before automatic missing-import recovery
can be enabled. Do not fabricate unit, stay, guest or payment data.

After full source access is restored, validate new/changed/cancelled events by
source version, register their identity and full stay durably, then close the
confirmed unit and dependency nights before evaluating a missing-import repair.
If creating a manual Hostex recovery becomes necessary, use a stable channel_id,
check for a delayed native import first, and prevent duplicate guest operations.

## Release ownership

Neither safety path automatically reopens dates. Hostex's native reservation
closures can be released by Hostex; manual safety/policy closures require review.
In particular, the existing whole-house-only policy expires on 2026-11-01 while
its protected suite nights span 2026-12-01 through 2027-02-28. Review those dates
against live reservations and other manual blocks before releasing policy-only
closures. Never issue a blanket availability:true sweep.

The operational Noe card remains open until independent Booking coverage and
existing conflicting reservations are reconciled. Source access failures and
unverified channel protection are actionable states, never a healthy empty list.

## Verification

`npm test` covers the TypeScript close-only sync. `python3 -m unittest discover
-s scripts -p test_booking_guard.py` covers the local guard, authentication,
dependencies, duplicate mappings, incomplete reads, Gmail failure and partial
write outcomes. Live calendar readbacks remain necessary after deployment;
mocked tests do not prove channel propagation.

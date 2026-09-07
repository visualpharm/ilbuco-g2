---
title: Hostex whole-house dates exposed during suite reservations
scope: repo
area: hostex
tags: [booking, availability, fail-closed]
created: 2026-09-07
refs: [a3c551f, eea0f6a]
status: active
---

## Problem
Suite bookings coexisted with sellable whole-house nights on OTA channels.
Manual protective closures could be reopened by the custom daily sync.

## Root cause
Native parent-child linking was disabled. Custom writes targeted booking_site
only and wrote inventory=1 for other dates. Missing Hostex imports were invisible.
This establishes configuration/code gaps, not a confirmed Hostex software defect.

## Solution
Enabled native house/four-suite linking and booking emails. Custom sync is now
close-only via property availability, with all linked rate plans read back.
The local guard checks own booking nights as well, and journals independent
Booking notification IDs without inventing the omitted unit/checkout details.

## How to apply
Run application tests and scripts/test_booking_guard.py, then verify live reads.
Use unfiltered paginated reservations plus local overlap filtering: live Hostex
rejects unpaired check-in/check-out filters, and lookbacks miss long stays.
POST availabilities returns a bare successful envelope without data and only
queues work; read back every intended night. Reject duplicate/partial snapshots.
Booking email identity alone cannot safely create a missing reservation.
Never reopen manual or policy holds blindly; the 2026-11-01 policy expiration
requires a reservation-aware release review. Full operations and remaining
source-access requirements are in ../../booking-protection.md.

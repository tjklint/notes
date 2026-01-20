## WORK LOG

<details>
<summary><strong>September 2025</strong></summary>

### Integrations
- **Created Canny Integration**: [todo add pr link]
- Updated Canny integration for better UX
- Helped Yang, Max migrate their integrations from local use to Botpress/Botpress
- Helped Max debug pnpm to get his integration PR ready for review

### Auto Top-Up
- First implementation: https://github.com/botpress/skynet/pull/3331
- Created Novu V2 layouts for use with auto top-up (and otherwise)

### Other (medium-impact)
- Single-column CSV bug in the Files API: https://github.com/botpress/skynet/pull/3352/files
- Email normalization on Kratos

### Other (low-impact)
- Mentorship for Yang:
  - Debug help
  - Proactively learning staging & deployment to assist
  - Encouraging participation on Linear threads
  - Helping select issues aligned with interests and growth

</details>

---

<details>
<summary><strong>October 2025</strong></summary>

### Auto Recharge
- Started second implementation
  - Stub endpoints
  - Added dummy data for frontend enablement
  - Added audit logging
  - Prisma migration for setting and transaction
  - Full support to change auto-recharge settings
  - Auto-recharge checking and logging (no official execution yet)

### Other (low–medium impact)
- Added `.eslintcache` to `.gitignore` in Skynet for faster local runs
- First Stratus PR (handling single-column CSVs)

### BP Hacks
- Met with Ross + Robert to pitch the initial idea

</details>

---

<details>
<summary><strong>November 2025</strong></summary>

### Auto Recharge (SHIPPED!!)
- Continued & finished second implementation
  - Auto recharge is handled async with Cronnor
  - Check limit before auto recharging
  - More robust threshold logic
  - `disabled_reason` is more machine-friendly
  - Compute multiple add-ons + `fast-check` for fuzzy testing
  - Added Prometheus metrics and created a Grafana dashboard

### Other (low–medium impact)
- Billing managers now receive Novu emails

### BP Hacks
- Met with Ross to further plan sign ups and prizes for our first Discord hackathon

</details>

---

<details>
<summary><strong>December 2025</strong></summary>

### ADK DevEx
- `adk` -> root command
- `adk {command} --help`
- Check for node version

</details>

---

<details>
<summary><strong>January 2026</strong></summary>

### Ratelimit
- [Add multi-provider (Upstash, Redis, Valkey, Dragonfly) support to Bridge ratelimit API](https://github.com/botpress/skynet/pull/3762)
- [Shipped an NPM package for client side ratelimiting](https://www.npmjs.com/package/@botpress/ratelimit?activeTab=readme)
  
### Flakey Tests
- addUsage
  - [Not only fixed a test, best fixed as poor man's atomic upsert with `ON CONFLICT`](https://github.com/botpress/skynet/pull/3791)
  - Improves system stability && fixed a flakey test

### Vacation (was OoO 8-20th)

</details>

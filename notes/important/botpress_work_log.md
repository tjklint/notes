## WORK LOG

### September 2025

#### Integrations
- **Created Canny Integration**: [todo add pr link]
- Updated Canny integration for better UX
- Helped Yang, Max migrate their integrations from local use to Botpress/Botpress
- Helped Max debug pnpm to get his integration PR ready for review.

#### Auto Top-Up
- First implementation: [https://github.com/botpress/skynet/pull/3331](https://github.com/botpress/skynet/pull/3331)
- Create Novu V2 layouts for use with auto top-up (and otherwise)

#### Other (medium-impact)
- Single-column CSV bug in the Files API: [https://github.com/botpress/skynet/pull/3352/files](https://github.com/botpress/skynet/pull/3352/files)
- Email normalization on Kratos

#### Other (low-impact)
- Mentorship for Yang: Debug help, proactively learning different aspects of staging and deploying to help. Encouraging him to leave comments on Linear threads to provide input. Helping him choose issues that peak interest, and provide learning and growth.


### October 2025

#### Auto Recharge
- Started second implementation
  - Stub endpoints.
  - Added dummy data to allow front end team to begin working.
  - Added audit logging.
  - Prisma migration for setting and transaction.
  - Full support to change auto recharge settings.
  - Checking for auto recharge and logging (no official implementation)

#### Other (low-medium impact)
- Added .eslintcache to .gitignore on Skynet for a faster local run
- First Stratus PR, for handling single-column CSVs

#### BP Hacks
- Met with Ross + Robert to pitch the initial idea.

### November 2025

#### Auto Recharge (SHIPPED!!)
- Continued & finished second implementation.
  - Auto recharge is handled async with Cronnor.
  - Check limit before auto recharging.
  - More robust threshold logic.
  - `disabled_reason` is more machine-friendly.
  - Compute multiple add-ons + `fast-check` for fuzzy testing.
  - Added prometheus metrics and created a Grafana dashboard.
 
#### Other (low-medium impact)
- Billing managers now receive novu emails.

#### BP Hacks
- Met with Ross to further plan sign ups and prizes for our first Discord hackathon.

### December 2025


- ADK DevEx work
  - `adk` -> root command
  - `adk {command} --help`
  - check for node version

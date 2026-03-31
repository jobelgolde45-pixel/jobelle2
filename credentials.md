# DOTr-HRDD Portal Credentials

## Unified Login Page

All roles use the **same login page** at `/`. Based on your credentials, you'll be redirected to the appropriate portal.

| Role | Username | Password | Redirects To |
|------|----------|----------|--------------|
| Signatory | `cao_signatory` | `dotr123` | Signatory Dashboard |
| Employee | `employee` | `password123` | Employee Portal |

## Additional Demo Accounts

| Username | Password | Role | Redirects To |
|----------|----------|------|-------------|
| `supervisor` | `password123` | Employee | Employee Portal |
| `admin` | `password123` | Signatory | Signatory Dashboard |

## How It Works

1. Go to the login page at `/`
2. Enter your username and password
3. The system determines your role based on credentials
4. You'll be automatically redirected to your portal:
   - **Signatory** → Dashboard for reviewing and signing nomination memos
   - **Employee** → Portal for browsing trainings and submitting nominations

# Linkwarden Container Images

![GitHub License](https://img.shields.io/github/license/anthochamp/container-linkwarden?style=for-the-badge)
![GitHub Release](https://img.shields.io/github/v/release/anthochamp/container-linkwarden?style=for-the-badge&color=457EC4)
![GitHub Release Date](https://img.shields.io/github/release-date/anthochamp/container-linkwarden?style=for-the-badge&display_date=published_at&color=457EC4)

Container images based on the [official Linkwarden image](https://github.com/linkwarden/linkwarden), a self-hosted, open-source collaborative bookmark manager with link monitoring and archiving.

## Quick reference

- **Port**: `3000`
- **Volume**: `/data/` — persistent storage for uploaded files and archives

## Configuration

All environment variables support Docker secrets via the `__FILE` suffix (e.g. `LINKWARDEN_SECRET_KEY__FILE=/run/secrets/secret_key`).

Refer to the [Linkwarden documentation](https://docs.linkwarden.app) for the full list of supported options.

### Required

| Variable | Description |
| --- | --- |
| `LINKWARDEN_URL` | Public URL of the application (e.g. `https://bookmarks.example.com`) |
| `LINKWARDEN_SECRET_KEY` | NextAuth secret key used to sign session tokens |

### Database

| Variable | Default | Description |
| --- | --- | --- |
| `LINKWARDEN_DB_HOST` | `postgresql` | PostgreSQL host |
| `LINKWARDEN_DB_PORT` | `5432` | PostgreSQL port |
| `LINKWARDEN_DB_NAME` | `linkwarden` | Database name |
| `LINKWARDEN_DB_USER` | `linkwarden` | Database user |
| `LINKWARDEN_DB_PASSWORD` | — | Database password |
| `LINKWARDEN_DB_URL` | — | Full PostgreSQL connection URL; overrides individual `DB_*` variables if set |

### Email (SMTP)

| Variable | Default | Description |
| --- | --- | --- |
| `LINKWARDEN_SMTP_HOST` | — | SMTP server hostname |
| `LINKWARDEN_SMTP_PORT` | `587` / `465` | SMTP port (defaults to `465` when `SMTP_SECURE=1`) |
| `LINKWARDEN_SMTP_SECURE` | `0` | Set to `1` to use SSL/TLS on port `465` |
| `LINKWARDEN_SMTP_STARTTLS_POLICY` | `opportunistic` | STARTTLS policy: `opportunistic`, `mandatory`, or `ignored` |
| `LINKWARDEN_SMTP_AUTH_TYPE` | `login` | SMTP authentication type |
| `LINKWARDEN_SMTP_USERNAME` | — | SMTP username |
| `LINKWARDEN_SMTP_PASSWORD` | — | SMTP password |
| `LINKWARDEN_SMTP_FROM_ADDRESS` | — | Sender address for outbound emails |

### Storage

| Variable | Default | Description |
| --- | --- | --- |
| `LINKWARDEN_DATA_DIR` | `/data/data` | Directory for user-uploaded files and archives |

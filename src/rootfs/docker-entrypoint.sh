#!/usr/bin/env sh
set -eu

# shellcheck disable=SC3043
encodeUriComponent() {
	local value
	value=$(printf '%s' "$1" | sed 's/"/\\\"/g')

	node -e "console.log(encodeURIComponent(\"$value\"))"
}

# shellcheck disable=SC2120,SC3043
replaceEnvSecrets() {
	# replaceEnvSecrets 1.0.0
	# https://gist.github.com/anthochamp/d4d9537f52e5b6c42f0866dd823a605f
	local prefix="${1:-}"

	for envSecretName in $(export | awk '{print $2}' | grep -oE '^[^=]+' | grep '__FILE$'); do
		if [ -z "$prefix" ] || printf '%s' "$envSecretName" | grep "^$prefix" >/dev/null; then
			local envName
			envName=$(printf '%s' "$envSecretName" | sed 's/__FILE$//')

			local filePath
			filePath=$(eval echo '${'"$envSecretName"':-}')

			if [ -n "$filePath" ]; then
				if [ -f "$filePath" ]; then
					echo Using content from "$filePath" file for "$envName" environment variable value.

					export "$envName"="$(cat -A "$filePath")"
					unset "$envSecretName"
				else
					echo ERROR: Environment variable "$envSecretName" is defined but does not point to a regular file. 1>&2
					exit 1
				fi
			fi
		fi
	done
}

replaceEnvSecrets LINKWARDEN_

# Default values
LINKWARDEN_URL="${LINKWARDEN_URL:-}"
LINKWARDEN_SECRET_KEY="${LINKWARDEN_SECRET_KEY:-}"
LINKWARDEN_SMTP_HOST="${LINKWARDEN_SMTP_HOST:-}"
LINKWARDEN_SMTP_SECURE="${LINKWARDEN_SMTP_SECURE:-0}"
LINKWARDEN_SMTP_STARTTLS_POLICY="${LINKWARDEN_SMTP_STARTTLS_POLICY:-opportunistic}"
LINKWARDEN_SMTP_AUTH_TYPE="${LINKWARDEN_SMTP_AUTH_TYPE:-login}"
LINKWARDEN_SMTP_USERNAME="${LINKWARDEN_SMTP_USERNAME:-}"
LINKWARDEN_SMTP_PASSWORD="${LINKWARDEN_SMTP_PASSWORD:-}"
LINKWARDEN_SMTP_FROM_ADDRESS="${LINKWARDEN_SMTP_FROM_ADDRESS:-}"
if [ -z "${LINKWARDEN_SMTP_PORT:-}" ]; then
	if [ "$LINKWARDEN_SMTP_SECURE" -eq 1 ]; then
		LINKWARDEN_SMTP_PORT=465
	else
		LINKWARDEN_SMTP_PORT=587
	fi
fi
LINKWARDEN_DB_HOST="${LINKWARDEN_DB_HOST:-postgresql}"
LINKWARDEN_DB_PORT="${LINKWARDEN_DB_PORT:-5432}"
LINKWARDEN_DB_NAME="${LINKWARDEN_DB_NAME:-linkwarden}"
LINKWARDEN_DB_USER="${LINKWARDEN_DB_USER:-$LINKWARDEN_DB_NAME}"
LINKWARDEN_DB_PASSWORD="${LINKWARDEN_DB_PASSWORD:-}"

# STORAGE_FOLDER is relative to the app working directory
LINKWARDEN_DATA_DIR="${LINKWARDEN_DATA_DIR:-/data/${STORAGE_FOLDER:-}}"

#
# NextAuth options
# https://next-auth.js.org/configuration/options#environment-variables
#
if [ -z "${NEXTAUTH_URL:-}" ]; then
	export NEXTAUTH_URL="$LINKWARDEN_URL"
fi

export NEXTAUTH_URL_INTERNAL="http://localhost:3000/api/v1/auth"

if [ -z "${NEXTAUTH_SECRET:-}" ]; then
	export NEXTAUTH_SECRET="$LINKWARDEN_SECRET_KEY"
fi

# https://next-auth.js.org/providers/email#smtp
if [ -z "${EMAIL_SERVER:-}" ] && [ -n "$LINKWARDEN_SMTP_HOST" ]; then
	# https://nodemailer.com/smtp/
	if [ "$LINKWARDEN_SMTP_SECURE" = "ssl" ]; then
		emailServer=smtps
	else
		emailServer=smtp
	fi
	emailServer=$emailServer://
	emailServer=$emailServer$(encodeUriComponent "$LINKWARDEN_SMTP_USERNAME")
	emailServer=$emailServer:
	emailServer=$emailServer$(encodeUriComponent "$LINKWARDEN_SMTP_PASSWORD")
	emailServer=$emailServer@
	emailServer=$emailServer$(encodeUriComponent "$LINKWARDEN_SMTP_HOST")
	emailServer=$emailServer:
	emailServer=$emailServer$(encodeUriComponent "$LINKWARDEN_SMTP_PORT")

	case $LINKWARDEN_SMTP_STARTTLS_POLICY in
	opportunistic) ;;
	mandatory)
		emailServerQuery=${emailServerQuery:+$emailServerQuery&}"requireTLS=true"
		;;
	ignored)
		emailServerQuery=${emailServerQuery:+$emailServerQuery&}"ignoreTLS=true"
		;;
	esac

	if [ -n "$LINKWARDEN_SMTP_AUTH_TYPE" ]; then
		emailServerQuery=${emailServerQuery:+$emailServerQuery&}"authMethod=$LINKWARDEN_SMTP_AUTH_TYPE"
	fi

	export EMAIL_SERVER="$emailServer?$emailServerQuery"
fi

if [ -n "${EMAIL_SERVER:-}" ]; then
	export NEXT_PUBLIC_EMAIL_PROVIDER="true"

	if [ -z "${EMAIL_FROM:-}" ]; then
		export EMAIL_FROM="$LINKWARDEN_SMTP_FROM_ADDRESS"
	fi
fi

#
# Prisma options
#
if [ -z "${DATABASE_URL:-}" ]; then
	if [ -n "${LINKWARDEN_DB_URL:-}" ]; then
		databaseUrl=$LINKWARDEN_DB_URL
	else
		# https://www.prisma.io/docs/orm/overview/databases/postgresql#connection-url
		databaseUrl=postgresql://
		databaseUrl=$databaseUrl$(encodeUriComponent "$LINKWARDEN_DB_USER")
		databaseUrl=$databaseUrl:
		databaseUrl=$databaseUrl$(encodeUriComponent "$LINKWARDEN_DB_PASSWORD")
		databaseUrl=$databaseUrl@
		databaseUrl=$databaseUrl$(encodeUriComponent "$LINKWARDEN_DB_HOST")
		databaseUrl=$databaseUrl:
		databaseUrl=$databaseUrl$(encodeUriComponent "$LINKWARDEN_DB_PORT")
		databaseUrl=$databaseUrl/
		databaseUrl=$databaseUrl$(encodeUriComponent "$LINKWARDEN_DB_NAME")
	fi

	export DATABASE_URL="$databaseUrl"
fi

# App options
# STORAGE_FOLDER is relative to the app working directory
export STORAGE_FOLDER="../$LINKWARDEN_DATA_DIR"

# Fix owner on mounted folders
mkdir -p "$LINKWARDEN_DATA_DIR"
chown -R root:root "$LINKWARDEN_DATA_DIR"

if [ "$1" = "yarn" ]; then
	yarn prisma migrate deploy
fi

exec "$@"

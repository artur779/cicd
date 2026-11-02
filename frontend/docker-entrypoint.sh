#!/bin/sh
set -e

API_BASE_URL="${API_BASE_URL:-/api}"

cat > /usr/share/nginx/html/config.js <<EOF
window.APP_CONFIG = {
  API_BASE_URL: "${API_BASE_URL}"
};
EOF

exec nginx -g "daemon off;"
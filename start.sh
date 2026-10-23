#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
while true; do
  node index.js
  code=$?
  [ "$code" -eq 42 ] || break
  echo "🔄 Redémarrage…"
  sleep 2
done

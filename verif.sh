for f in commands/*.js lib/*.js index.js; do
  node --check "$f" 2>/dev/null || echo "❌ erreur dans $f"
done
echo "Vérification terminée"

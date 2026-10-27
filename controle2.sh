for f in lib/reglages.js lib/moderation.js lib/badwords.js lib/groupe.js lib/media.js; do [ -f "$f" ] || echo "❌ fichier absent : $f"; done
grep -q "commandeInterrupteur" lib/reglages.js 2>/dev/null || echo "❌ reglages.js incomplet"
grep -q "muets" lib/moderation.js 2>/dev/null || echo "❌ moderation.js incomplet"
grep -q "trouverMembre" lib/groupe.js 2>/dev/null || echo "❌ groupe.js incomplet"
grep -q "controleBienvenue" lib/groupe.js 2>/dev/null || echo "❌ groupe.js sans controleBienvenue"
echo "Contrôle des outils terminé"

import fs from 'fs'
const f = 'public/index.html'
let s = fs.readFileSync(f, 'utf8')
if (s.includes('id="nb"')) { console.log('✅ déjà présent'); process.exit(0) }
s = s.replace('</style>', `  .stat { text-align: center; font-weight: 700; color: var(--texte2); }
  .stat-num { color: var(--rouge); font-size: 1.3rem; margin: 0 4px; }
</style>`)
s = s.replace(/\s*<div class="verre">\s*<h2>Connecter ton compte<\/h2>/, `
  <div class="verre stat">👥 <span class="stat-num" id="nb">…</span> comptes connectés</div>
  <div class="verre">
    <h2>Connecter ton compte</h2>`)
s = s.replace('</script>', `  async function majStats() {
    try {
      const r = await (await fetch('/api/stats')).json()
      document.getElementById('nb').textContent = r.connectes + ' / ' + r.max
    } catch {}
  }
  majStats()
  setInterval(majStats, 30000)
</script>`)
fs.writeFileSync(f, s)
console.log(s.includes('id="nb"') && s.includes('majStats') ? '✅ compteur affiché' : '❌ à vérifier')

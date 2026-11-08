const debuts = ['Ombre', 'Flamme', 'Nova', 'Zen', 'Titan', 'Éclair', 'Phoenix']
const fins = ['X', 'Prime', 'Royal', 'Fury', 'Star', 'Dev', 'MD']
export default {
  nom: 'nickname',
  run: async ({ sock, jid, args, msg }) => {
    const base = args.join(' ').trim() || msg.pushName || 'Toi'
    const a = debuts[Math.floor(Math.random() * debuts.length)]
    const b = fins[Math.floor(Math.random() * fins.length)]
    const propose = [`${base}${b}`, `${a}${base.slice(0, 4)}`, `${base}_${a}`]
    await sock.sendMessage(jid, { text: `✨ Surnoms proposés :\n${propose.map((p) => '• ' + p).join('\n')}` })
  },
}

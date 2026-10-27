const faits = [
  'Les poulpes ont trois cœurs.',
  'Une journée sur Vénus dure plus longtemps que son année : elle tourne très lentement sur elle-même.',
  'Les bananes sont des baies, alors que les fraises n\'en sont pas, d\'un point de vue botanique.',
  'Les wombats produisent des crottes en forme de petits cubes.',
  'Le cœur d\'une crevette se trouve dans sa tête.',
  'La tour Eiffel peut gagner quelques centimètres en été, car le métal se dilate avec la chaleur.',
  'Contrairement à une idée reçue, la Grande Muraille de Chine n\'est pas visible à l\'œil nu depuis la Lune.',
  'Le miel est si bien conservé que des pots retrouvés dans des tombes égyptiennes étaient encore comestibles.',
  'Un éclair est beaucoup plus chaud que la surface du Soleil.',
]

export default {
  nom: 'fact',
  run: async ({ sock, jid }) => {
    const f = faits[Math.floor(Math.random() * faits.length)]
    await sock.sendMessage(jid, { text: `💡 Le saviez-vous ?\n\n${f}` })
  },
}

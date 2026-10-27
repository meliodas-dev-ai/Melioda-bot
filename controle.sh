manque=""
for f in add admins antibadword antiflood antilien antispam close demote goodbye groupid groupinfo hidetag kick leave link mute open poll promote purge revoke rules setdesc setgoodbye setname setpp setrules setwelcome tagadmins tagall testgoodbye testwelcome unmute unwarn warn warnings welcome avatar id mention profile userinfo botinfo help menu pair ping runtime stats status systeminfo version 8ball choose coinflip count dare dice fact joke quiz random riddle rps ship slot truth decode encode fancy font lower morse reverse upper date time weather wiki age calc qr short speed caption crop resize sticker stickerinfo toimg tomp3 backup ban chaine logout maintenance private public resetsettings restart setbanner settings shutdown unban; do
  [ -f "commands/$f.js" ] || manque="$manque $f"
done
echo "Manquent :$manque"

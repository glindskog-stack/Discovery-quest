// Tiny i18n layer — flat key → {lang: string} map, {token} substitution,
// simple one/other pluralization for the handful of nouns that need it.
// Language is device-level (not per-profile): stored before any profile
// exists, since the profile picker itself needs to render in it.

const I18N_LANGS = [
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "sv", flag: "🇸🇪", name: "Svenska" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "es", flag: "🇪🇸", name: "Español" },
];

const I18N_STRINGS = {
  "brand.tagline": { en: "No grades. No limits. Just get silly good.", sv: "Inga betyg. Inga gränser. Bli sjukt bra.", fr: "Pas de notes. Pas de limites. Juste deviens trop fort.", de: "Keine Noten. Keine Grenzen. Werd einfach verdammt gut.", es: "Sin notas. Sin límites. Ponte ridículamente bueno." },

  "onboarding.name_label": { en: "What do we call you?", sv: "Vad ska vi kalla dig?", fr: "Comment on t'appelle ?", de: "Wie sollen wir dich nennen?", es: "¿Cómo te llamamos?" },
  "onboarding.name_placeholder": { en: "Your name", sv: "Ditt namn", fr: "Ton prénom", de: "Dein Name", es: "Tu nombre" },
  "onboarding.age_label": { en: "How old are you?", sv: "Hur gammal är du?", fr: "Quel âge as-tu ?", de: "Wie alt bist du?", es: "¿Cuántos años tienes?" },
  "onboarding.age_placeholder": { en: "e.g. 16", sv: "t.ex. 16", fr: "ex. 16", de: "z. B. 16", es: "p. ej. 16" },
  "onboarding.age_hint": { en: "Just for tuning content — stays on this device.", sv: "Bara för att anpassa innehållet — stannar på den här enheten.", fr: "Juste pour ajuster le contenu — reste sur cet appareil.", de: "Nur zur Anpassung der Inhalte — bleibt auf diesem Gerät.", es: "Solo para ajustar el contenido — se queda en este dispositivo." },
  "onboarding.difficulty_label": { en: "Starting difficulty", sv: "Startsvårighet", fr: "Difficulté de départ", de: "Startschwierigkeit", es: "Dificultad inicial" },
  "difficulty.easy.title": { en: "Easy", sv: "Lätt", fr: "Facile", de: "Leicht", es: "Fácil" },
  "difficulty.easy.sub": { en: "ease into it", sv: "kom igång lugnt", fr: "en douceur", de: "locker starten", es: "empezar suave" },
  "difficulty.medium.title": { en: "Medium", sv: "Medel", fr: "Moyen", de: "Mittel", es: "Medio" },
  "difficulty.medium.sub": { en: "right in the mix", sv: "mitt i smeten", fr: "dans le vif du sujet", de: "mittendrin", es: "justo en medio" },
  "difficulty.hard.title": { en: "Hard", sv: "Svårt", fr: "Difficile", de: "Schwer", es: "Difícil" },
  "difficulty.hard.sub": { en: "throw me in", sv: "kasta mig i det", fr: "jette-moi dedans", de: "wirf mich rein", es: "tírame directo" },
  "onboarding.interests_label": { en: "Areas you want to improve", sv: "Områden du vill bli bättre på", fr: "Domaines à améliorer", de: "Bereiche, die du verbessern willst", es: "Áreas que quieres mejorar" },
  "onboarding.interests_hint": { en: "Pick as many as you want — change this anytime in Focus.", sv: "Välj så många du vill — ändra när som helst under Fokus.", fr: "Choisis-en autant que tu veux — modifiable à tout moment dans Focus.", de: "Wähle so viele du willst — jederzeit änderbar unter Fokus.", es: "Elige tantas como quieras — cámbialo cuando quieras en Enfoque." },
  "onboarding.goal_label": { en: "Daily goal", sv: "Dagligt mål", fr: "Objectif quotidien", de: "Tagesziel", es: "Meta diaria" },
  "goal.count10.title": { en: "Daily 10", sv: "Dagliga 10", fr: "10 par jour", de: "Täglich 10", es: "10 al día" },
  "goal.count10.sub": { en: "10 prompts", sv: "10 frågor", fr: "10 questions", de: "10 Aufgaben", es: "10 preguntas" },
  "goal.count20.title": { en: "Daily 20", sv: "Dagliga 20", fr: "20 par jour", de: "Täglich 20", es: "20 al día" },
  "goal.count20.sub": { en: "20 prompts", sv: "20 frågor", fr: "20 questions", de: "20 Aufgaben", es: "20 preguntas" },
  "goal.time5.title": { en: "5 min", sv: "5 min", fr: "5 min", de: "5 Min", es: "5 min" },
  "goal.time5.sub": { en: "timed", sv: "tidsstyrt", fr: "chronométré", de: "zeitgesteuert", es: "cronometrado" },
  "goal.time10.title": { en: "10 min", sv: "10 min", fr: "10 min", de: "10 Min", es: "10 min" },
  "goal.time10.sub": { en: "timed", sv: "tidsstyrt", fr: "chronométré", de: "zeitgesteuert", es: "cronometrado" },

  "btn.back": { en: "Back", sv: "Tillbaka", fr: "Retour", de: "Zurück", es: "Atrás" },
  "btn.cancel": { en: "Cancel", sv: "Avbryt", fr: "Annuler", de: "Abbrechen", es: "Cancelar" },
  "btn.next": { en: "Next", sv: "Nästa", fr: "Suivant", de: "Weiter", es: "Siguiente" },
  "btn.lets_go": { en: "Let's go", sv: "Kör igång", fr: "C'est parti", de: "Los geht's", es: "Vamos" },
  "btn.focus": { en: "Focus", sv: "Fokus", fr: "Focus", de: "Fokus", es: "Enfoque" },
  "btn.focus_title": { en: "Choose what to drill into", sv: "Välj vad du vill träna på", fr: "Choisis ce que tu veux travailler", de: "Wähle, worauf du dich konzentrieren willst", es: "Elige en qué quieres enfocarte" },
  "btn.stats": { en: "Stats", sv: "Statistik", fr: "Stats", de: "Statistik", es: "Estadísticas" },
  "btn.switch_profile_title": { en: "Switch profile", sv: "Byt profil", fr: "Changer de profil", de: "Profil wechseln", es: "Cambiar de perfil" },
  "btn.sound_title": { en: "Sound", sv: "Ljud", fr: "Son", de: "Ton", es: "Sonido" },
  "btn.submit": { en: "Submit", sv: "Skicka", fr: "Envoyer", de: "Absenden", es: "Enviar" },
  "btn.add": { en: "Add", sv: "Lägg till", fr: "Ajouter", de: "Hinzufügen", es: "Añadir" },
  "btn.close": { en: "Close", sv: "Stäng", fr: "Fermer", de: "Schließen", es: "Cerrar" },
  "btn.restore": { en: "Restore", sv: "Återställ", fr: "Restaurer", de: "Wiederherstellen", es: "Restaurar" },
  "btn.keep_going": { en: "Keep going", sv: "Fortsätt", fr: "Continuer", de: "Weitermachen", es: "Seguir" },
  "btn.skip": { en: "Skip this one", sv: "Hoppa över", fr: "Passer", de: "Überspringen", es: "Saltar esta" },
  "btn.new_profile": { en: "+ New profile", sv: "+ Ny profil", fr: "+ Nouveau profil", de: "+ Neues Profil", es: "+ Nuevo perfil" },

  "quest.freeresponse_placeholder": { en: "Type here. No wrong answers.", sv: "Skriv här. Inga fel svar.", fr: "Écris ici. Pas de mauvaise réponse.", de: "Schreib hier. Es gibt keine falsche Antwort.", es: "Escribe aquí. No hay respuestas incorrectas." },
  "quest.words": { en: "{n} / {target} words", sv: "{n} / {target} ord", fr: "{n} / {target} mots", de: "{n} / {target} Wörter", es: "{n} / {target} palabras" },
  "quest.how_was_that": { en: "How was that?", sv: "Hur kändes det?", fr: "C'était comment ?", de: "Wie war's?", es: "¿Qué tal estuvo?" },
  "quest.new_best_streak": { en: "New best streak: {n}", sv: "Ny bästa svit: {n}", fr: "Nouveau record de série : {n}", de: "Neue Bestserie: {n}", es: "Nueva mejor racha: {n}" },
  "quest.level_up": { en: "Level up", sv: "Ny nivå", fr: "Niveau supérieur", de: "Level-Aufstieg", es: "Subiste de nivel" },
  "quest.source": { en: "Source: {name}", sv: "Källa: {name}", fr: "Source : {name}", de: "Quelle: {name}", es: "Fuente: {name}" },
  "quest.source_checked": { en: " · checked {date}", sv: " · kontrollerad {date}", fr: " · vérifié {date}", de: " · geprüft {date}", es: " · verificado {date}" },
  "quest.ahead_of": { en: "Now ahead of {pct}% of explorers in {domain}.", sv: "Nu före {pct}% av utforskarna inom {domain}.", fr: "Maintenant devant {pct}% des explorateurs en {domain}.", de: "Jetzt vor {pct}% der Entdecker in {domain}.", es: "Ahora por delante del {pct}% de exploradores en {domain}." },

  // Feedback headlines: picked at random (see pickRandomFeedback in app.js)
  // so answering doesn't feel like reading the same toast every time.
  "feedback.correct.0": { en: "Nice one!", sv: "Snyggt jobbat!", fr: "Bien joué !", de: "Gut gemacht!", es: "¡Bien hecho!" },
  "feedback.correct.1": { en: "Nailed it!", sv: "Helt rätt!", fr: "En plein dans le mille !", de: "Genau richtig!", es: "¡Diste en el clavo!" },
  "feedback.correct.2": { en: "Boom — correct!", sv: "Bom — korrekt!", fr: "Boum — correct !", de: "Bumm — richtig!", es: "¡Boom, correcto!" },
  "feedback.correct.3": { en: "Sharp thinking!", sv: "Skarpt tänkt!", fr: "Bien vu !", de: "Scharf kombiniert!", es: "¡Buen ojo!" },
  "feedback.correct.4": { en: "Yes! Exactly right.", sv: "Ja! Exakt rätt.", fr: "Oui ! Exactement ça.", de: "Ja! Exakt richtig.", es: "¡Sí! Exactamente." },
  "feedback.incorrect.0": { en: "Not quite — here's the deal:", sv: "Inte riktigt — så här ligger det till:", fr: "Pas tout à fait — voici pourquoi :", de: "Nicht ganz — hier die Auflösung:", es: "No exactamente — aquí va:" },
  "feedback.incorrect.1": { en: "So close! Here's why:", sv: "Nära! Så här var det:", fr: "Presque ! Voici pourquoi :", de: "Knapp daneben! Hier ist warum:", es: "¡Casi! Aquí tienes por qué:" },
  "feedback.incorrect.2": { en: "Good guess. Actually:", sv: "Bra gissning. Faktum är:", fr: "Bonne tentative. En fait :", de: "Guter Versuch. Tatsächlich:", es: "Buen intento. En realidad:" },
  "feedback.incorrect.3": { en: "Missed it — worth knowing:", sv: "Fel den här gången — bra att veta:", fr: "Raté — bon à savoir :", de: "Daneben — gut zu wissen:", es: "Fallaste — dato útil:" },
  "feedback.incorrect.4": { en: "Not this time. Here's the fact:", sv: "Inte den här gången. Här är faktan:", fr: "Pas cette fois. Voici le fait :", de: "Diesmal nicht. Hier die Fakten:", es: "Esta vez no. Aquí el dato:" },
  "feedback.creative_good.0": { en: "Love that direction!", sv: "Älskar den riktningen!", fr: "J'adore cette direction !", de: "Diese Richtung gefällt mir!", es: "¡Me encanta esa dirección!" },
  "feedback.creative_good.1": { en: "That's a solid take.", sv: "Bra idé.", fr: "Belle idée.", de: "Solide Idee.", es: "Buena idea." },
  "feedback.creative_good.2": { en: "Nice voice in that one.", sv: "Fin röst i den texten.", fr: "Belle voix dans ce texte.", de: "Schöne Stimme in dem Text.", es: "Buena voz en eso." },
  "feedback.creative_good.3": { en: "Genuinely creative — good work.", sv: "Verkligen kreativt — bra jobbat.", fr: "Vraiment créatif — bon travail.", de: "Wirklich kreativ — gute Arbeit.", es: "Muy creativo — buen trabajo." },
  "feedback.creative_good.4": { en: "That's some main-character energy.", sv: "Det där är huvudkaraktärsenergi.", fr: "Ça, c'est de l'énergie de personnage principal.", de: "Das ist Hauptfigur-Energie.", es: "Eso es energía de protagonista." },
  "feedback.creative_meh.0": { en: "Thanks for writing that — every rep counts.", sv: "Tack för att du skrev det — varje försök räknas.", fr: "Merci de l'avoir écrit — chaque essai compte.", de: "Danke fürs Schreiben — jeder Versuch zählt.", es: "Gracias por escribir eso — cada intento cuenta." },
  "feedback.creative_meh.1": { en: "Logged. On to the next one.", sv: "Loggat. Vidare till nästa.", fr: "Enregistré. On passe à la suite.", de: "Notiert. Weiter geht's.", es: "Registrado. A por el siguiente." },
  "feedback.creative_meh.2": { en: "Appreciate you giving it a shot.", sv: "Tack för att du gav det ett försök.", fr: "Merci d'avoir tenté le coup.", de: "Danke, dass du es versucht hast.", es: "Gracias por intentarlo." },
  "feedback.creative_skipped": { en: "No worries — skipped. Next one:", sv: "Inga problem — hoppade över. Nästa:", fr: "Pas de souci — passé. Suivant :", de: "Kein Problem — übersprungen. Weiter:", es: "Sin problema — omitido. Siguiente:" },

  "btn.start_quest": { en: "Start quest", sv: "Starta questet", fr: "Lancer la quête", de: "Quest starten", es: "Empezar la misión" },
  "focus.first_run_hint": { en: "Quick pick before we dive in — choose what to focus on, or just hit Start.", sv: "Snabbval innan vi kör igång — välj vad du vill fokusera på, eller tryck bara Starta.", fr: "Petit choix avant de plonger — choisis ce qui t'intéresse, ou lance-toi directement.", de: "Kurze Auswahl, bevor's losgeht — wähle deinen Fokus oder starte direkt.", es: "Elección rápida antes de empezar — elige tu enfoque o simplemente pulsa Empezar." },

  "focus.title": { en: "Focus", sv: "Fokus", fr: "Focus", de: "Fokus", es: "Enfoque" },
  "focus.range_label": { en: "Range", sv: "Omfång", fr: "Portée", de: "Umfang", es: "Alcance" },
  "focus.broad_title": { en: "Broad", sv: "Brett", fr: "Large", de: "Breit", es: "Amplio" },
  "focus.broad_sub": { en: "bounce around everything", sv: "hoppa runt lite överallt", fr: "un peu de tout", de: "überall ein bisschen", es: "un poco de todo" },
  "focus.narrow_title": { en: "Narrow", sv: "Smalt", fr: "Ciblé", de: "Eng", es: "Concentrado" },
  "focus.narrow_sub": { en: "drill into what's picked", sv: "fokusera på det valda", fr: "creuse ce qui est choisi", de: "vertiefe das Gewählte", es: "profundiza en lo elegido" },
  "focus.regions_title": { en: "Trivia regions", sv: "Frågesport-regioner", fr: "Régions du quiz", de: "Quiz-Regionen", es: "Regiones de trivia" },
  "focus.write_subject_title": { en: "Write in a subject", sv: "Skriv in ett ämne", fr: "Propose un sujet", de: "Thema vorschlagen", es: "Propón un tema" },
  "focus.write_subject_hint": { en: "Doesn't drop in instantly — it queues for the next content pass. See what's already queued below.", sv: "Dyker inte upp direkt — läggs i kö till nästa innehållsuppdatering. Se vad som redan väntar nedan.", fr: "N'apparaît pas tout de suite — mis en file pour la prochaine mise à jour de contenu. Vois ce qui est déjà en attente ci-dessous.", de: "Erscheint nicht sofort — wird für den nächsten Inhalts-Durchlauf vorgemerkt. Siehe unten, was schon wartet.", es: "No aparece al instante — se pone en cola para la próxima actualización de contenido. Mira abajo lo que ya está en cola." },
  "focus.write_subject_placeholder": { en: "e.g. K-pop history, orbital mechanics, Rust", sv: "t.ex. K-pop-historia, omloppsmekanik, Rust", fr: "ex. histoire de la K-pop, mécanique orbitale, Rust", de: "z. B. K-Pop-Geschichte, Orbitalmechanik, Rust", es: "p. ej. historia del K-pop, mecánica orbital, Rust" },
  "focus.nothing_queued": { en: "Nothing queued yet.", sv: "Inget i kö ännu.", fr: "Rien en file pour l'instant.", de: "Noch nichts vorgemerkt.", es: "Nada en cola todavía." },
  "focus.queued": { en: "queued", sv: "i kö", fr: "en file", de: "vorgemerkt", es: "en cola" },
  "focus.language_title": { en: "Language", sv: "Språk", fr: "Langue", de: "Sprache", es: "Idioma" },

  "dashboard.day_streak.one": { en: "{n} day streak", sv: "{n} dags svit", fr: "{n} jour de suite", de: "{n} Tag in Folge", es: "{n} día seguido" },
  "dashboard.day_streak.other": { en: "{n} day streak", sv: "{n} dagars svit", fr: "{n} jours de suite", de: "{n} Tage in Folge", es: "{n} días seguidos" },
  "dashboard.longest_run": { en: "longest run: {n}", sv: "längsta svit: {n}", fr: "record : {n}", de: "längste Serie: {n}", es: "racha más larga: {n}" },
  "dashboard.time_invested": { en: "time invested", sv: "tid investerad", fr: "temps investi", de: "investierte Zeit", es: "tiempo invertido" },
  "dashboard.sessions.one": { en: "session", sv: "session", fr: "session", de: "Sitzung", es: "sesión" },
  "dashboard.sessions.other": { en: "sessions", sv: "sessioner", fr: "sessions", de: "Sitzungen", es: "sesiones" },
  "dashboard.prompts_logged": { en: "prompts logged", sv: "frågor loggade", fr: "questions enregistrées", de: "Aufgaben erfasst", es: "preguntas registradas" },
  "dashboard.skill_tree": { en: "Skill tree", sv: "Färdighetsträd", fr: "Arbre de compétences", de: "Fähigkeitenbaum", es: "Árbol de habilidades" },
  "dashboard.personal_bests": { en: "Personal bests", sv: "Personliga rekord", fr: "Records personnels", de: "Persönliche Bestleistungen", es: "Mejores marcas" },
  "dashboard.best_streak": { en: "best streak", sv: "bästa svit", fr: "meilleure série", de: "beste Serie", es: "mejor racha" },
  "dashboard.best_session_xp": { en: "best session XP", sv: "bästa sessions-XP", fr: "meilleur XP/session", de: "bester Sitzungs-XP", es: "mejor XP de sesión" },
  "dashboard.goals_crushed": { en: "goals crushed", sv: "mål krossade", fr: "objectifs atteints", de: "Ziele geschafft", es: "metas logradas" },
  "dashboard.trophy_case": { en: "Trophy case — {unlocked}/{total}", sv: "Troféhylla — {unlocked}/{total}", fr: "Vitrine à trophées — {unlocked}/{total}", de: "Trophäenschrank — {unlocked}/{total}", es: "Vitrina de trofeos — {unlocked}/{total}" },
  "dashboard.locked": { en: "???", sv: "???", fr: "???", de: "???", es: "???" },
  "dashboard.insight_gravitating": { en: "Lately you're gravitating toward", sv: "På sistone dras du mot", fr: "Ces derniers temps, tu es attiré·e par", de: "In letzter Zeit ziehst du zu", es: "Últimamente te inclinas hacia" },
  "dashboard.insight_not_enough": { en: "Not enough signal yet — keep going and this fills in.", sv: "Inte tillräckligt med data än — fortsätt så fylls det på.", fr: "Pas encore assez de données — continue et ça se remplira.", de: "Noch nicht genug Daten — mach weiter, dann füllt sich das.", es: "Aún no hay suficientes datos — sigue jugando y esto se completará." },
  "dashboard.vs_everyone": { en: "Vs. everyone else", sv: "Mot alla andra", fr: "Face aux autres", de: "Gegen alle anderen", es: "Contra todos los demás" },
  "dashboard.ahead_of_pct": { en: "ahead of {pct}%", sv: "före {pct}%", fr: "devant {pct}%", de: "vor {pct}%", es: "por delante del {pct}%" },
  "dashboard.cloud_not_connected_peers": { en: "Cloud sync isn't connected — turn it on to see how you stack up, anonymously.", sv: "Molnsynk är inte aktiverat — slå på det för att se hur du ligger till, anonymt.", fr: "La synchro cloud n'est pas activée — active-la pour te comparer, anonymement.", de: "Cloud-Sync ist nicht aktiv — aktiviere es, um dich anonym zu vergleichen.", es: "La sincronización en la nube no está activada — actívala para compararte, de forma anónima." },
  "dashboard.cloud_sync_title": { en: "Cloud sync", sv: "Molnsynk", fr: "Synchro cloud", de: "Cloud-Sync", es: "Sincronización en la nube" },
  "dashboard.cloud_not_connected": { en: "Not connected — stats are staying on this device.", sv: "Inte anslutet — statistiken stannar på den här enheten.", fr: "Non connecté — les statistiques restent sur cet appareil.", de: "Nicht verbunden — Statistiken bleiben auf diesem Gerät.", es: "No conectado — las estadísticas se quedan en este dispositivo." },
  "dashboard.your_code": { en: "Your code — enter it on another device to pull these stats in", sv: "Din kod — ange den på en annan enhet för att hämta in statistiken", fr: "Ton code — entre-le sur un autre appareil pour récupérer ces stats", de: "Dein Code — gib ihn auf einem anderen Gerät ein, um diese Werte zu übernehmen", es: "Tu código — introdúcelo en otro dispositivo para traer estas estadísticas" },
  "dashboard.restore_placeholder": { en: "Got a code? Restore it", sv: "Har du en kod? Återställ", fr: "Un code ? Restaure-le", de: "Hast du einen Code? Wiederherstellen", es: "¿Tienes un código? Restaurar" },
  "dashboard.restore_checking": { en: "Checking…", sv: "Kontrollerar…", fr: "Vérification…", de: "Wird geprüft…", es: "Comprobando…" },
  "dashboard.restore_not_found": { en: "No stats found for that code.", sv: "Ingen statistik hittades för den koden.", fr: "Aucune statistique trouvée pour ce code.", de: "Keine Statistik für diesen Code gefunden.", es: "No se encontraron estadísticas para ese código." },
  "dashboard.restore_success": { en: "Restored — merged in, nothing on this device was lost.", sv: "Återställt — sammanfogat, inget på den här enheten gick förlorat.", fr: "Restauré — fusionné, rien n'a été perdu sur cet appareil.", de: "Wiederhergestellt — zusammengeführt, nichts auf diesem Gerät ging verloren.", es: "Restaurado — combinado, no se perdió nada en este dispositivo." },
  "dashboard.recent_sessions": { en: "Recent sessions", sv: "Senaste sessionerna", fr: "Sessions récentes", de: "Letzte Sitzungen", es: "Sesiones recientes" },
  "dashboard.nothing_logged": { en: "Nothing logged yet.", sv: "Inget loggat ännu.", fr: "Rien d'enregistré pour l'instant.", de: "Noch nichts erfasst.", es: "Nada registrado todavía." },
  "dashboard.prompts.one": { en: "{n} prompt", sv: "{n} fråga", fr: "{n} question", de: "{n} Aufgabe", es: "{n} pregunta" },
  "dashboard.prompts.other": { en: "{n} prompts", sv: "{n} frågor", fr: "{n} questions", de: "{n} Aufgaben", es: "{n} preguntas" },

  "goal_pill.title": { en: "Tap to change your daily goal", sv: "Tryck för att ändra ditt dagliga mål", fr: "Touche pour changer ton objectif quotidien", de: "Tippen, um dein Tagesziel zu ändern", es: "Toca para cambiar tu meta diaria" },
  "goal_pill.today": { en: "{current}/{target} today", sv: "{current}/{target} idag", fr: "{current}/{target} aujourd'hui", de: "{current}/{target} heute", es: "{current}/{target} hoy" },
  "goal_pill.min": { en: "{current}/{target} min", sv: "{current}/{target} min", fr: "{current}/{target} min", de: "{current}/{target} Min", es: "{current}/{target} min" },
  "goal_complete.title": { en: "Daily goal crushed!", sv: "Dagens mål krossat!", fr: "Objectif du jour explosé !", de: "Tagesziel gerockt!", es: "¡Meta diaria aplastada!" },
  "goal_complete.body_count": { en: "{n} prompts in today — that's the goal. Keep going if you're into it, or call it there.", sv: "{n} frågor idag — det var målet. Fortsätt om du är taggad, eller avsluta där.", fr: "{n} questions aujourd'hui — objectif atteint. Continue si tu es lancé·e, ou arrête-toi là.", de: "{n} Aufgaben heute — das war das Ziel. Mach weiter, wenn du Lust hast, oder hör hier auf.", es: "{n} preguntas hoy — esa era la meta. Sigue si te apetece, o déjalo ahí." },
  "goal_complete.body_time": { en: "{n} minutes in today — that's the goal. Keep going if you're into it, or call it there.", sv: "{n} minuter idag — det var målet. Fortsätt om du är taggad, eller avsluta där.", fr: "{n} minutes aujourd'hui — objectif atteint. Continue si tu es lancé·e, ou arrête-toi là.", de: "{n} Minuten heute — das war das Ziel. Mach weiter, wenn du Lust hast, oder hör hier auf.", es: "{n} minutos hoy — esa era la meta. Sigue si te apetece, o déjalo ahí." },

  "lang.picker_title": { en: "Language", sv: "Språk", fr: "Langue", de: "Sprache", es: "Idioma" },
};

const ACHIEVEMENT_I18N = {
  "first-correct": { label: { en: "First Blood", sv: "Första poängen", fr: "Premier sang", de: "Erster Treffer", es: "Primera sangre" }, desc: { en: "Land your first correct/engaged answer.", sv: "Din första rätta/engagerade svar.", fr: "Ta première bonne réponse (ou tentative sincère).", de: "Deine erste richtige/engagierte Antwort.", es: "Tu primera respuesta correcta o comprometida." } },
  "streak-3": { label: { en: "3 in a Row", sv: "3 i rad", fr: "3 d'affilée", de: "3 in Folge", es: "3 seguidas" }, desc: { en: "Chain 3 in a row.", sv: "Klara 3 i följd.", fr: "Enchaîne 3 d'affilée.", de: "Verkette 3 in Folge.", es: "Encadena 3 seguidas." } },
  "streak-7": { label: { en: "Hot Streak", sv: "Het svit", fr: "Série chaude", de: "Heiße Serie", es: "Racha caliente" }, desc: { en: "Chain 7 in a row.", sv: "Klara 7 i följd.", fr: "Enchaîne 7 d'affilée.", de: "Verkette 7 in Folge.", es: "Encadena 7 seguidas." } },
  "streak-15": { label: { en: "Unstoppable", sv: "Ostoppbar", fr: "Imparable", de: "Unaufhaltsam", es: "Imparable" }, desc: { en: "Chain 15 in a row.", sv: "Klara 15 i följd.", fr: "Enchaîne 15 d'affilée.", de: "Verkette 15 in Folge.", es: "Encadena 15 seguidas." } },
  polymath: { label: { en: "Polymath", sv: "Mångkunnig", fr: "Polymathe", de: "Universalgenie", es: "Polímata" }, desc: { en: "Touch all 4 domains in one session.", sv: "Rör alla 4 områden i en session.", fr: "Touche les 4 domaines en une session.", de: "Berühre alle 4 Bereiche in einer Sitzung.", es: "Toca las 4 áreas en una sesión." } },
  "domain-maxed": { label: { en: "Maxed Out", sv: "Maxad", fr: "Au max", de: "Ausgemaxt", es: "Al máximo" }, desc: { en: "Hit the top level in any domain.", sv: "Nå högsta nivån inom valfritt område.", fr: "Atteins le niveau max dans un domaine.", de: "Erreiche das Höchstlevel in einem Bereich.", es: "Alcanza el nivel máximo en cualquier área." } },
  renaissance: { label: { en: "Renaissance Mind", sv: "Renässanssinne", fr: "Esprit universel", de: "Renaissance-Geist", es: "Mente renacentista" }, desc: { en: "Reach level 3+ in every domain.", sv: "Nå nivå 3+ inom alla områden.", fr: "Atteins le niveau 3+ dans tous les domaines.", de: "Erreiche Level 3+ in jedem Bereich.", es: "Alcanza el nivel 3+ en todas las áreas." } },
  "day-streak-7": { label: { en: "Week One", sv: "Vecka ett", fr: "Semaine une", de: "Woche eins", es: "Semana uno" }, desc: { en: "7-day streak.", sv: "7 dagars svit.", fr: "Série de 7 jours.", de: "7 Tage in Folge.", es: "Racha de 7 días." } },
  "day-streak-30": { label: { en: "Dedicated", sv: "Hängiven", fr: "Assidu·e", de: "Hingebungsvoll", es: "Dedicado" }, desc: { en: "30-day streak.", sv: "30 dagars svit.", fr: "Série de 30 jours.", de: "30 Tage in Folge.", es: "Racha de 30 días." } },
  "goal-crusher": { label: { en: "Goal Crusher", sv: "Målkrossare", fr: "Broyeur d'objectifs", de: "Zielzertrümmerer", es: "Rompemetas" }, desc: { en: "Hit your daily goal.", sv: "Nå ditt dagliga mål.", fr: "Atteins ton objectif quotidien.", de: "Erreiche dein Tagesziel.", es: "Alcanza tu meta diaria." } },
  "goal-crusher-10": { label: { en: "Creature of Habit", sv: "Vanedjur", fr: "Créature d'habitude", de: "Gewohnheitstier", es: "Animal de costumbres" }, desc: { en: "Hit your daily goal 10 times.", sv: "Nå ditt dagliga mål 10 gånger.", fr: "Atteins ton objectif quotidien 10 fois.", de: "Erreiche dein Tagesziel 10-mal.", es: "Alcanza tu meta diaria 10 veces." } },
  "night-owl": { label: { en: "Night Owl", sv: "Nattuggla", fr: "Oiseau de nuit", de: "Nachteule", es: "Ave nocturna" }, desc: { en: "Answer something after 11pm.", sv: "Svara på något efter 23.", fr: "Réponds à quelque chose après 23h.", de: "Antworte auf etwas nach 23 Uhr.", es: "Responde algo después de las 23 h." } },
  "early-bird": { label: { en: "Early Bird", sv: "Morgonpigg", fr: "Lève-tôt", de: "Frühaufsteher", es: "Madrugador" }, desc: { en: "Answer something before 7am.", sv: "Svara på något innan 7.", fr: "Réponds à quelque chose avant 7h.", de: "Antworte auf etwas vor 7 Uhr.", es: "Responde algo antes de las 7 h." } },
};

const DOMAIN_I18N = {
  math: {
    label: { en: "Math & Science", sv: "Matte & Vetenskap", fr: "Maths & Sciences", de: "Mathe & Wissenschaft", es: "Mates y Ciencia" },
    short: { en: "Math/Sci", sv: "Matte/Vet", fr: "Maths/Sci", de: "Mathe/Wiss", es: "Mates/Cien" },
    tagline: { en: "Break things down until they make sense.", sv: "Bryt ner det tills det ger mening.", fr: "Décortique jusqu'à ce que ça ait du sens.", de: "Zerlege es, bis es Sinn ergibt.", es: "Desármalo hasta que tenga sentido." },
    levels: {
      en: ["Static", "Signal", "Charged", "Singularity", "Unstable Genius"],
      sv: ["Statisk", "Signal", "Laddad", "Singularitet", "Instabilt geni"],
      fr: ["Statique", "Signal", "Chargé", "Singularité", "Génie instable"],
      de: ["Statisch", "Signal", "Geladen", "Singularität", "Instabiles Genie"],
      es: ["Estático", "Señal", "Cargado", "Singularidad", "Genio inestable"],
    },
  },
  writing: {
    label: { en: "Creative Writing", sv: "Kreativt skrivande", fr: "Écriture créative", de: "Kreatives Schreiben", es: "Escritura creativa" },
    short: { en: "Writing", sv: "Skrivande", fr: "Écriture", de: "Schreiben", es: "Escritura" },
    tagline: { en: "Choices branch the story. There's no wrong draft.", sv: "Val förgrenar historien. Det finns inget fel utkast.", fr: "Tes choix ramifient l'histoire. Aucun brouillon n'est raté.", de: "Entscheidungen verzweigen die Geschichte. Es gibt keinen falschen Entwurf.", es: "Las decisiones ramifican la historia. No hay borrador equivocado." },
    levels: {
      en: ["Draft Zero", "Ink Slinger", "Plot Twister", "Cult Author", "Ghostwriter of Legend"],
      sv: ["Utkast noll", "Bläckslungare", "Vändningsmästare", "Kultförfattare", "Legendarisk spökskrivare"],
      fr: ["Brouillon zéro", "Plume affûtée", "Maître des rebondissements", "Auteur culte", "Nègre légendaire"],
      de: ["Entwurf null", "Tintenschleuderer", "Wendungsmeister", "Kultautor", "Legendärer Ghostwriter"],
      es: ["Borrador cero", "Lanzatinta", "Maestro del giro", "Autor de culto", "Escritor fantasma legendario"],
    },
  },
  coding: {
    label: { en: "Coding", sv: "Kodning", fr: "Code", de: "Coding", es: "Programación" },
    short: { en: "Code", sv: "Kod", fr: "Code", de: "Code", es: "Código" },
    tagline: { en: "Trace it, break it, rebuild it better.", sv: "Spåra det, bryt det, bygg om det bättre.", fr: "Trace-le, casse-le, reconstruis-le mieux.", de: "Nachvollziehen, kaputt machen, besser wieder aufbauen.", es: "Rastréalo, rómpelo, reconstrúyelo mejor." },
    levels: {
      en: ["Script Kid", "Byte Bender", "Stack Overflow Regular", "Root Access", "Kernel Whisperer"],
      sv: ["Skriptunge", "Bytböjare", "Stack Overflow-stammis", "Rootåtkomst", "Kärnviskare"],
      fr: ["Script kiddie", "Dompteur d'octets", "Habitué de Stack Overflow", "Accès root", "Chuchoteur de noyau"],
      de: ["Skript-Kiddie", "Byte-Bändiger", "Stack-Overflow-Stammgast", "Root-Zugriff", "Kernel-Flüsterer"],
      es: ["Novato de script", "Domador de bytes", "Habitual de Stack Overflow", "Acceso root", "Susurrador del kernel"],
    },
  },
  trivia: {
    label: { en: "Trivia", sv: "Allmänbildning", fr: "Culture générale", de: "Allgemeinwissen", es: "Trivia" },
    short: { en: "Trivia", sv: "Allmänbild.", fr: "Culture G", de: "Wissen", es: "Trivia" },
    tagline: { en: "Random knowledge. Deploy at will.", sv: "Slumpmässig kunskap. Använd fritt.", fr: "Savoir aléatoire. Déploie-le à volonté.", de: "Zufälliges Wissen. Nach Belieben einsetzen.", es: "Conocimiento aleatorio. Úsalo cuando quieras." },
    levels: {
      en: ["Lurker", "Deep Cut", "Rabbit Hole", "Walking Wikipedia", "Oracle"],
      sv: ["Smygtittare", "Djupdykare", "Kaninhål", "Vandrande Wikipedia", "Orakel"],
      fr: ["Observateur", "Pépite obscure", "Terrier de lapin", "Wikipédia ambulant", "Oracle"],
      de: ["Mitleser", "Geheimtipp", "Kaninchenbau", "Wandelndes Wikipedia", "Orakel"],
      es: ["Observador", "Dato oculto", "Madriguera de conejo", "Wikipedia andante", "Oráculo"],
    },
  },
};

const I18n = {
  current: "en",

  init() {
    this.current = localStorage.getItem("dq:lang") || this.detectDefault();
  },

  detectDefault() {
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return I18N_LANGS.some((l) => l.code === nav) ? nav : "en";
  },

  setLang(code) {
    this.current = code;
    localStorage.setItem("dq:lang", code);
  },

  t(key, vars) {
    const entry = I18N_STRINGS[key];
    let str = entry ? entry[this.current] || entry.en : key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
      });
    }
    return str;
  },

  plural(baseKey, n, vars) {
    const key = `${baseKey}.${n === 1 ? "one" : "other"}`;
    return this.t(key, { n, ...vars });
  },

  // Picks a random numbered variant from a pool like "feedback.correct.0",
  // "feedback.correct.1", ... so the same headline doesn't show every time.
  tRandom(baseKey, count, vars) {
    const i = Math.floor(Math.random() * count);
    return this.t(`${baseKey}.${i}`, vars);
  },

  achievementLabel(id) {
    const a = ACHIEVEMENT_I18N[id];
    return a ? a.label[this.current] || a.label.en : id;
  },

  achievementDesc(id) {
    const a = ACHIEVEMENT_I18N[id];
    return a ? a.desc[this.current] || a.desc.en : "";
  },

  domainLabel(id) {
    return DOMAIN_I18N[id].label[this.current] || DOMAIN_I18N[id].label.en;
  },

  domainShort(id) {
    return DOMAIN_I18N[id].short[this.current] || DOMAIN_I18N[id].short.en;
  },

  domainTagline(id) {
    return DOMAIN_I18N[id].tagline[this.current] || DOMAIN_I18N[id].tagline.en;
  },

  domainLevels(id) {
    return DOMAIN_I18N[id].levels[this.current] || DOMAIN_I18N[id].levels.en;
  },

  // Walks the DOM for data-i18n / data-i18n-placeholder / data-i18n-title
  // and fills them in. Call at boot and after every language switch.
  applyStaticDOM(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = this.t(el.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });
    root.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.title = this.t(el.dataset.i18nTitle);
    });
  },
};

I18n.init();

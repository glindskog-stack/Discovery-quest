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
  "brand.tagline": { en: "No grades. No limits. Just get silly good at something.", sv: "Inga betyg. Inga gränser. Bli bara stört bra på nåt.", fr: "Pas de notes. Pas de limites. Juste deviens trop fort en un truc.", de: "Keine Noten. Keine Grenzen. Werd einfach verdammt gut in irgendwas.", es: "Sin notas. Sin límites. Ponte ridículamente bueno en algo." },

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
  "tabs.home": { en: "Home", sv: "Hem", fr: "Accueil", de: "Start", es: "Inicio" },
  "tabs.rocket": { en: "Rocket", sv: "Raket", fr: "Fusée", de: "Rakete", es: "Cohete" },
  "tabs.stats": { en: "Stats", sv: "Statistik", fr: "Stats", de: "Statistik", es: "Estadísticas" },
  "btn.switch_profile_title": { en: "Switch profile", sv: "Byt profil", fr: "Changer de profil", de: "Profil wechseln", es: "Cambiar de perfil" },
  "btn.sound_title": { en: "Sound", sv: "Ljud", fr: "Son", de: "Ton", es: "Sonido" },
  "btn.language_title": { en: "Language", sv: "Språk", fr: "Langue", de: "Sprache", es: "Idioma" },
  "btn.submit": { en: "Submit", sv: "Skicka", fr: "Envoyer", de: "Absenden", es: "Enviar" },
  "btn.add": { en: "Add", sv: "Lägg till", fr: "Ajouter", de: "Hinzufügen", es: "Añadir" },
  "btn.close": { en: "Close", sv: "Stäng", fr: "Fermer", de: "Schließen", es: "Cerrar" },
  "btn.restore": { en: "Restore", sv: "Återställ", fr: "Restaurer", de: "Wiederherstellen", es: "Restaurar" },
  "btn.keep_going": { en: "Keep going", sv: "Fortsätt", fr: "Continuer", de: "Weitermachen", es: "Seguir" },
  "btn.skip": { en: "Skip this one", sv: "Hoppa över", fr: "Passer", de: "Überspringen", es: "Saltar esta" },
  "btn.new_profile": { en: "+ New profile", sv: "+ Ny profil", fr: "+ Nouveau profil", de: "+ Neues Profil", es: "+ Nuevo perfil" },

  "quest.freeresponse_placeholder": { en: "Type here. No wrong answers.", sv: "Skriv här. Inga fel svar.", fr: "Écris ici. Pas de mauvaise réponse.", de: "Schreib hier. Es gibt keine falsche Antwort.", es: "Escribe aquí. No hay respuestas incorrectas." },
  "quest.words": { en: "{n} / {target} words", sv: "{n} / {target} ord", fr: "{n} / {target} mots", de: "{n} / {target} Wörter", es: "{n} / {target} palabras" },
  "quest.grading": { en: "Reading your answer…", sv: "Läser ditt svar…", fr: "Lecture de ta réponse…", de: "Lese deine Antwort…", es: "Leyendo tu respuesta…" },
  "quest.how_was_that": { en: "How was that?", sv: "Hur kändes det?", fr: "C'était comment ?", de: "Wie war's?", es: "¿Qué tal estuvo?" },
  "quest.new_best_streak": { en: "New best streak: {n}", sv: "Ny bästa svit: {n}", fr: "Nouveau record de série : {n}", de: "Neue Bestserie: {n}", es: "Nueva mejor racha: {n}" },
  "quest.level_up": { en: "Level up", sv: "Ny nivå", fr: "Niveau supérieur", de: "Level-Aufstieg", es: "Subiste de nivel" },
  "quest.source": { en: "Source: {name}", sv: "Källa: {name}", fr: "Source : {name}", de: "Quelle: {name}", es: "Fuente: {name}" },
  "quest.source_checked": { en: " · checked {date}", sv: " · kontrollerad {date}", fr: " · vérifié {date}", de: " · geprüft {date}", es: " · verificado {date}" },
  "quest.ahead_of": { en: "Now ahead of {pct}% of explorers in {domain}.", sv: "Nu före {pct}% av utforskarna inom {domain}.", fr: "Maintenant devant {pct}% des explorateurs en {domain}.", de: "Jetzt vor {pct}% der Entdecker in {domain}.", es: "Ahora por delante del {pct}% de exploradores en {domain}." },

  // Feedback headlines: picked at random (see pickRandomFeedback in app.js)
  // so answering doesn't feel like reading the same toast every time.
  "feedback.correct.0": { en: "Correct. Flex responsibly.", sv: "Rätt. Skryt med måtta.", fr: "Correct. Frime avec modération.", de: "Richtig. Flex verantwortungsvoll.", es: "Correcto. Presume con moderación." },
  "feedback.correct.1": { en: "Nailed it — go off.", sv: "Helt rätt — kör hårt.", fr: "En plein dans le mille — vas-y à fond.", de: "Genau richtig — leg los.", es: "En el clavo — dale con todo." },
  "feedback.correct.2": { en: "Boom. Big brain moment.", sv: "Bom. Stor-hjärna-moment.", fr: "Boum. Moment gros cerveau.", de: "Bumm. Großhirn-Moment.", es: "Boom. Momento cerebrote." },
  "feedback.correct.3": { en: "Scary how right that was.", sv: "Läskigt rätt, det där.", fr: "Flippant, à quel point c'était juste.", de: "Unheimlich, wie richtig das war.", es: "Da miedo lo acertado que fue eso." },
  "feedback.correct.4": { en: "Yes! Exactly that.", sv: "Ja! Precis så.", fr: "Oui ! Exactement ça.", de: "Ja! Genau das.", es: "¡Sí! Exactamente eso." },
  "feedback.incorrect.0": { en: "Not quite — plot twist:", sv: "Inte riktigt — här kommer twisten:", fr: "Pas tout à fait — rebondissement :", de: "Nicht ganz — Wendung:", es: "No exactamente — giro inesperado:" },
  "feedback.incorrect.1": { en: "So close it almost counts. Here's why:", sv: "Så nära att det nästan räknas. Så här var det:", fr: "Si près que ça compte presque. Voici pourquoi :", de: "So knapp, dass es fast zählt. Hier ist warum:", es: "Tan cerca que casi cuenta. Aquí el porqué:" },
  "feedback.incorrect.2": { en: "Bold guess. Wrong, but bold:", sv: "Djärv gissning. Fel, men djärv:", fr: "Tentative osée. Fausse, mais osée :", de: "Mutiger Versuch. Falsch, aber mutig:", es: "Suposición audaz. Errónea, pero audaz:" },
  "feedback.incorrect.3": { en: "Missed — steal this fact for later:", sv: "Fel — sno den här faktan till senare:", fr: "Raté — pique ce fait pour plus tard :", de: "Daneben — schnapp dir das für später:", es: "Fallaste — apunta este dato para luego:" },
  "feedback.incorrect.4": { en: "Nope. But now you know:", sv: "Nix. Men nu vet du:", fr: "Non. Mais maintenant tu sais :", de: "Nö. Aber jetzt weißt du's:", es: "No. Pero ahora ya lo sabes:" },
  "feedback.creative_good.0": { en: "Okay, that's genuinely good.", sv: "Okej, det där var faktiskt bra.", fr: "Ok, c'est vraiment bon, ça.", de: "Okay, das war wirklich gut.", es: "Vale, eso fue realmente bueno." },
  "feedback.creative_good.1": { en: "That take? Elite.", sv: "Den där idén? Elit.", fr: "Cette idée ? Du haut niveau.", de: "Diese Idee? Elite.", es: "¿Esa idea? De élite." },
  "feedback.creative_good.2": { en: "Certified good idea.", sv: "Certifierat bra idé.", fr: "Idée certifiée bonne.", de: "Zertifiziert gute Idee.", es: "Idea certificada como buena." },
  "feedback.creative_good.3": { en: "Wrote that like you meant it.", sv: "Skrev det där som du menade det.", fr: "Écrit comme si tu le pensais vraiment.", de: "Geschrieben, als hättest du's ernst gemeint.", es: "Lo escribiste como si lo sintieras de verdad." },
  "feedback.creative_good.4": { en: "Main-character energy, confirmed.", sv: "Huvudkaraktärsenergi, bekräftat.", fr: "Énergie de personnage principal, confirmée.", de: "Hauptfigur-Energie, bestätigt.", es: "Energía de protagonista, confirmada." },
  "feedback.creative_meh.0": { en: "Logged. Onward.", sv: "Loggat. Vidare.", fr: "Enregistré. On avance.", de: "Notiert. Weiter geht's.", es: "Registrado. Adelante." },
  "feedback.creative_meh.1": { en: "Effort noted. Respect.", sv: "Ansträngning noterad. Respekt.", fr: "Effort noté. Respect.", de: "Mühe registriert. Respekt.", es: "Esfuerzo anotado. Respeto." },
  "feedback.creative_meh.2": { en: "Not your favorite, still counts.", sv: "Inte din favorit, räknas ändå.", fr: "Pas ton préféré, ça compte quand même.", de: "Nicht dein Favorit, zählt trotzdem.", es: "No fue tu favorita, pero cuenta igual." },
  "feedback.creative_skipped": { en: "Skipped — no hard feelings. Next:", sv: "Hoppade över — inga hårda känslor. Nästa:", fr: "Passé — pas de rancune. Suivant :", de: "Übersprungen — kein Groll. Weiter:", es: "Omitido — sin rencores. Siguiente:" },
  "feedback.creative_retry": { en: "Nice try, but try for real this time:", sv: "Bra försök, men försök på riktigt den här gången:", fr: "Bel essai, mais essaie pour de vrai cette fois :", de: "Netter Versuch, aber diesmal richtig versuchen:", es: "Buen intento, pero esta vez inténtalo de verdad:" },

  "btn.start_quest": { en: "Start quest", sv: "Starta questet", fr: "Lancer la quête", de: "Quest starten", es: "Empezar la misión" },
  "focus.first_run_hint": { en: "Quick pick before we dive in — choose what to focus on, or just hit Start.", sv: "Snabbval innan vi kör igång — välj vad du vill fokusera på, eller tryck bara Starta.", fr: "Petit choix avant de plonger — choisis ce qui t'intéresse, ou lance-toi directement.", de: "Kurze Auswahl, bevor's losgeht — wähle deinen Fokus oder starte direkt.", es: "Elección rápida antes de empezar — elige tu enfoque o simplemente pulsa Empezar." },

  "focus.title": { en: "Focus", sv: "Fokus", fr: "Focus", de: "Fokus", es: "Enfoque" },
  "focus.theme_label": { en: "Appearance", sv: "Utseende", fr: "Apparence", de: "Erscheinungsbild", es: "Apariencia" },
  "focus.theme_dark": { en: "Dark", sv: "Mörkt", fr: "Sombre", de: "Dunkel", es: "Oscuro" },
  "focus.theme_dark_sub": { en: "the original", sv: "originalet", fr: "l'original", de: "das Original", es: "el original" },
  "focus.theme_light": { en: "Light", sv: "Ljust", fr: "Clair", de: "Hell", es: "Claro" },
  "focus.theme_light_sub": { en: "same energy, paper-bright", sv: "samma energi, pappersljust", fr: "même énergie, clair comme du papier", de: "gleiche Energie, papierhell", es: "misma energía, luminoso como papel" },
  "focus.difficulty_label": { en: "Difficulty", sv: "Svårighetsgrad", fr: "Difficulté", de: "Schwierigkeit", es: "Dificultad" },
  "focus.difficulty_hint": { en: "The engine already nudges this up and down per domain based on how you're doing — use these if it's drifted somewhere you don't want.", sv: "Motorn justerar redan detta upp och ner per ämne beroende på hur det går — använd de här om det hamnat fel.", fr: "Le moteur ajuste déjà ça par domaine selon tes résultats — utilise ceci si ça a dérivé là où tu ne veux pas.", de: "Die Engine passt das ohnehin pro Bereich an, je nachdem wie's läuft — nutze das hier, falls es woanders hin abgedriftet ist.", es: "El motor ya ajusta esto por área según cómo te va — usa esto si se ha desviado a donde no quieres." },
  "focus.difficulty_reset_confirm": { en: "Reset to {level} across every subject.", sv: "Återställd till {level} inom alla ämnen.", fr: "Réinitialisé sur {level} pour toutes les matières.", de: "Auf {level} für alle Bereiche zurückgesetzt.", es: "Restablecido a {level} en todas las áreas." },
  "focus.reminder_label": { en: "Daily reminder", sv: "Daglig påminnelse", fr: "Rappel quotidien", de: "Tägliche Erinnerung", es: "Recordatorio diario" },
  "focus.reminder_hint": { en: "A once-a-day nudge if you haven't opened the app yet.", sv: "En påminnelse en gång om dagen om du inte öppnat appen än.", fr: "Un rappel une fois par jour si tu n'as pas encore ouvert l'appli.", de: "Ein Anstoß einmal täglich, falls du die App noch nicht geöffnet hast.", es: "Un aviso una vez al día si aún no has abierto la app." },
  "btn.reminder_enable": { en: "Turn on", sv: "Slå på", fr: "Activer", de: "Aktivieren", es: "Activar" },
  "btn.reminder_disable": { en: "Turn off", sv: "Stäng av", fr: "Désactiver", de: "Deaktivieren", es: "Desactivar" },
  "focus.reminder_status_on": { en: "On — {time} every day.", sv: "På — {time} varje dag.", fr: "Activé — {time} chaque jour.", de: "An — {time} jeden Tag.", es: "Activado — {time} cada día." },
  "focus.reminder_status_off": { en: "Off.", sv: "Av.", fr: "Désactivé.", de: "Aus.", es: "Desactivado." },
  "focus.reminder_unsupported": { en: "Not supported on this device/browser.", sv: "Stöds inte på den här enheten/webbläsaren.", fr: "Non pris en charge sur cet appareil/navigateur.", de: "Auf diesem Gerät/Browser nicht unterstützt.", es: "No compatible con este dispositivo/navegador." },
  "focus.reminder_denied": { en: "Notifications are blocked — enable them for this app in your device settings.", sv: "Aviseringar är blockerade — tillåt dem för appen i enhetens inställningar.", fr: "Les notifications sont bloquées — active-les pour cette appli dans les réglages.", de: "Benachrichtigungen sind blockiert — aktiviere sie für diese App in den Geräteeinstellungen.", es: "Las notificaciones están bloqueadas — actívalas para esta app en los ajustes del dispositivo." },
  "focus.reminder_error": { en: "Couldn't save that — try again in a moment.", sv: "Kunde inte spara — försök igen om en stund.", fr: "Impossible d'enregistrer — réessaie dans un instant.", de: "Konnte nicht gespeichert werden — versuch's gleich nochmal.", es: "No se pudo guardar — inténtalo de nuevo en un momento." },
  "focus.subjects_label": { en: "Subjects", sv: "Ämnen", fr: "Matières", de: "Fächer", es: "Materias" },
  "focus.subjects_hint": { en: "Turn off anything you're not into — flip it back on anytime.", sv: "Stäng av det du inte gillar — sätt på igen när du vill.", fr: "Désactive ce qui ne t'intéresse pas — réactive-le quand tu veux.", de: "Schalte aus, was dich nicht interessiert — jederzeit wieder anschaltbar.", es: "Desactiva lo que no te interese — vuelve a activarlo cuando quieras." },
  "focus.style_mix_label": { en: "Writing amount", sv: "Mängd skrivande", fr: "Part d'écriture", de: "Menge Schreiben", es: "Cantidad de escritura" },
  "focus.style_mix_hint": { en: "How much open-ended writing vs quick multiple choice you get.", sv: "Hur mycket fritt skrivande jämfört med snabba flervalsfrågor du får.", fr: "La part d'écriture libre par rapport aux questions à choix rapide.", de: "Wie viel freies Schreiben im Vergleich zu schnellen Multiple-Choice-Fragen.", es: "Cuánta escritura libre frente a preguntas rápidas de opción múltiple." },
  "focus.style_mix_quiz": { en: "Quiz only", sv: "Bara quiz", fr: "Que du quiz", de: "Nur Quiz", es: "Solo cuestionario" },
  "focus.style_mix_mostly_quiz": { en: "Mostly quiz", sv: "Mest quiz", fr: "Surtout du quiz", de: "Meist Quiz", es: "Mayormente cuestionario" },
  "focus.style_mix_balanced": { en: "Balanced", sv: "Balanserat", fr: "Équilibré", de: "Ausgewogen", es: "Equilibrado" },
  "focus.style_mix_mostly_writing": { en: "Mostly writing", sv: "Mest skrivande", fr: "Surtout de l'écriture", de: "Meist Schreiben", es: "Mayormente escritura" },
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
  "focus.queued": { en: "✓ Queued", sv: "✓ Köad", fr: "✓ En file", de: "✓ Vorgemerkt", es: "✓ En cola" },
  "focus.language_title": { en: "Language", sv: "Språk", fr: "Langue", de: "Sprache", es: "Idioma" },

  "dashboard.day_streak.one": { en: "{n} day streak", sv: "{n} dags svit", fr: "{n} jour de suite", de: "{n} Tag in Folge", es: "{n} día seguido" },
  "dashboard.day_streak.other": { en: "{n} day streak", sv: "{n} dagars svit", fr: "{n} jours de suite", de: "{n} Tage in Folge", es: "{n} días seguidos" },
  "dashboard.longest_run": { en: "longest run: {n}", sv: "längsta svit: {n}", fr: "record : {n}", de: "längste Serie: {n}", es: "racha más larga: {n}" },
  "dashboard.progress_title": { en: "Your progress", sv: "Dina framsteg", fr: "Ta progression", de: "Dein Fortschritt", es: "Tu progreso" },
  "dashboard.progress_empty": { en: "Play a couple more sessions and this'll fill in with your trend.", sv: "Kör några fler pass så fylls det här i med din trend.", fr: "Fais encore quelques sessions et ta tendance apparaîtra ici.", de: "Spiel noch ein paar Runden, dann füllt sich das mit deinem Trend.", es: "Juega un par de sesiones más y aquí aparecerá tu tendencia." },
  "dashboard.progress_caption": { en: "{n} XP across your last {sessions} sessions", sv: "{n} XP under dina senaste {sessions} pass", fr: "{n} XP sur tes {sessions} dernières sessions", de: "{n} XP in deinen letzten {sessions} Runden", es: "{n} XP en tus últimas {sessions} sesiones" },
  "dashboard.brain_fact_label": { en: "Why this matters", sv: "Varför det spelar roll", fr: "Pourquoi c'est important", de: "Warum das wichtig ist", es: "Por qué importa" },
  "dashboard.brain_fact.0": { en: "Your brain physically rewires itself every time you learn something — neuroscientists call it neuroplasticity, and it never fully turns off, no matter how old you get.", sv: "Din hjärna kopplar om sig fysiskt varje gång du lär dig något nytt — forskare kallar det neuroplasticitet, och det stannar aldrig helt av, oavsett hur gammal du blir.", fr: "Ton cerveau se recâble physiquement à chaque fois que tu apprends quelque chose — les neuroscientifiques appellent ça la neuroplasticité, et ça ne s'arrête jamais complètement, peu importe ton âge.", de: "Dein Gehirn verdrahtet sich physisch neu, jedes Mal wenn du etwas lernst — Neurowissenschaftler nennen das Neuroplastizität, und es hört nie ganz auf, egal wie alt du wirst.", es: "Tu cerebro se recablea físicamente cada vez que aprendes algo — los neurocientíficos lo llaman neuroplasticidad, y nunca se detiene del todo, sin importar tu edad." },
  "dashboard.brain_fact.1": { en: "Getting a question wrong and then finding out why builds stronger memory than reading the right answer straight away. Mistakes are doing real work.", sv: "Att svara fel och sedan förstå varför bygger starkare minne än att bara läsa rätt svar direkt. Misstag gör faktiskt nytta.", fr: "Se tromper puis comprendre pourquoi construit une mémoire plus solide que lire directement la bonne réponse. Les erreurs font un vrai travail.", de: "Eine Frage falsch zu beantworten und dann herauszufinden warum, baut ein stärkeres Gedächtnis auf, als die richtige Antwort sofort zu lesen. Fehler leisten echte Arbeit.", es: "Responder mal y luego descubrir por qué construye una memoria más fuerte que leer la respuesta correcta de inmediato. Los errores hacen un trabajo real." },
  "dashboard.brain_fact.2": { en: "Neuroscientist Donald Hebb summed up how practice works in one line: \"neurons that fire together, wire together.\" Repetition isn't boring — it's construction.", sv: "Neuroforskaren Donald Hebb sammanfattade hur träning funkar i en mening: \"nervceller som avfyras tillsammans, kopplas samman.\" Repetition är inte tråkigt — det är byggarbete.", fr: "Le neuroscientifique Donald Hebb a résumé le fonctionnement de l'entraînement en une phrase : \"les neurones qui s'activent ensemble se connectent ensemble.\" La répétition n'est pas ennuyeuse — c'est de la construction.", de: "Der Neurowissenschaftler Donald Hebb fasste in einem Satz zusammen, wie Übung funktioniert: \"Neuronen, die zusammen feuern, verdrahten sich zusammen.\" Wiederholung ist nicht langweilig — sie ist Aufbauarbeit.", es: "El neurocientífico Donald Hebb resumió cómo funciona la práctica en una frase: \"las neuronas que se activan juntas, se conectan juntas.\" La repetición no es aburrida — es construcción." },
  "dashboard.brain_fact.3": { en: "Spacing your practice out over several days beats cramming it into one sitting — memory research has shown this since Hermann Ebbinghaus's \"forgetting curve,\" over a century ago.", sv: "Att sprida ut träningen över flera dagar slår att plugga ihop allt på en gång — minnesforskning har visat det sen Hermann Ebbinghaus \"glömskekurva\" för över hundra år sedan.", fr: "Étaler ta pratique sur plusieurs jours bat le bachotage en une seule fois — la recherche sur la mémoire le montre depuis la \"courbe de l'oubli\" de Hermann Ebbinghaus, il y a plus d'un siècle.", de: "Das Üben über mehrere Tage zu verteilen schlägt das Pauken an einem Stück — die Gedächtnisforschung zeigt das seit Hermann Ebbinghaus' \"Vergessenskurve\" vor über hundert Jahren.", es: "Distribuir tu práctica en varios días vence a estudiar todo de una sentada — la investigación sobre la memoria lo demuestra desde la \"curva del olvido\" de Hermann Ebbinghaus, hace más de un siglo." },
  "dashboard.brain_fact.4": { en: "Curiosity isn't just a nice feeling — it puts your brain into a state that makes it easier to remember what happens next, even unrelated stuff.", sv: "Nyfikenhet är inte bara en skön känsla — den sätter din hjärna i ett läge där det blir lättare att minnas det som händer sen, även sånt som inte hänger ihop.", fr: "La curiosité n'est pas juste une sensation agréable — elle met ton cerveau dans un état qui facilite la mémorisation de ce qui suit, même des trucs sans rapport.", de: "Neugier ist nicht nur ein schönes Gefühl — sie versetzt dein Gehirn in einen Zustand, in dem es leichter fällt, sich an das zu erinnern, was als Nächstes passiert, sogar unabhängige Sachen.", es: "La curiosidad no es solo una sensación agradable — pone a tu cerebro en un estado que facilita recordar lo que viene después, incluso cosas no relacionadas." },
  "dashboard.brain_fact.5": { en: "The \"testing effect\": quizzing yourself on something builds stronger memory than re-reading it ever will. Every question here is doing more than it looks like.", sv: "\"Testeffekten\": att quizza dig själv på något bygger starkare minne än vad omläsning någonsin gör. Varje fråga här gör mer än den ser ut att göra.", fr: "\"L'effet de test\" : te tester sur quelque chose construit une mémoire plus forte que le relire ne le fera jamais. Chaque question ici fait plus que ce qu'elle en a l'air.", de: "Der \"Testeffekt\": Sich selbst abzufragen baut ein stärkeres Gedächtnis auf, als es erneutes Lesen je könnte. Jede Frage hier tut mehr, als es aussieht.", es: "El \"efecto de prueba\": ponerte a prueba sobre algo construye una memoria más fuerte de lo que jamás lo hará releerlo. Cada pregunta aquí hace más de lo que parece." },
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
  "dashboard.history_title": { en: "Answer history", sv: "Svarshistorik", fr: "Historique des réponses", de: "Antwortverlauf", es: "Historial de respuestas" },
  "dashboard.history_hint": { en: "Every question and answer, this device or looked up by code.", sv: "Varje fråga och svar, den här enheten eller uppslaget med en kod.", fr: "Chaque question et réponse, sur cet appareil ou via un code.", de: "Jede Frage und Antwort, auf diesem Gerät oder per Code abgerufen.", es: "Cada pregunta y respuesta, en este dispositivo o buscada con un código." },
  "dashboard.history_lookup_placeholder": { en: "Look up a profile by its code", sv: "Slå upp en profil med dess kod", fr: "Recherche un profil par son code", de: "Profil per Code nachschlagen", es: "Busca un perfil por su código" },
  "dashboard.history_checking": { en: "Loading…", sv: "Laddar…", fr: "Chargement…", de: "Lädt…", es: "Cargando…" },
  "dashboard.history_not_found": { en: "No history found for that code.", sv: "Ingen historik hittades för den koden.", fr: "Aucun historique trouvé pour ce code.", de: "Kein Verlauf für diesen Code gefunden.", es: "No se encontró historial para ese código." },
  "dashboard.history_remote": { en: "Showing history for {code}", sv: "Visar historik för {code}", fr: "Historique affiché pour {code}", de: "Verlauf für {code} wird angezeigt", es: "Mostrando historial de {code}" },
  "dashboard.history_empty": { en: "Nothing answered yet.", sv: "Inget besvarat ännu.", fr: "Rien de répondu pour l'instant.", de: "Noch nichts beantwortet.", es: "Nada respondido todavía." },
  "btn.load": { en: "Load", sv: "Ladda", fr: "Charger", de: "Laden", es: "Cargar" },
  "dashboard.nothing_logged": { en: "Nothing logged yet.", sv: "Inget loggat ännu.", fr: "Rien d'enregistré pour l'instant.", de: "Noch nichts erfasst.", es: "Nada registrado todavía." },
  "dashboard.prompts.one": { en: "{n} prompt", sv: "{n} fråga", fr: "{n} question", de: "{n} Aufgabe", es: "{n} pregunta" },
  "dashboard.prompts.other": { en: "{n} prompts", sv: "{n} frågor", fr: "{n} questions", de: "{n} Aufgaben", es: "{n} preguntas" },

  "goal_pill.title": { en: "Tap to change your daily goal", sv: "Tryck för att ändra ditt dagliga mål", fr: "Touche pour changer ton objectif quotidien", de: "Tippen, um dein Tagesziel zu ändern", es: "Toca para cambiar tu meta diaria" },
  "goal_pill.today": { en: "{current}/{target} today", sv: "{current}/{target} idag", fr: "{current}/{target} aujourd'hui", de: "{current}/{target} heute", es: "{current}/{target} hoy" },
  "goal_pill.min": { en: "{current}/{target} min", sv: "{current}/{target} min", fr: "{current}/{target} min", de: "{current}/{target} Min", es: "{current}/{target} min" },
  "streak_pill.days.one": { en: "{n} day", sv: "{n} dag", fr: "{n} jour", de: "{n} Tag", es: "{n} día" },
  "streak_pill.days.other": { en: "{n} days", sv: "{n} dagar", fr: "{n} jours", de: "{n} Tage", es: "{n} días" },
  "streak_pill.title": { en: "Longest streak: {n} days", sv: "Längsta sviten: {n} dagar", fr: "Plus longue série : {n} jours", de: "Längste Serie: {n} Tage", es: "Racha más larga: {n} días" },
  "goal_complete.title": { en: "Daily goal crushed!", sv: "Dagens mål krossat!", fr: "Objectif du jour explosé !", de: "Tagesziel gerockt!", es: "¡Meta diaria aplastada!" },
  "goal_complete.body_count": { en: "{n} prompts in today — that's the goal. Keep going if you're into it, or call it there.", sv: "{n} frågor idag — det var målet. Fortsätt om du är taggad, eller avsluta där.", fr: "{n} questions aujourd'hui — objectif atteint. Continue si tu es lancé·e, ou arrête-toi là.", de: "{n} Aufgaben heute — das war das Ziel. Mach weiter, wenn du Lust hast, oder hör hier auf.", es: "{n} preguntas hoy — esa era la meta. Sigue si te apetece, o déjalo ahí." },
  "goal_complete.body_time": { en: "{n} minutes in today — that's the goal. Keep going if you're into it, or call it there.", sv: "{n} minuter idag — det var målet. Fortsätt om du är taggad, eller avsluta där.", fr: "{n} minutes aujourd'hui — objectif atteint. Continue si tu es lancé·e, ou arrête-toi là.", de: "{n} Minuten heute — das war das Ziel. Mach weiter, wenn du Lust hast, oder hör hier auf.", es: "{n} minutos hoy — esa era la meta. Sigue si te apetece, o déjalo ahí." },

  "lang.picker_title": { en: "Language", sv: "Språk", fr: "Langue", de: "Sprache", es: "Idioma" },

  "btn.rocket_title": { en: "Rocket Science", sv: "Raketvetenskap", fr: "Science des fusées", de: "Raketenwissenschaft", es: "Ciencia de cohetes" },
  "rocket.title": { en: "Rocket Science", sv: "Raketvetenskap", fr: "Science des fusées", de: "Raketenwissenschaft", es: "Ciencia de cohetes" },
  "rocket.intro": { en: "Three real stages of rocketry. Clear one and your rocket sheds a part — booster, then body, until only the capsule reaches orbit.", sv: "Tre riktiga raketsteg. Klara ett så tappar raketen en del — boostern, sen kroppen, tills bara kapseln når omloppsbana.", fr: "Trois vraies étapes de la fuséologie. Termine une étape et ta fusée perd une partie — le booster, puis le corps, jusqu'à ce que seule la capsule atteigne l'orbite.", de: "Drei echte Raketenstufen. Schließe eine ab und deine Rakete verliert ein Teil — Booster, dann Rumpf, bis nur die Kapsel die Umlaufbahn erreicht.", es: "Tres etapas reales de la cohetería. Completa una y tu cohete pierde una parte — el propulsor, luego el cuerpo, hasta que solo la cápsula llega a órbita." },
  "rocket.stage1_title": { en: "Off the Pad", sv: "Upp från rampen", fr: "Décollage", de: "Vom Startplatz", es: "Despegue" },
  "rocket.stage1_subtitle": { en: "Thrust, Newton's third law, and why boosters get dropped", sv: "Dragkraft, Newtons tredje lag och varför boostrar släpps", fr: "Poussée, 3e loi de Newton, et pourquoi on largue les boosters", de: "Schub, Newtons drittes Gesetz und warum Booster abgeworfen werden", es: "Empuje, la tercera ley de Newton y por qué se sueltan los propulsores" },
  "rocket.stage2_title": { en: "Reaching Orbit", sv: "Nå omloppsbana", fr: "Atteindre l'orbite", de: "Die Umlaufbahn erreichen", es: "Llegar a la órbita" },
  "rocket.stage2_subtitle": { en: "Orbital velocity, staging, and budgeting your delta-v", sv: "Omloppshastighet, stegning och att budgetera din delta-v", fr: "Vitesse orbitale, étagement, et budgétiser son delta-v", de: "Orbitalgeschwindigkeit, Stufung und dein Delta-v budgetieren", es: "Velocidad orbital, etapas y presupuestar tu delta-v" },
  "rocket.stage3_title": { en: "Splashdown", sv: "Havslandning", fr: "Amerrissage", de: "Wasserlandung", es: "Amerizaje" },
  "rocket.stage3_subtitle": { en: "Re-entry, heat shields, and planning a real mission", sv: "Återinträde, värmesköldar och att planera ett riktigt uppdrag", fr: "Rentrée atmosphérique, boucliers thermiques, et planifier une vraie mission", de: "Wiedereintritt, Hitzeschilde und eine echte Mission planen", es: "Reentrada, escudos térmicos y planear una misión real" },
  "rocket.stage_locked": { en: "Finish the stage above first", sv: "Klara steget ovanför först", fr: "Termine d'abord l'étape au-dessus", de: "Schließe zuerst die Stufe darüber ab", es: "Completa antes la etapa de arriba" },
  "rocket.stage_complete": { en: "Complete", sv: "Klart", fr: "Terminé", de: "Abgeschlossen", es: "Completo" },
  "rocket.stage_start": { en: "Start stage", sv: "Starta steget", fr: "Démarrer l'étape", de: "Stufe starten", es: "Empezar etapa" },
  "rocket.stage_continue": { en: "Continue", sv: "Fortsätt", fr: "Continuer", de: "Weiter", es: "Continuar" },
  "rocket.stage_progress": { en: "{n} / {total}", sv: "{n} / {total}", fr: "{n} / {total}", de: "{n} / {total}", es: "{n} / {total}" },
  "rocket.back_to_stages": { en: "Back to stages", sv: "Tillbaka till stegen", fr: "Retour aux étapes", de: "Zurück zu den Stufen", es: "Volver a las etapas" },
  "rocket.mission_complete_title": { en: "Mission complete!", sv: "Uppdrag slutfört!", fr: "Mission accomplie !", de: "Mission abgeschlossen!", es: "¡Misión completa!" },
  "rocket.mission_complete_body": { en: "Your capsule made it to orbit. Every stage was a strategy — nothing carried longer than it needed to be.", sv: "Din kapsel nådde omloppsbana. Varje steg var en strategi — inget bars längre än det behövde.", fr: "Ta capsule a atteint l'orbite. Chaque étape était une stratégie — rien transporté plus longtemps que nécessaire.", de: "Deine Kapsel hat die Umlaufbahn erreicht. Jede Stufe war eine Strategie — nichts wurde länger mitgeführt als nötig.", es: "Tu cápsula llegó a órbita. Cada etapa fue una estrategia — nada se cargó más de lo necesario." },
  "rocket.part_dropped": { en: "Part dropped — lighter and faster.", sv: "Del släppt — lättare och snabbare.", fr: "Partie larguée — plus léger, plus rapide.", de: "Teil abgeworfen — leichter und schneller.", es: "Parte soltada — más ligero y rápido." },

  "quest.combo_label": { en: "🔥 Combo ×{mult}", sv: "🔥 Kombo ×{mult}", fr: "🔥 Combo ×{mult}", de: "🔥 Combo ×{mult}", es: "🔥 Combo ×{mult}" },
  "quest.daily_bonus_label": { en: "🎁 Daily Bonus ×{mult}", sv: "🎁 Dagens bonus ×{mult}", fr: "🎁 Bonus du jour ×{mult}", de: "🎁 Tagesbonus ×{mult}", es: "🎁 Bono diario ×{mult}" },
  "streak.freeze_used_label": { en: "Streak Saved!", sv: "Sviten räddad!", fr: "Série sauvée !", de: "Serie gerettet!", es: "¡Racha salvada!" },
  "streak.freeze_used_desc": { en: "Missed a day, but a freeze covered you — {n}-day streak continues.", sv: "Missade en dag, men en frysning täckte dig — {n} dagars svit fortsätter.", fr: "Un jour manqué, mais un gel t'a couvert — la série de {n} jours continue.", de: "Einen Tag verpasst, aber ein Freeze hat dich gedeckt — {n}-Tage-Serie geht weiter.", es: "Te perdiste un día, pero un congelamiento te cubrió — la racha de {n} días continúa." },
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
  "mission-complete": { label: { en: "Mission Complete", sv: "Uppdrag slutfört", fr: "Mission accomplie", de: "Mission abgeschlossen", es: "Misión completa" }, desc: { en: "Finished Rocket Science — capsule reached orbit.", sv: "Klarade Raketvetenskap — kapseln nådde omloppsbana.", fr: "Terminé Science des fusées — la capsule a atteint l'orbite.", de: "Raketenwissenschaft abgeschlossen — die Kapsel erreichte die Umlaufbahn.", es: "Completaste Ciencia de cohetes — la cápsula alcanzó la órbita." } },
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

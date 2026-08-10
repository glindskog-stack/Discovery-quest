// Translations for the question bank (js/data.js) — question text, answer
// choices, and explanations, in fr/de/es/sv. English isn't repeated here;
// it's already the base value on each node in QUESTIONS. localizeQuestions()
// (called at boot and on every language switch, same pattern as
// localizeDomains()/localizeAchievements()) snapshots each node's original
// English on first run, then overwrites .q/.choices/.explain with this
// language's version if one exists here, falling back to English otherwise
// — so an untranslated node (or a language with no entry) just reads in
// English rather than breaking.
//
// source/verifiedAt/answer/topic/tier/style/domain/region/branchOnly/next/
// freeResponse/minWords are never localized — those drive matching logic,
// not display.

const QUESTIONS_I18N = {
  // ---------- math: rigorous ----------
  "m1-1": {
    fr: { q: "Combien font 12 % de 150 ?", choices: ["12", "18", "24", "30"], explain: "10 % de 150, c'est 15, et 2 % c'est 3 — donc 18 au total." },
    de: { q: "Was sind 12 % von 150?", choices: ["12", "18", "24", "30"], explain: "10 % von 150 sind 15, 2 % sind 3 — macht 18 insgesamt." },
    es: { q: "¿Cuánto es el 12 % de 150?", choices: ["12", "18", "24", "30"], explain: "El 10 % de 150 es 15, el 2 % es 3 — 18 en total." },
    sv: { q: "Vad är 12 % av 150?", choices: ["12", "18", "24", "30"], explain: "10 % av 150 är 15, 2 % är 3 — totalt 18." },
  },
  "m1-2": {
    fr: { q: "Quel gaz les plantes puisent-elles dans l'air pour fabriquer du sucre ?", choices: ["Oxygène", "Azote", "Dioxyde de carbone", "Hydrogène"], explain: "Photosynthèse : le CO2 entre, l'O2 sort." },
    de: { q: "Welches Gas ziehen Pflanzen aus der Luft, um Zucker herzustellen?", choices: ["Sauerstoff", "Stickstoff", "Kohlendioxid", "Wasserstoff"], explain: "Photosynthese: CO2 rein, O2 raus." },
    es: { q: "¿Qué gas toman las plantas del aire para fabricar azúcar?", choices: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Hidrógeno"], explain: "Fotosíntesis: entra CO2, sale O2." },
    sv: { q: "Vilken gas hämtar växter från luften för att bygga socker?", choices: ["Syre", "Kväve", "Koldioxid", "Väte"], explain: "Fotosyntes: CO2 in, O2 ut." },
  },
  "m1-3": {
    fr: { q: "À quelle température l'eau bout-elle au niveau de la mer ?", choices: ["90°C", "100°C", "110°C", "212°C"], explain: "212 est le piège en Fahrenheit." },
    de: { q: "Bei welcher Temperatur kocht Wasser auf Meereshöhe?", choices: ["90°C", "100°C", "110°C", "212°C"], explain: "212 ist die Fahrenheit-Falle." },
    es: { q: "¿A qué temperatura hierve el agua al nivel del mar?", choices: ["90°C", "100°C", "110°C", "212°C"], explain: "212 es la trampa en Fahrenheit." },
    sv: { q: "Vid vilken temperatur kokar vatten vid havsnivå?", choices: ["90°C", "100°C", "110°C", "212°C"], explain: "212 är Fahrenheit-fällan." },
  },
  "m1-4": {
    fr: { q: "Résous : 7 + 6 × 2", choices: ["26", "19", "20", "13"], explain: "Priorité des opérations : 6×2 d'abord." },
    de: { q: "Löse: 7 + 6 × 2", choices: ["26", "19", "20", "13"], explain: "Punkt-vor-Strich-Regel: zuerst 6×2." },
    es: { q: "Resuelve: 7 + 6 × 2", choices: ["26", "19", "20", "13"], explain: "Orden de operaciones: primero 6×2." },
    sv: { q: "Lös: 7 + 6 × 2", choices: ["26", "19", "20", "13"], explain: "Prioritetsregler: 6×2 först." },
  },
  "m1-5": {
    fr: { q: "Quelle planète est surnommée la Planète rouge ?", choices: ["Vénus", "Jupiter", "Mars", "Mercure"], explain: "L'oxyde de fer (rouille) dans son sol donne à Mars cette couleur rougeâtre." },
    de: { q: "Welcher Planet wird der Rote Planet genannt?", choices: ["Venus", "Jupiter", "Mars", "Merkur"], explain: "Eisenoxid (Rost) im Boden verleiht dem Mars seine rötliche Farbe." },
    es: { q: "¿Qué planeta es apodado el Planeta Rojo?", choices: ["Venus", "Júpiter", "Marte", "Mercurio"], explain: "El óxido de hierro (herrumbre) en su suelo le da a Marte ese color rojizo." },
    sv: { q: "Vilken planet kallas den röda planeten?", choices: ["Venus", "Jupiter", "Mars", "Merkurius"], explain: "Järnoxid (rost) i marken ger Mars den rödaktiga färgen." },
  },
  "m2-1": {
    fr: { q: "Résous pour x : 3x − 7 = 20", choices: ["7", "8", "9", "13"], explain: "3x = 27 → x = 9." },
    de: { q: "Löse nach x auf: 3x − 7 = 20", choices: ["7", "8", "9", "13"], explain: "3x = 27 → x = 9." },
    es: { q: "Resuelve para x: 3x − 7 = 20", choices: ["7", "8", "9", "13"], explain: "3x = 27 → x = 9." },
    sv: { q: "Lös för x: 3x − 7 = 20", choices: ["7", "8", "9", "13"], explain: "3x = 27 → x = 9." },
  },
  "m2-2": {
    fr: { q: "Quelle partie de la cellule contient son ADN ?", choices: ["Mitochondrie", "Noyau", "Ribosome", "Cytoplasme"], explain: "Le noyau est le centre de contrôle entouré d'une membrane qui contient le matériel génétique." },
    de: { q: "Welcher Teil der Zelle enthält ihre DNA?", choices: ["Mitochondrium", "Zellkern", "Ribosom", "Zytoplasma"], explain: "Der Zellkern ist die von einer Membran umgebene Kontrollzentrale, die das Erbgut enthält." },
    es: { q: "¿Qué parte de la célula contiene su ADN?", choices: ["Mitocondria", "Núcleo", "Ribosoma", "Citoplasma"], explain: "El núcleo es el centro de control de la célula, rodeado de una membrana, que contiene el material genético." },
    sv: { q: "Vilken del av cellen innehåller dess DNA?", choices: ["Mitokondrie", "Cellkärna", "Ribosom", "Cytoplasma"], explain: "Cellkärnan är cellens membranomslutna kontrollcentrum som innehåller det genetiska materialet." },
  },
  "m2-3": {
    fr: { q: "Quel est le symbole chimique du sodium ?", choices: ["So", "Sd", "Na", "S"], explain: "Vient de natrium, son nom latin." },
    de: { q: "Wie lautet das chemische Symbol für Natrium?", choices: ["So", "Sd", "Na", "S"], explain: "Von natrium, seinem lateinischen Namen." },
    es: { q: "¿Cuál es el símbolo químico del sodio?", choices: ["So", "Sd", "Na", "S"], explain: "Viene de natrium, su nombre en latín." },
    sv: { q: "Vad är den kemiska symbolen för natrium?", choices: ["So", "Sd", "Na", "S"], explain: "Från natrium, dess latinska namn." },
  },
  "m2-4": {
    fr: { q: "Un triangle rectangle a des côtés de 6 et 8. Quelle est l'hypoténuse ?", choices: ["9", "10", "12", "14"], explain: "6² + 8² = 100 = 10²." },
    de: { q: "Ein rechtwinkliges Dreieck hat die Katheten 6 und 8. Wie lang ist die Hypotenuse?", choices: ["9", "10", "12", "14"], explain: "6² + 8² = 100 = 10²." },
    es: { q: "Un triángulo rectángulo tiene catetos de 6 y 8. ¿Cuál es la hipotenusa?", choices: ["9", "10", "12", "14"], explain: "6² + 8² = 100 = 10²." },
    sv: { q: "En rätvinklig triangel har kateterna 6 och 8. Vad är hypotenusan?", choices: ["9", "10", "12", "14"], explain: "6² + 8² = 100 = 10²." },
  },
  "m2-5": {
    fr: { q: "La force est égale à la masse multipliée par quoi ?", choices: ["Vitesse", "Accélération", "Quantité de mouvement", "Déplacement"], explain: "Deuxième loi de Newton : F = ma." },
    de: { q: "Kraft ist gleich Masse mal was?", choices: ["Geschwindigkeit", "Beschleunigung", "Impuls", "Verschiebung"], explain: "Newtons zweites Gesetz: F = ma." },
    es: { q: "¿La fuerza es igual a la masa multiplicada por qué?", choices: ["Velocidad", "Aceleración", "Momento", "Desplazamiento"], explain: "Segunda ley de Newton: F = ma." },
    sv: { q: "Kraft är lika med massa gånger vad?", choices: ["Hastighet", "Acceleration", "Rörelsemängd", "Förflyttning"], explain: "Newtons andra lag: F = ma." },
  },
  "m3-1": {
    fr: { q: "Quelle est la dérivée de x³ ?", choices: ["x²", "3x", "3x²", "x³/3"], explain: "Règle de puissance : on descend l'exposant et on le diminue de 1, donc x³ → 3x²." },
    de: { q: "Was ist die Ableitung von x³?", choices: ["x²", "3x", "3x²", "x³/3"], explain: "Potenzregel: Exponent runterziehen und um eins verringern, also x³ → 3x²." },
    es: { q: "¿Cuál es la derivada de x³?", choices: ["x²", "3x", "3x²", "x³/3"], explain: "Regla de la potencia: baja el exponente y réstale uno, así x³ → 3x²." },
    sv: { q: "Vad är derivatan av x³?", choices: ["x²", "3x", "3x²", "x³/3"], explain: "Potensregeln: för ner exponenten och minska den med ett, så x³ → 3x²." },
  },
  "m3-2": {
    fr: { q: "Deux parents hétérozygotes (Aa × Aa) — quelle fraction des descendants sera aa ?", choices: ["1/4", "1/2", "3/4", "0"], explain: "Échiquier de Punnett : AA, Aa, aA, aa — 1 sur 4." },
    de: { q: "Zwei heterozygote Eltern (Aa × Aa) — welcher Anteil der Nachkommen ist aa?", choices: ["1/4", "1/2", "3/4", "0"], explain: "Punnett-Quadrat: AA, Aa, aA, aa — 1 von 4." },
    es: { q: "Dos progenitores heterocigotos (Aa × Aa) — ¿qué fracción de la descendencia es aa?", choices: ["1/4", "1/2", "3/4", "0"], explain: "Cuadro de Punnett: AA, Aa, aA, aa — 1 de cada 4." },
    sv: { q: "Två heterozygota föräldrar (Aa × Aa) — vilken andel av avkomman är aa?", choices: ["1/4", "1/2", "3/4", "0"], explain: "Punnett-ruta: AA, Aa, aA, aa — 1 av 4." },
  },
  "m3-3": {
    fr: { q: "Quel est le pH d'une solution neutre à 25 °C ?", choices: ["0", "7", "10", "14"], explain: "L'eau pure a un pH de 7 — en dessous c'est acide, au-dessus c'est basique." },
    de: { q: "Wie hoch ist der pH-Wert einer neutralen Lösung bei 25 °C?", choices: ["0", "7", "10", "14"], explain: "Reines Wasser liegt bei pH 7 — darunter sauer, darüber basisch." },
    es: { q: "¿Cuál es el pH de una solución neutra a 25 °C?", choices: ["0", "7", "10", "14"], explain: "El agua pura tiene un pH de 7 — por debajo es ácido, por encima es básico." },
    sv: { q: "Vad är pH-värdet för en neutral lösning vid 25 °C?", choices: ["0", "7", "10", "14"], explain: "Rent vatten ligger på pH 7 — under är surt, över är basiskt." },
  },
  "m3-4": {
    fr: { q: "Résous : log₂(x) = 5", choices: ["10", "16", "32", "25"], explain: "2^5 = 32." },
    de: { q: "Löse: log₂(x) = 5", choices: ["10", "16", "32", "25"], explain: "2^5 = 32." },
    es: { q: "Resuelve: log₂(x) = 5", choices: ["10", "16", "32", "25"], explain: "2^5 = 32." },
    sv: { q: "Lös: log₂(x) = 5", choices: ["10", "16", "32", "25"], explain: "2^5 = 32." },
  },
  // ---------- math: creative ----------
  "mc-1": {
    fr: { q: "Invente une nouvelle loi de la physique. Qu'est-ce qui casse, et qu'est-ce qui devient possible ?" },
    de: { q: "Erfinde ein neues physikalisches Gesetz. Was bricht dadurch, und was wird plötzlich möglich?" },
    es: { q: "Inventa una nueva ley de la física. ¿Qué se rompe y qué se vuelve posible?" },
    sv: { q: "Uppfinn en ny fysikalisk lag. Vad går sönder, och vad blir möjligt?" },
  },
  "mc-2": {
    fr: { q: "Conçois un animal capable de survivre sur une planète avec trois fois la gravité terrestre. À quoi ressemble-t-il ?" },
    de: { q: "Entwirf ein Tier, das auf einem Planeten mit dreifacher Erdschwerkraft überleben würde. Wie sieht es aus?" },
    es: { q: "Diseña un animal que pudiera sobrevivir en un planeta con el triple de la gravedad terrestre. ¿Cómo es?" },
    sv: { q: "Designa ett djur som skulle överleva på en planet med tre gånger jordens gravitation. Hur ser det ut?" },
  },
  "mc-3": {
    fr: { q: "Tu dois nommer une exoplanète nouvellement découverte. Quel est son nom, et en une phrase, pourquoi les humains devraient-ils la visiter ?" },
    de: { q: "Du darfst einen neu entdeckten Exoplaneten benennen. Wie heißt er, und was ist der Einzeiler, warum Menschen ihn besuchen sollten?" },
    es: { q: "Tienes que nombrar un exoplaneta recién descubierto. ¿Cuál es el nombre y la frase de venta de por qué los humanos deberían visitarlo?" },
    sv: { q: "Du får namnge en nyupptäckt exoplanet. Vad heter den, och vad är enradaren för varför människor borde besöka den?" },
  },
  "mc-4": {
    fr: { q: "Explique pourquoi le ciel est bleu à quelqu'un qui n'a jamais suivi de cours de sciences — aucun jargon autorisé." },
    de: { q: "Erkläre jemandem, der noch nie Naturwissenschaften hatte, warum der Himmel blau ist — kein Fachjargon erlaubt." },
    es: { q: "Explícale a alguien que nunca ha tenido una clase de ciencias por qué el cielo es azul — nada de jerga técnica." },
    sv: { q: "Förklara varför himlen är blå för någon som aldrig haft en naturvetenskapslektion — inget fikonspråk tillåtet." },
  },

  // ---------- coding: rigorous ----------
  "c1-1": {
    fr: { q: "Dans la plupart des langages, que fait `%` entre deux entiers ?", choices: ["Les divise", "Les multiplie", "Donne le reste", "Les arrondit"], explain: "L'opérateur modulo renvoie ce qui reste après la division." },
    de: { q: "Was macht `%` in den meisten Sprachen zwischen zwei Ganzzahlen?", choices: ["Dividiert sie", "Multipliziert sie", "Gibt den Rest zurück", "Rundet sie"], explain: "Der Modulo-Operator gibt den Rest nach der Division zurück." },
    es: { q: "En la mayoría de los lenguajes, ¿qué hace `%` entre dos enteros?", choices: ["Los divide", "Los multiplica", "Da el resto", "Los redondea"], explain: "El operador módulo devuelve lo que sobra tras la división." },
    sv: { q: "Vad gör `%` mellan två heltal i de flesta språk?", choices: ["Dividerar dem", "Multiplicerar dem", "Ger resten", "Avrundar dem"], explain: "Modulo-operatorn returnerar det som blir över efter division." },
  },
  "c1-2": {
    fr: { q: "Qu'affiche `console.log(2 + '2')` ?", choices: ["4", "'22'", "NaN", "Error"], explain: "Le nombre est converti en chaîne ; + concatène." },
    de: { q: "Was gibt `console.log(2 + '2')` aus?", choices: ["4", "'22'", "NaN", "Error"], explain: "Die Zahl wird in einen String umgewandelt; + verkettet." },
    es: { q: "¿Qué imprime `console.log(2 + '2')`?", choices: ["4", "'22'", "NaN", "Error"], explain: "El número se convierte en cadena de texto; + concatena." },
    sv: { q: "Vad skriver `console.log(2 + '2')` ut?", choices: ["4", "'22'", "NaN", "Error"], explain: "Talet omvandlas till en sträng; + sätter ihop dem." },
  },
  "c1-3": {
    fr: { q: "Quel symbole démarre un commentaire en Python ?", choices: ["//", "#", "<!--", "/*"], explain: "Tout ce qui suit # sur une ligne est ignoré par l'interpréteur." },
    de: { q: "Welches Symbol beginnt einen Kommentar in Python?", choices: ["//", "#", "<!--", "/*"], explain: "Alles nach # in einer Zeile wird vom Interpreter ignoriert." },
    es: { q: "¿Qué símbolo inicia un comentario en Python?", choices: ["//", "#", "<!--", "/*"], explain: "Todo lo que sigue a # en una línea es ignorado por el intérprete." },
    sv: { q: "Vilket tecken startar en kommentar i Python?", choices: ["//", "#", "<!--", "/*"], explain: "Allt efter # på en rad ignoreras av tolken." },
  },
  "c1-4": {
    fr: { q: "Quelle structure fonctionne en Dernier Entré, Premier Sorti ?", choices: ["File", "Pile", "Tableau", "Arbre"], explain: "Pense à une pile d'assiettes — la dernière posée est la première reprise." },
    de: { q: "Welche Struktur ist Last-In-First-Out?", choices: ["Warteschlange", "Stapel", "Array", "Baum"], explain: "Denk an einen Tellerstapel — der zuletzt aufgelegte wird als Erster wieder abgenommen." },
    es: { q: "¿Qué estructura es Última en Entrar, Primera en Salir?", choices: ["Cola", "Pila", "Array", "Árbol"], explain: "Piensa en una pila de platos — el último que pones es el primero que quitas." },
    sv: { q: "Vilken struktur är Sist-In-Först-Ut?", choices: ["Kö", "Stack", "Array", "Träd"], explain: "Tänk på en trave tallrikar — den sist pålagda är den första du tar av." },
  },
  "c1-5": {
    fr: { q: "Que signifie l'acronyme HTML ?", explain: "C'est le langage de balisage qui structure presque toutes les pages web." },
    de: { q: "Wofür steht HTML?", explain: "Es ist die Auszeichnungssprache, die fast jede Webseite strukturiert." },
    es: { q: "¿Qué significa HTML?", explain: "Es el lenguaje de marcado que estructura casi todas las páginas web." },
    sv: { q: "Vad står HTML för?", explain: "Det är märkspråket som strukturerar nästan alla webbsidor." },
  },
  "c2-1": {
    fr: { q: "Complexité temporelle d'une recherche binaire sur n éléments triés ?", choices: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], explain: "Chaque comparaison divise par deux l'espace de recherche restant." },
    de: { q: "Zeitkomplexität der binären Suche bei n sortierten Elementen?", choices: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], explain: "Jeder Vergleich halbiert den verbleibenden Suchraum." },
    es: { q: "¿Complejidad temporal de una búsqueda binaria sobre n elementos ordenados?", choices: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], explain: "Cada comparación reduce a la mitad el espacio de búsqueda restante." },
    sv: { q: "Tidskomplexitet för binärsökning på n sorterade element?", choices: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], explain: "Varje jämförelse halverar det återstående sökutrymmet." },
  },
  "c2-2": {
    fr: { q: "Quelle est la bonne façon de tester l'égalité en Python ?", choices: ["x = 5", "x == 5", "x === 5", "x eq 5"], explain: "Un seul = assigne une valeur ; == compare deux valeurs." },
    de: { q: "Welche ist die korrekte Gleichheitsprüfung in Python?", choices: ["x = 5", "x == 5", "x === 5", "x eq 5"], explain: "Ein einzelnes = weist einen Wert zu; == vergleicht zwei Werte." },
    es: { q: "¿Cuál es la comprobación de igualdad correcta en Python?", choices: ["x = 5", "x == 5", "x === 5", "x eq 5"], explain: "Un solo = asigna un valor; == compara dos valores." },
    sv: { q: "Vilket är det korrekta likhetstestet i Python?", choices: ["x = 5", "x == 5", "x === 5", "x eq 5"], explain: "Ett enkelt = tilldelar ett värde; == jämför två värden." },
  },
  "c2-3": {
    fr: { q: "Quelle commande Git crée une nouvelle branche et y bascule en une seule fois ?", choices: ["git branch -m", "git switch", "git checkout -b", "git merge"], explain: "Le drapeau -b indique à checkout de créer la branche avant d'y basculer." },
    de: { q: "Welcher Git-Befehl erstellt einen neuen Branch und wechselt in einem Schritt zu ihm?", choices: ["git branch -m", "git switch", "git checkout -b", "git merge"], explain: "Das Flag -b weist checkout an, den Branch zu erstellen, bevor dorthin gewechselt wird." },
    es: { q: "¿Qué comando de Git crea una nueva rama y cambia a ella de una sola vez?", choices: ["git branch -m", "git switch", "git checkout -b", "git merge"], explain: "La opción -b le indica a checkout que cree la rama antes de cambiar a ella." },
    sv: { q: "Vilket Git-kommando skapar en ny gren och växlar till den i ett steg?", choices: ["git branch -m", "git switch", "git checkout -b", "git merge"], explain: "Flaggan -b säger åt checkout att skapa grenen innan den växlar till den." },
  },
  "c2-4": {
    fr: { q: "Une variable visible uniquement à l'intérieur de la fonction qui l'a déclarée est dite...", choices: ["Globale", "Locale", "Constante", "Statique"], explain: "Une variable locale n'existe que dans la portée de la fonction qui l'a créée." },
    de: { q: "Eine Variable, die nur innerhalb der Funktion sichtbar ist, die sie deklariert hat, nennt man...", choices: ["Global", "Lokal", "Konstante", "Statisch"], explain: "Eine lokale Variable existiert nur innerhalb des Gültigkeitsbereichs der Funktion, die sie erzeugt hat." },
    es: { q: "Una variable visible solo dentro de la función que la declaró se llama...", choices: ["Global", "Local", "Constante", "Estática"], explain: "Una variable local solo existe dentro del ámbito de la función que la creó." },
    sv: { q: "En variabel som bara syns inuti funktionen som deklarerade den kallas...", choices: ["Global", "Lokal", "Konstant", "Statisk"], explain: "En lokal variabel existerar bara inom skopet för funktionen som skapade den." },
  },
  "c2-5": {
    fr: { q: "Qu'est-ce qu'une API permet principalement à deux programmes de faire ?", choices: ["Partager un écran", "Communiquer entre eux", "Compiler du code", "Stocker des fichiers"], explain: "Une API définit les règles que deux programmes utilisent pour échanger des données." },
    de: { q: "Was ermöglicht eine API zwei Programmen in erster Linie?", choices: ["Einen Bildschirm teilen", "Miteinander kommunizieren", "Code kompilieren", "Dateien speichern"], explain: "Eine API definiert die Regeln, nach denen zwei Programme Daten austauschen." },
    es: { q: "¿Qué permite principalmente una API a dos programas?", choices: ["Compartir una pantalla", "Comunicarse entre sí", "Compilar código", "Almacenar archivos"], explain: "Una API define las reglas que usan dos programas para intercambiar datos." },
    sv: { q: "Vad låter en API primärt två program göra?", choices: ["Dela en skärm", "Prata med varandra", "Kompilera kod", "Lagra filer"], explain: "Ett API definierar reglerna två program använder för att utbyta data." },
  },
  "c3-1": {
    fr: { q: "Résultat de `[1,2,3].map(x => x * 2).filter(x => x > 2)` ?", choices: ["[2,4,6]", "[4,6]", "[2,3]", "[1,2,3]"], explain: "Doubler donne [2,4,6], puis filtrer pour > 2 fait tomber le 2." },
    de: { q: "Ausgabe von `[1,2,3].map(x => x * 2).filter(x => x > 2)`?", choices: ["[2,4,6]", "[4,6]", "[2,3]", "[1,2,3]"], explain: "Verdoppeln ergibt [2,4,6], das Filtern nach > 2 entfernt dann die 2." },
    es: { q: "¿Resultado de `[1,2,3].map(x => x * 2).filter(x => x > 2)`?", choices: ["[2,4,6]", "[4,6]", "[2,3]", "[1,2,3]"], explain: "Duplicar da [2,4,6], y filtrar por > 2 elimina el 2." },
    sv: { q: "Resultatet av `[1,2,3].map(x => x * 2).filter(x => x > 2)`?", choices: ["[2,4,6]", "[4,6]", "[2,3]", "[1,2,3]"], explain: "Dubblering ger [2,4,6], och filtret > 2 tar sedan bort 2:an." },
  },
  "c3-2": {
    fr: { q: "Meilleure complexité en moyenne : tri à bulles ou tri rapide ?", choices: ["Tri à bulles", "Tri rapide", "Égal", "Aucun ne trie"], explain: "Le tri rapide tourne en moyenne à O(n log n) contre O(n²) pour le tri à bulles." },
    de: { q: "Bessere durchschnittliche Zeitkomplexität: Bubble Sort oder Quicksort?", choices: ["Bubble Sort", "Quicksort", "Gleich", "Keins sortiert"], explain: "Quicksort liegt im Schnitt bei O(n log n), Bubble Sort bei O(n²)." },
    es: { q: "¿Mejor complejidad temporal media: bubble sort o quicksort?", choices: ["Bubble sort", "Quicksort", "Igual", "Ninguno ordena"], explain: "Quicksort promedia O(n log n) frente a O(n²) de bubble sort." },
    sv: { q: "Bättre genomsnittlig tidskomplexitet: bubbelsortering eller quicksort?", choices: ["Bubbelsortering", "Quicksort", "Lika", "Ingen sorterar"], explain: "Quicksort ligger i snitt på O(n log n) mot bubbelsorteringens O(n²)." },
  },
  "c3-3": {
    fr: { q: "De quoi la récursivité a-t-elle besoin pour ne pas tourner indéfiniment ?", choices: ["Une boucle", "Un cas de base", "Une variable globale", "Une classe"], explain: "Sans cas de base, une fonction récursive ne s'arrête jamais de s'appeler elle-même." },
    de: { q: "Was braucht Rekursion, um nicht endlos zu laufen?", choices: ["Eine Schleife", "Einen Basisfall", "Eine globale Variable", "Eine Klasse"], explain: "Ohne Basisfall hört eine rekursive Funktion nie auf, sich selbst aufzurufen." },
    es: { q: "¿Qué necesita la recursividad para no ejecutarse eternamente?", choices: ["Un bucle", "Un caso base", "Una variable global", "Una clase"], explain: "Sin un caso base, una función recursiva nunca deja de llamarse a sí misma." },
    sv: { q: "Vad behöver rekursion för att inte köra för evigt?", choices: ["En loop", "Ett basfall", "En global variabel", "En klass"], explain: "Utan ett basfall slutar en rekursiv funktion aldrig anropa sig själv." },
  },
  "c3-4": {
    fr: { q: "Dans une table de hachage, qu'est-ce qui provoque une « collision » ?", choices: ["Deux clés qui se hachent vers le même emplacement", "Manquer de mémoire", "Une erreur de syntaxe", "Supprimer une clé absente"], explain: "Une collision se produit quand la fonction de hachage fait correspondre deux clés différentes au même compartiment." },
    de: { q: "Was verursacht in einer Hashmap eine „Kollision“?", choices: ["Zwei Schlüssel hashen zum selben Slot", "Speicher geht aus", "Ein Syntaxfehler", "Löschen eines fehlenden Schlüssels"], explain: "Eine Kollision entsteht, wenn die Hashfunktion zwei verschiedene Schlüssel demselben Bucket zuordnet." },
    es: { q: "En un mapa hash, ¿qué causa una «colisión»?", choices: ["Dos claves que se asignan a la misma posición", "Quedarse sin memoria", "Un error de sintaxis", "Eliminar una clave inexistente"], explain: "Una colisión ocurre cuando la función hash asigna dos claves distintas al mismo cubo." },
    sv: { q: "Vad orsakar en \"kollision\" i en hashmap?", choices: ["Två nycklar hashar till samma plats", "Slut på minne", "Ett syntaxfel", "Radera en nyckel som saknas"], explain: "En kollision uppstår när hashfunktionen mappar två olika nycklar till samma hink." },
  },
  // ---------- coding: creative ----------
  "cc-1": {
    fr: { q: "Décris, en langage clair, comment tu trouverais un bug qui ne se produit que « parfois ». Pas de code — juste ta démarche." },
    de: { q: "Beschreibe in einfachen Worten, wie du einen Bug finden würdest, der nur „manchmal“ auftritt. Kein Code — nur dein Vorgehen." },
    es: { q: "Describe, en lenguaje sencillo, cómo encontrarías un error que ocurre solo «a veces». Nada de código — solo tu enfoque." },
    sv: { q: "Beskriv, i vanligt språk, hur du skulle hitta en bugg som bara händer \"ibland\". Ingen kod — bara ditt angreppssätt." },
  },
  "cc-2": {
    fr: { q: "Esquisse la logique (le pseudocode convient) d'une appli qui te rappelle de répondre à quelqu'un après 3 jours de silence." },
    de: { q: "Skizziere die Logik (Pseudocode reicht) für eine App, die dich daran erinnert, jemandem nach 3 Tagen Funkstille zurückzuschreiben." },
    es: { q: "Esboza la lógica (vale con pseudocódigo) de una app que te recuerde responder a alguien tras 3 días de silencio." },
    sv: { q: "Skissa logiken (pseudokod duger) för en app som påminner dig att svara någon efter 3 dagars tystnad." },
  },
  "cc-3": {
    fr: { q: "Explique comment tu trierais un jeu de cartes à la main, puis dis quel algorithme de tri réel cela évoque." },
    de: { q: "Erkläre, wie du ein Kartenspiel von Hand sortieren würdest, und sag dann, welchem echten Sortieralgorithmus das ähnelt." },
    es: { q: "Explica cómo ordenarías una baraja de cartas a mano, y luego di a qué algoritmo de ordenación real se parece." },
    sv: { q: "Förklara hur du skulle sortera en kortlek för hand, och säg sedan vilken riktig sorteringsalgoritm det liknar." },
  },
  "cc-4": {
    fr: { q: "Tu construis une appli pour un truc qui t'énerve dans la vraie vie. Que fait-elle, et quelle est la fonctionnalité qui compte vraiment ?" },
    de: { q: "Du baust eine App für etwas, das dich im echten Leben nervt. Was macht sie, und was ist das eine Feature, das wirklich zählt?" },
    es: { q: "Estás creando una app para algo que te molesta en la vida real. ¿Qué hace y cuál es la única función que realmente importa?" },
    sv: { q: "Du bygger en app för något som irriterar dig IRL. Vad gör den, och vilken är den enda funktionen som spelar roll?" },
  },

  // ---------- trivia: rigorous ----------
  "t1-1": {
    fr: { q: "Dans quel pays se trouve la tour Eiffel ?", choices: ["Italie", "France", "Espagne", "Allemagne"], explain: "Elle se dresse à Paris depuis 1889." },
    de: { q: "In welchem Land steht der Eiffelturm?", choices: ["Italien", "Frankreich", "Spanien", "Deutschland"], explain: "Er steht seit 1889 in Paris." },
    es: { q: "¿En qué país está la Torre Eiffel?", choices: ["Italia", "Francia", "España", "Alemania"], explain: "Se alza en París desde 1889." },
    sv: { q: "I vilket land finns Eiffeltornet?", choices: ["Italien", "Frankrike", "Spanien", "Tyskland"], explain: "Det har stått i Paris sedan 1889." },
  },
  "t1-2": {
    fr: { q: "Quel est le plus grand océan de la Terre ?", choices: ["Atlantique", "Indien", "Arctique", "Pacifique"], explain: "Le Pacifique couvre plus de surface que tous les continents réunis." },
    de: { q: "Welches ist der größte Ozean der Erde?", choices: ["Atlantik", "Indischer Ozean", "Arktischer Ozean", "Pazifik"], explain: "Der Pazifik bedeckt mehr Fläche als alle Kontinente zusammen." },
    es: { q: "¿Cuál es el océano más grande de la Tierra?", choices: ["Atlántico", "Índico", "Ártico", "Pacífico"], explain: "El Pacífico cubre más superficie que todos los continentes juntos." },
    sv: { q: "Vilket är jordens största hav?", choices: ["Atlanten", "Indiska oceanen", "Norra ishavet", "Stilla havet"], explain: "Stilla havet täcker mer yta än alla kontinenter tillsammans." },
  },
  "t1-3": {
    fr: { q: "Quel instrument possède 88 touches ?", choices: ["Guitare", "Piano", "Violon", "Batterie"], explain: "52 touches blanches et 36 touches noires font 88 au total." },
    de: { q: "Welches Instrument hat 88 Tasten?", choices: ["Gitarre", "Klavier", "Geige", "Schlagzeug"], explain: "52 weiße und 36 schwarze Tasten ergeben 88 insgesamt." },
    es: { q: "¿Qué instrumento tiene 88 teclas?", choices: ["Guitarra", "Piano", "Violín", "Batería"], explain: "52 teclas blancas y 36 negras suman 88 en total." },
    sv: { q: "Vilket instrument har 88 tangenter?", choices: ["Gitarr", "Piano", "Fiol", "Trumset"], explain: "52 vita tangenter och 36 svarta blir 88 totalt." },
  },
  "t1-4": {
    fr: { q: "Quelle est la monnaie du Japon ?", explain: "Le yen est la monnaie du Japon depuis 1871." },
    de: { q: "Was ist die Währung Japans?", explain: "Der Yen ist seit 1871 die Währung Japans." },
    es: { q: "¿Cuál es la moneda de Japón?", explain: "El yen es la moneda de Japón desde 1871." },
    sv: { q: "Vad är Japans valuta?", explain: "Yen har varit Japans valuta sedan 1871." },
  },
  "t1-5": {
    fr: { q: "L'ancien logo de Twitter était un petit quoi bleu ?", choices: ["Hibou", "Oiseau", "Poisson", "Abeille"], explain: "Cet oiseau, surnommé Larry, était le logo de Twitter avant que le site ne devienne X." },
    de: { q: "Das alte Twitter-Logo war ein kleines blaues Was?", choices: ["Eule", "Vogel", "Fisch", "Biene"], explain: "Dieser Vogel, genannt Larry, war das Twitter-Logo, bevor die Seite zu X wurde." },
    es: { q: "¿Qué era, en pequeño y azul, el antiguo logo de Twitter?", choices: ["Búho", "Pájaro", "Pez", "Abeja"], explain: "Ese pájaro, apodado Larry, fue el logo de Twitter antes de que el sitio se convirtiera en X." },
    sv: { q: "Twitters gamla logga var en liten blå vad?", choices: ["Uggla", "Fågel", "Fisk", "Bi"], explain: "Den fågeln, kallad Larry, var Twitters logga innan sajten blev X." },
  },
  "t2-1": {
    fr: { q: "Qui a peint la Joconde ?", choices: ["Michel-Ange", "Léonard de Vinci", "Raphaël", "Donatello"], explain: "Da Vinci l'a peinte au début des années 1500 ; elle est aujourd'hui exposée au Louvre." },
    de: { q: "Wer hat die Mona Lisa gemalt?", choices: ["Michelangelo", "Leonardo da Vinci", "Raffael", "Donatello"], explain: "Da Vinci malte sie Anfang der 1500er Jahre; heute hängt sie im Louvre." },
    es: { q: "¿Quién pintó la Mona Lisa?", choices: ["Miguel Ángel", "Leonardo da Vinci", "Rafael", "Donatello"], explain: "Da Vinci la pintó a principios del siglo XVI; hoy cuelga en el Louvre." },
    sv: { q: "Vem målade Mona Lisa?", choices: ["Michelangelo", "Leonardo da Vinci", "Rafael", "Donatello"], explain: "Da Vinci målade den i början av 1500-talet; den hänger nu på Louvren." },
  },
  "t2-2": {
    fr: { q: "Quel pays a accueilli les Jeux olympiques d'été de 2016 ?", choices: ["Chine", "Royaume-Uni", "Brésil", "Japon"], explain: "Rio de Janeiro a accueilli les Jeux d'été de 2016." },
    de: { q: "Welches Land war Gastgeber der Olympischen Sommerspiele 2016?", choices: ["China", "Vereinigtes Königreich", "Brasilien", "Japan"], explain: "Rio de Janeiro war Gastgeber der Sommerspiele 2016." },
    es: { q: "¿Qué país fue anfitrión de los Juegos Olímpicos de verano de 2016?", choices: ["China", "Reino Unido", "Brasil", "Japón"], explain: "Río de Janeiro fue la sede de los Juegos de verano de 2016." },
    sv: { q: "Vilket land var värd för sommar-OS 2016?", choices: ["Kina", "Storbritannien", "Brasilien", "Japan"], explain: "Rio de Janeiro var värd för sommarspelen 2016." },
  },
  "t2-3": {
    fr: { q: "Le plus petit pays du monde en superficie ?", choices: ["Monaco", "Vatican", "Saint-Marin", "Liechtenstein"], explain: "Avec environ 0,44 km², il est plus petit que la plupart des parcs urbains." },
    de: { q: "Das flächenmäßig kleinste Land der Welt?", choices: ["Monaco", "Vatikanstadt", "San Marino", "Liechtenstein"], explain: "Mit etwa 0,44 km² ist es kleiner als die meisten Stadtparks." },
    es: { q: "¿El país más pequeño del mundo por superficie?", choices: ["Mónaco", "Ciudad del Vaticano", "San Marino", "Liechtenstein"], explain: "Con unos 0,44 km², es más pequeño que la mayoría de los parques urbanos." },
    sv: { q: "Världens minsta land till ytan?", choices: ["Monaco", "Vatikanstaten", "San Marino", "Liechtenstein"], explain: "Med cirka 0,44 km² är det mindre än de flesta stadsparker." },
  },
  "t2-4": {
    fr: { q: "Dans la mythologie grecque, qui règne sur la mer ?", choices: ["Zeus", "Apollon", "Poséidon", "Hadès"], explain: "Poséidon était aussi le dieu des tremblements de terre et des chevaux dans la mythologie grecque." },
    de: { q: "Wer herrscht in der griechischen Mythologie über das Meer?", choices: ["Zeus", "Apollon", "Poseidon", "Hades"], explain: "Poseidon war in der griechischen Mythologie auch der Gott der Erdbeben und der Pferde." },
    es: { q: "En la mitología griega, ¿quién gobierna el mar?", choices: ["Zeus", "Apolo", "Poseidón", "Hades"], explain: "Poseidón también era el dios de los terremotos y los caballos en la mitología griega." },
    sv: { q: "Vem styr havet i grekisk mytologi?", choices: ["Zeus", "Apollon", "Poseidon", "Hades"], explain: "Poseidon var även gud över jordbävningar och hästar i grekisk mytologi." },
  },
  "t2-5": {
    fr: { q: "En quelle année le mur de Berlin est-il tombé ?", choices: ["1987", "1989", "1991", "1993"], explain: "Il est tombé le 9 novembre 1989, quand l'Allemagne de l'Est a ouvert ses frontières." },
    de: { q: "In welchem Jahr fiel die Berliner Mauer?", choices: ["1987", "1989", "1991", "1993"], explain: "Sie fiel am 9. November 1989, als die DDR ihre Grenzen öffnete." },
    es: { q: "¿En qué año cayó el Muro de Berlín?", choices: ["1987", "1989", "1991", "1993"], explain: "Cayó el 9 de noviembre de 1989, cuando Alemania Oriental abrió sus fronteras." },
    sv: { q: "Vilket år föll Berlinmuren?", choices: ["1987", "1989", "1991", "1993"], explain: "Den föll den 9 november 1989, när Östtyskland öppnade sina gränser." },
  },
  "t3-1": {
    fr: { q: "Quelle merveille du monde antique se dressait à Alexandrie, en Égypte ?", choices: ["Jardins suspendus", "Colosse de Rhodes", "Le phare (Pharos)", "Temple d'Artémis"], explain: "Il a guidé les navires vers le port d'Alexandrie pendant plus de mille ans." },
    de: { q: "Welches Weltwunder der Antike stand in Alexandria, Ägypten?", choices: ["Hängende Gärten", "Koloss von Rhodos", "Der Leuchtturm (Pharos)", "Artemistempel"], explain: "Er leitete über tausend Jahre lang Schiffe in den Hafen von Alexandria." },
    es: { q: "¿Qué maravilla del mundo antiguo se alzaba en Alejandría, Egipto?", choices: ["Jardines colgantes", "Coloso de Rodas", "El faro (Faros)", "Templo de Artemisa"], explain: "Guio a los barcos hacia el puerto de Alejandría durante más de mil años." },
    sv: { q: "Vilket av forntidens underverk stod i Alexandria, Egypten?", choices: ["Hängande trädgårdarna", "Kolossen på Rhodos", "Fyren (Pharos)", "Artemistemplet"], explain: "Den vägledde fartyg in i Alexandrias hamn i över tusen år." },
  },
  "t3-2": {
    fr: { q: "Qui a été la première personne à marcher sur la Lune ?", explain: "Il a posé le pied sur la Lune le 20 juillet 1969, lors de la mission Apollo 11." },
    de: { q: "Wer war der erste Mensch, der auf dem Mond ging?", explain: "Er betrat den Mond am 20. Juli 1969 im Rahmen der Apollo-11-Mission." },
    es: { q: "¿Quién fue la primera persona en caminar sobre la Luna?", explain: "Pisó la Luna el 20 de julio de 1969, durante la misión Apolo 11." },
    sv: { q: "Vem var den första personen att gå på månen?", explain: "Han klev ut på månen den 20 juli 1969, under Apollo 11-uppdraget." },
  },
  "t3-3": {
    fr: { q: "Quel empire Gengis Khan a-t-il gouverné ?", choices: ["Empire ottoman", "Empire mongol", "Empire romain", "Empire perse"], explain: "Gengis Khan l'a fondé en 1206 ; il est devenu le plus grand empire terrestre continu de l'histoire." },
    de: { q: "Welches Reich beherrschte Dschingis Khan?", choices: ["Osmanisches Reich", "Mongolisches Reich", "Römisches Reich", "Persisches Reich"], explain: "Dschingis Khan gründete es 1206; es wuchs zum größten zusammenhängenden Landreich der Geschichte heran." },
    es: { q: "¿Qué imperio gobernó Gengis Kan?", choices: ["Imperio otomano", "Imperio mongol", "Imperio romano", "Imperio persa"], explain: "Gengis Kan lo fundó en 1206; llegó a ser el mayor imperio terrestre contiguo de la historia." },
    sv: { q: "Vilket imperium styrde Djingis khan?", choices: ["Osmanska riket", "Mongoliska riket", "Romerska riket", "Persiska riket"], explain: "Djingis khan grundade det 1206; det växte till det största sammanhängande landimperiet i historien." },
  },
  "t3-4": {
    fr: { q: "Quel pays africain n'a jamais été colonisé par une puissance européenne ?", choices: ["Kenya", "Éthiopie", "Nigeria", "Ghana"], explain: "L'Éthiopie a repoussé les tentatives de colonisation italiennes, notamment lors de la bataille d'Adoua en 1896." },
    de: { q: "Welches afrikanische Land wurde nie von einer europäischen Macht kolonisiert?", choices: ["Kenia", "Äthiopien", "Nigeria", "Ghana"], explain: "Äthiopien wehrte italienische Kolonisierungsversuche ab, vor allem in der Schlacht von Adua 1896." },
    es: { q: "¿Qué país africano nunca fue colonizado por una potencia europea?", choices: ["Kenia", "Etiopía", "Nigeria", "Ghana"], explain: "Etiopía repelió los intentos de colonización italianos, sobre todo en la batalla de Adwa en 1896." },
    sv: { q: "Vilket afrikanskt land koloniserades aldrig av en europeisk makt?", choices: ["Kenya", "Etiopien", "Nigeria", "Ghana"], explain: "Etiopien slog tillbaka italienska koloniseringsförsök, mest känt vid slaget vid Adwa 1896." },
  },
  // ---------- trivia: creative ----------
  "tc-1": {
    fr: { q: "Choisis une époque historique où voyager dans le temps pour exactement une journée. Que fais-tu en premier ?" },
    de: { q: "Wähle eine historische Epoche, in die du für genau einen Tag reisen würdest. Was tust du zuerst?" },
    es: { q: "Elige una época histórica para viajar en el tiempo durante exactamente un día. ¿Qué haces primero?" },
    sv: { q: "Välj en historisk epok att tidsresa till i exakt en dag. Vad gör du först?" },
  },
  "tc-2": {
    fr: { q: "Présente une théorie du complot tellement délirante qu'elle en devient presque géniale." },
    de: { q: "Präsentiere eine Verschwörungstheorie, die so abgedreht ist, dass sie fast wieder genial wirkt." },
    es: { q: "Propón una teoría de la conspiración tan disparatada que acaba pareciendo casi genial." },
    sv: { q: "Presentera en konspirationsteori så galen att den nästan blir genial igen." },
  },
  "tc-3": {
    fr: { q: "Conçois un nouveau pays de zéro : drapeau, une loi, une fête nationale. Vas-y." },
    de: { q: "Entwirf ein neues Land von Grund auf: Flagge, ein Gesetz, ein Nationalfeiertag. Los geht's." },
    es: { q: "Diseña un país nuevo desde cero: bandera, una ley, una fiesta nacional. Adelante." },
    sv: { q: "Designa ett nytt land från grunden: flagga, en lag, en nationaldag. Kör." },
  },
  "tc-4": {
    fr: { q: "Invente un dieu mineur pour quelque chose de très spécifique et moderne (par ex. « dieu des batteries de téléphone mortes »). Que contrôle-t-il ?" },
    de: { q: "Erfinde einen kleinen Gott für etwas extrem Spezifisches und Modernes (z. B. „Gott der leeren Handyakkus“). Was kontrolliert er?" },
    es: { q: "Inventa un dios menor para algo muy específico y moderno (p. ej. «dios de las baterías de móvil muertas»). ¿Qué controla?" },
    sv: { q: "Uppfinn en mindre gud för något extremt specifikt och modernt (t.ex. \"gud över döda telefonbatterier\"). Vad styr den över?" },
  },

  // ---------- writing ----------
  "w-start": {
    fr: { q: "Choisis une phrase d'ouverture pour construire une histoire :", choices: ["« Le dernier e-mail est arrivé à 3h12 du matin. »", "« Personne ne croyait que la porte avait toujours été là. »", "« Elle gardait le gant de l'astronaute dans son casier. »", "« Quand le courant est revenu, la ville avait voté quelque chose. »"] },
    de: { q: "Wähle eine Eröffnungszeile, um darauf eine Geschichte aufzubauen:", choices: ["„Die letzte E-Mail kam um 3:12 Uhr morgens an.“", "„Niemand glaubte, dass die Tür schon immer da gewesen war.“", "„Sie bewahrte den Handschuh des Astronauten in ihrem Spind auf.“", "„Als der Strom wieder da war, hatte die Stadt über etwas abgestimmt.“"] },
    es: { q: "Elige una línea de apertura para construir una historia:", choices: ["«El último correo llegó a las 3:12 de la madrugada.»", "«Nadie creía que la puerta siempre hubiera estado ahí.»", "«Guardaba el guante del astronauta en su taquilla.»", "«Cuando volvió la luz, el pueblo había votado algo.»"] },
    sv: { q: "Välj en inledningsmening att bygga en berättelse från:", choices: ["\"Det sista mejlet kom klockan 3:12 på natten.\"", "\"Ingen trodde att dörren alltid hade funnits där.\"", "\"Hon förvarade astronautens handske i sitt skåp.\"", "\"När strömmen kom tillbaka hade staden röstat om något.\""] },
  },
  "w-mystery": {
    fr: { q: "Continue en 2-3 phrases : qui a envoyé l'e-mail, et pourquoi est-ce important ?" },
    de: { q: "Führe es in 2-3 Sätzen fort: Wer hat die E-Mail geschickt, und warum ist das wichtig?" },
    es: { q: "Continúa en 2-3 frases: ¿quién envió el correo, y por qué importa?" },
    sv: { q: "Fortsätt i 2-3 meningar: vem skickade mejlet, och varför spelar det roll?" },
  },
  "w-fantasy": {
    fr: { q: "Continue en 2-3 phrases : qu'y a-t-il de l'autre côté de la porte ?" },
    de: { q: "Führe es in 2-3 Sätzen fort: Was ist auf der anderen Seite der Tür?" },
    es: { q: "Continúa en 2-3 frases: ¿qué hay al otro lado de la puerta?" },
    sv: { q: "Fortsätt i 2-3 meningar: vad finns på andra sidan dörren?" },
  },
  "w-scifi": {
    fr: { q: "Continue en 2-3 phrases : à qui était ce gant, et comment l'a-t-elle obtenu ?" },
    de: { q: "Führe es in 2-3 Sätzen fort: Wessen Handschuh war das, und wie kam sie daran?" },
    es: { q: "Continúa en 2-3 frases: ¿de quién era el guante, y cómo lo consiguió ella?" },
    sv: { q: "Fortsätt i 2-3 meningar: vems handske var det, och hur fick hon tag i den?" },
  },
  "w-dystopia": {
    fr: { q: "Continue en 2-3 phrases : sur quoi la ville a-t-elle voté, et qui n'est pas content ?" },
    de: { q: "Führe es in 2-3 Sätzen fort: Worüber hat die Stadt abgestimmt, und wer ist damit nicht glücklich?" },
    es: { q: "Continúa en 2-3 frases: ¿sobre qué votó el pueblo, y a quién no le hace gracia?" },
    sv: { q: "Fortsätt i 2-3 meningar: vad röstade staden om, och vem är inte glad över det?" },
  },
  "w-mystery-2": {
    fr: { q: "Moment de rebondissement : révèle un détail qui pousse le lecteur à se méfier du narrateur." },
    de: { q: "Zeit für die Wendung: Enthülle ein Detail, das den Leser dem Erzähler misstrauen lässt." },
    es: { q: "Hora del giro: revela un detalle que haga que el lector desconfíe del narrador." },
    sv: { q: "Dags för en twist: avslöja en detalj som gör att läsaren misstror berättaren." },
  },
  "w-fantasy-2": {
    fr: { q: "Moment de rebondissement : la porte mène quelque part qui ne devrait pas exister. Décris-le en utilisant un sens inattendu (odorat, ouïe, toucher)." },
    de: { q: "Zeit für die Wendung: Die Tür führt an einen Ort, der nicht existieren sollte. Beschreibe ihn mit einem unerwarteten Sinn (Geruch, Klang, Tastsinn)." },
    es: { q: "Hora del giro: la puerta lleva a un lugar que no debería existir. Descríbelo usando un sentido inesperado (olfato, oído, tacto)." },
    sv: { q: "Dags för en twist: dörren leder någonstans som inte borde finnas. Beskriv det med hjälp av ett oväntat sinne (lukt, ljud, känsel)." },
  },
  "w-scifi-2": {
    fr: { q: "Moment de rebondissement : le gant fonctionne encore, et il n'était jamais censé être retrouvé. Écris le moment où elle le réalise." },
    de: { q: "Zeit für die Wendung: Der Handschuh funktioniert noch, und er sollte nie gefunden werden. Schreibe den Moment, in dem ihr das klar wird." },
    es: { q: "Hora del giro: el guante todavía funciona, y nunca debió ser encontrado. Escribe el momento en que ella se da cuenta de eso." },
    sv: { q: "Dags för en twist: handsken fungerar fortfarande, och den var aldrig menad att hittas. Skriv ögonblicket då hon inser det." },
  },
  "w-dystopia-2": {
    fr: { q: "Moment de rebondissement : le vote s'avère avoir été truqué par quelqu'un en qui le narrateur a confiance. Écris la révélation." },
    de: { q: "Zeit für die Wendung: Die Abstimmung wurde, wie sich herausstellt, von jemandem manipuliert, dem der Erzähler vertraut. Schreibe die Enthüllung." },
    es: { q: "Hora del giro: resulta que la votación fue amañada por alguien en quien el narrador confía. Escribe la revelación." },
    sv: { q: "Dags för en twist: det visar sig att omröstningen manipulerades av någon berättaren litar på. Skriv avslöjandet." },
  },
  "w-spark-1": {
    fr: { q: "Écris un pitch de film en une phrase qui fusionne deux genres que tu adores." },
    de: { q: "Schreibe einen Ein-Satz-Filmpitch, der zwei Genres verbindet, die du liebst." },
    es: { q: "Escribe un pitch de película en una frase que mezcle dos géneros que te encanten." },
    sv: { q: "Skriv en enradig filmpitch som blandar två genrer du älskar." },
  },
  "w-spark-2": {
    fr: { q: "Décris une couleur à quelqu'un qui ne l'a jamais vue." },
    de: { q: "Beschreibe jemandem eine Farbe, der sie noch nie gesehen hat." },
    es: { q: "Describe un color a alguien que nunca lo ha visto." },
    sv: { q: "Beskriv en färg för någon som aldrig har sett den." },
  },
  "w-spark-3": {
    fr: { q: "Offre à un méchant un lundi matin totalement banal." },
    de: { q: "Gib einem Bösewicht einen völlig gewöhnlichen Montagmorgen." },
    es: { q: "Dale a un villano una mañana de lunes totalmente rutinaria." },
    sv: { q: "Ge en skurk en helt vardaglig måndagsmorgon." },
  },
  "w-spark-4": {
    fr: { q: "Écris un dialogue entre deux personnes qui mentent toutes les deux, sans que ni l'une ni l'autre ne le dise." },
    de: { q: "Schreibe einen Dialog zwischen zwei Personen, die beide lügen, ohne dass es einer von ihnen ausspricht." },
    es: { q: "Escribe un diálogo entre dos personas que están mintiendo, sin que ninguna lo diga abiertamente." },
    sv: { q: "Skriv en dialog mellan två personer som båda ljuger, utan att någon av dem säger det." },
  },
  "w-spark-5": {
    fr: { q: "Invente une nouvelle fête et explique pourquoi le monde en a soudain besoin." },
    de: { q: "Erfinde einen neuen Feiertag und erkläre, warum die Welt ihn plötzlich braucht." },
    es: { q: "Inventa una nueva festividad y explica por qué el mundo la necesita de repente." },
    sv: { q: "Uppfinn en ny högtid och förklara varför världen plötsligt behöver den." },
  },
  "w-spark-6": {
    fr: { q: "Écris quatre lignes sur un endroit où tu n'es jamais allé." },
    de: { q: "Schreibe vier Zeilen über einen Ort, an dem du noch nie warst." },
    es: { q: "Escribe cuatro líneas sobre un lugar en el que nunca has estado." },
    sv: { q: "Skriv fyra rader om en plats du aldrig varit på." },
  },

  // ---------- rocket science (js/rocket.js) ----------
  "rc1-1": {
    fr: { q: "Une fusée décolle en projetant du gaz chaud d'un côté, ce qui la pousse de l'autre côté. De quelle loi du mouvement s'agit-il ?", choices: ["La première loi de Newton", "La deuxième loi de Newton", "La troisième loi de Newton", "Le principe de Bernoulli"], explain: "À chaque action correspond une réaction égale et opposée — le gaz part vers le bas, la fusée monte." },
    de: { q: "Eine Rakete startet, indem sie heißes Gas in eine Richtung ausstößt, was sie in die andere Richtung schiebt. Um welches Bewegungsgesetz handelt es sich?", choices: ["Newtons erstes Gesetz", "Newtons zweites Gesetz", "Newtons drittes Gesetz", "Das Bernoulli-Prinzip"], explain: "Jede Aktion hat eine gleich große, entgegengesetzte Reaktion — das Abgas geht runter, die Rakete geht hoch." },
    es: { q: "Un cohete despega expulsando gas caliente hacia un lado, lo que lo empuja hacia el otro. ¿Qué ley del movimiento es esa?", choices: ["La primera ley de Newton", "La segunda ley de Newton", "La tercera ley de Newton", "El principio de Bernoulli"], explain: "Toda acción tiene una reacción igual y opuesta — el escape sale hacia abajo, el cohete sube." },
    sv: { q: "En raket lyfter genom att skjuta ut het gas åt ena hållet, vilket knuffar raketen åt andra hållet. Vilken rörelselag är det?", choices: ["Newtons första lag", "Newtons andra lag", "Newtons tredje lag", "Bernoullis princip"], explain: "Varje kraft har en lika stor motriktad kraft — avgaserna går ner, raketen går upp." },
  },
  "rc1-2": {
    fr: { q: "Pour qu'une fusée décolle vraiment du pas de tir, sa poussée doit être supérieure à quoi ?", choices: ["La vitesse du son", "Son propre poids", "La pression de l'air", "La taille du réservoir"], explain: "Le rapport poussée/poids doit dépasser 1, sinon la fusée reste au sol en brûlant du carburant." },
    de: { q: "Damit eine Rakete tatsächlich von der Startrampe abhebt, muss ihr Schub größer sein als was?", choices: ["Die Schallgeschwindigkeit", "Ihr eigenes Gewicht", "Der Luftdruck", "Die Größe des Tanks"], explain: "Das Schub-Gewichts-Verhältnis muss über 1 liegen, sonst bleibt die Rakete einfach stehen und verbrennt Treibstoff." },
    es: { q: "Para que un cohete realmente despegue de la plataforma, su empuje debe ser mayor que ¿qué?", choices: ["La velocidad del sonido", "Su propio peso", "La presión del aire", "El tamaño del tanque"], explain: "La relación empuje-peso tiene que superar 1, o el cohete simplemente se queda ahí quemando combustible." },
    sv: { q: "För att en raket verkligen ska lyfta från rampen måste dess dragkraft vara större än vad?", choices: ["Ljudhastigheten", "Sin egen vikt", "Lufttrycket", "Bränsletankens storlek"], explain: "Förhållandet dragkraft/vikt måste vara över 1, annars står raketen bara kvar och bränner bränsle." },
  },
  "rc1-3": {
    fr: { q: "Des fusées comme Falcon 9 larguent leur premier étage (le booster) une fois son carburant épuisé. Pourquoi ?", choices: ["Pour le garder pour plus tard", "C'est un poids mort dont la fusée n'a plus besoin pour continuer d'accélérer", "C'est une obligation légale", "Pour ralentir la fusée"], explain: "Traîner un réservoir vide et des moteurs épuisés jusqu'au bout gaspille du carburant — les larguer, c'est comme décrocher une remorque devenue inutile." },
    de: { q: "Raketen wie die Falcon 9 werfen ihre erste Stufe (den Booster) ab, sobald dessen Treibstoff verbraucht ist. Warum?", choices: ["Um sie für später aufzuheben", "Es ist totes Gewicht, das die Rakete nicht mehr braucht, um weiter zu beschleunigen", "Das ist gesetzlich vorgeschrieben", "Um die Rakete abzubremsen"], explain: "Einen leeren Tank und verbrauchte Triebwerke den ganzen Weg mitzuschleppen verschwendet Treibstoff — sie abzuwerfen ist, als würde man einen nicht mehr benötigten Anhänger abkoppeln." },
    es: { q: "Cohetes como el Falcon 9 sueltan su primera etapa (el propulsor) una vez que se le acaba el combustible. ¿Por qué?", choices: ["Para guardarlo para después", "Es peso muerto que el cohete ya no necesita para seguir acelerando", "Es obligatorio por ley", "Para frenar el cohete"], explain: "Cargar un tanque vacío y motores gastados todo el camino desperdicia combustible — soltarlos es como desenganchar un remolque que ya no hace falta." },
    sv: { q: "Raketer som Falcon 9 släpper sitt första steg (boostern) när bränslet är slut. Varför?", choices: ["För att spara den till senare", "Det är dödvikt som raketen inte längre behöver för att fortsätta accelerera", "Det är lagstadgat", "För att sakta ner raketen"], explain: "Att släpa en tom tank och förbrukade motorer hela vägen slösar bränsle — att släppa dem är som att koppla loss ett släp man inte längre behöver." },
  },
  "rc1-4": {
    fr: { q: "Que brûlent réellement les moteurs de fusée pour produire une poussée ?", choices: ["Juste du carburant", "Du carburant et un comburant", "De l'air comprimé", "De l'électricité uniquement"], explain: "Contrairement à un moteur de voiture, une fusée doit transporter son propre comburant — il n'y a pas d'air pour brûler le carburant une fois hors de l'atmosphère." },
    de: { q: "Was verbrennen Raketentriebwerke eigentlich, um Schub zu erzeugen?", choices: ["Nur Treibstoff", "Treibstoff und ein Oxidationsmittel", "Druckluft", "Nur Elektrizität"], explain: "Anders als ein Automotor muss eine Rakete ihr eigenes Oxidationsmittel mitführen — sobald man die Atmosphäre verlässt, gibt es keine Luft mehr, um Treibstoff zu verbrennen." },
    es: { q: "¿Qué queman realmente los motores de cohete para producir empuje?", choices: ["Solo combustible", "Combustible y un oxidante", "Aire comprimido", "Solo electricidad"], explain: "A diferencia de un motor de coche, un cohete tiene que llevar su propio oxidante — no hay aire para quemar combustible una vez que sales de la atmósfera." },
    sv: { q: "Vad bränner raketmotorer egentligen för att skapa dragkraft?", choices: ["Bara bränsle", "Bränsle och ett oxidationsmedel", "Komprimerad luft", "Bara elektricitet"], explain: "Till skillnad från en bilmotor måste en raket bära sitt eget oxidationsmedel — det finns ingen luft att bränna bränsle med utanför atmosfären." },
  },
  "rc1-5": {
    fr: { q: "Tu conçois l'étage du booster pour une toute nouvelle fusée. Quelle est une caractéristique créative qu'il possède, et quel problème résout-elle ?" },
    de: { q: "Du entwirfst die Boosterstufe für eine brandneue Rakete. Was ist ein kreatives Merkmal, das sie hat, und welches Problem löst es?" },
    es: { q: "Estás diseñando la etapa propulsora de un cohete completamente nuevo. ¿Cuál es una característica creativa que tiene, y qué problema resuelve?" },
    sv: { q: "Du designar boostersteget för en helt ny raket. Vad är en kreativ egenskap den har, och vilket problem löser den?" },
  },
  "rc2-1": {
    fr: { q: "Pour rester en orbite, un vaisseau n'a pas tant besoin d'aller 'vers le haut' que de...", choices: ["Aller sur le côté, assez vite pour continuer à rater le sol en tombant", "Aller tout droit vers le haut puis s'arrêter", "Aller à l'envers par rapport à la rotation de la Terre", "Rien — l'orbite signifie juste être très haut"], explain: "C'est l'idée du boulet de canon de Newton : l'orbite est une chute contrôlée qui n'atterrit jamais, car on va assez vite sur le côté pour continuer à dépasser l'horizon en courbe." },
    de: { q: "Um in der Umlaufbahn zu bleiben, muss ein Raumfahrzeug nicht so sehr 'nach oben' fliegen, sondern eher...", choices: ["Seitwärts, schnell genug, um beim Fallen ständig den Boden zu verfehlen", "Geradeaus nach oben und dann anhalten", "Rückwärts relativ zur Erdrotation", "Nirgendwohin — Umlaufbahn bedeutet nur sehr hoch oben"], explain: "Das ist Newtons Kanonenkugel-Idee: Umlaufbahn ist ein kontrollierter Fall, der nie landet, weil man schnell genug seitwärts fliegt, um immer wieder über den Horizont hinauszukurven." },
    es: { q: "Para mantenerse en órbita, una nave no necesita tanto ir 'hacia arriba' como...", choices: ["Ir hacia los lados, lo bastante rápido para seguir sin tocar el suelo mientras cae", "Ir recto hacia arriba y detenerse", "Ir hacia atrás respecto a la rotación de la Tierra", "A ningún sitio — órbita solo significa estar muy alto"], explain: "Esta es la idea del cañón de Newton: la órbita es una caída controlada que nunca aterriza, porque vas lo bastante rápido de lado como para seguir superando el horizonte en una curva." },
    sv: { q: "För att stanna i omloppsbana behöver ett rymdskepp inte så mycket åka 'uppåt' som att...", choices: ["Åka i sidled, tillräckligt snabbt för att hela tiden missa marken när det faller", "Åka rakt upp och stanna", "Åka bakåt i förhållande till jordens rotation", "Ingenstans — omloppsbana betyder bara att vara väldigt högt uppe"], explain: "Det här är Newtons kanonkulsidé: en omloppsbana är ett kontrollerat fall som aldrig landar, eftersom man rör sig tillräckligt snabbt i sidled för att hela tiden kurva förbi horisonten." },
  },
  "rc2-2": {
    fr: { q: "Environ à quelle vitesse un vaisseau doit-il voyager pour rester en orbite terrestre basse ?", choices: ["Environ 100 km/h", "Environ 1 000 km/h", "Environ 28 000 km/h", "Environ 300 000 km/h"], explain: "C'est environ 7,8 km/s — assez vite pour que la courbe de sa chute corresponde à la courbe de la Terre." },
    de: { q: "Wie schnell muss ein Raumfahrzeug ungefähr fliegen, um in der niedrigen Erdumlaufbahn zu bleiben?", choices: ["Etwa 100 km/h", "Etwa 1.000 km/h", "Etwa 28.000 km/h", "Etwa 300.000 km/h"], explain: "Das sind etwa 7,8 km/s — schnell genug, dass die Kurve seines Falls mit der Krümmung der Erde übereinstimmt." },
    es: { q: "¿Aproximadamente a qué velocidad necesita viajar una nave para mantenerse en órbita terrestre baja?", choices: ["Unos 100 km/h", "Unos 1.000 km/h", "Unos 28.000 km/h", "Unos 300.000 km/h"], explain: "Son unos 7,8 km/s — lo bastante rápido para que la curva de su caída coincida con la curva de la Tierra." },
    sv: { q: "Ungefär hur fort måste ett rymdskepp färdas för att stanna i låg omloppsbana runt jorden?", choices: ["Cirka 100 km/h", "Cirka 1 000 km/h", "Cirka 28 000 km/h", "Cirka 300 000 km/h"], explain: "Det är ungefär 7,8 km/s — tillräckligt snabbt för att kurvan av dess fall ska matcha jordens krökning." },
  },
  "rc2-3": {
    fr: { q: "Pourquoi les fusées utilisent-elles plusieurs étages plutôt qu'une seule fusée géante à un étage ?", choices: ["Plusieurs petites fusées coûtent moins cher à peindre", "Chaque étage devient plus léger une fois le poids mort de l'étage précédent largué, ce qui gaspille moins de carburant", "C'est plus facile de lancer trois fusées qu'une seule", "Les fusées à un étage sont interdites au-dessus de l'atmosphère"], explain: "Traîner des réservoirs vides jusqu'en orbite est un gaspillage — l'étagement permet à chaque phase de la montée de ne transporter que ce dont elle a encore besoin." },
    de: { q: "Warum verwenden Raketen mehrere Stufen statt einer einzigen riesigen einstufigen Rakete?", choices: ["Mehrere kleinere Raketen sind billiger zu bemalen", "Jede Stufe wird leichter, sobald das tote Gewicht der vorherigen Stufe abgeworfen ist, wodurch weniger Treibstoff verschwendet wird", "Es ist einfacher, drei Raketen zu starten als eine", "Einstufige Raketen sind oberhalb der Atmosphäre nicht erlaubt"], explain: "Leere Tanks bis zur Umlaufbahn zu schleppen ist Verschwendung — durch Stufung trägt jede Phase des Aufstiegs nur das, was sie noch braucht." },
    es: { q: "¿Por qué los cohetes usan varias etapas en vez de un solo cohete gigante de una etapa?", choices: ["Varios cohetes más pequeños son más baratos de pintar", "Cada etapa se vuelve más ligera una vez soltado el peso muerto de la etapa anterior, así se desperdicia menos combustible", "Es más fácil lanzar tres cohetes que uno", "Los cohetes de una sola etapa no están permitidos sobre la atmósfera"], explain: "Arrastrar tanques vacíos hasta la órbita es un desperdicio — usar etapas permite que cada fase de la subida cargue solo lo que todavía necesita." },
    sv: { q: "Varför använder raketer flera steg istället för en enda jättelik enstegsraket?", choices: ["Flera mindre raketer är billigare att måla", "Varje steg blir lättare när föregående stegs dödvikt släpps, vilket slösar mindre bränsle", "Det är enklare att skjuta upp tre raketer än en", "Enstegsraketer är förbjudna ovanför atmosfären"], explain: "Att släpa tomma tankar hela vägen till omloppsbana är slöseri — stegning låter varje fas av uppstigningen bara bära det den fortfarande behöver." },
  },
  "rc2-4": {
    fr: { q: "Comment appelle-t-on la 'poussée' totale qu'il reste à une fusée pour changer de vitesse ou de direction — son budget carburant, en gros, mesuré en vitesse ?", choices: ["Delta-v", "Vitesse de libération", "Force g", "Apogée"], explain: "Les planificateurs de mission budgétisent le delta-v (en km/s) comme on budgétiserait de l'argent — chaque manœuvre en consomme une partie." },
    de: { q: "Wie heißt der gesamte 'Schub', den eine Rakete noch hat, um ihre Geschwindigkeit oder Richtung zu ändern — im Grunde ihr Treibstoffbudget, gemessen in Geschwindigkeit?", choices: ["Delta-v", "Fluchtgeschwindigkeit", "G-Kraft", "Apogäum"], explain: "Missionsplaner budgetieren Delta-v (in km/s) genauso wie man Geld budgetiert — jedes Manöver verbraucht einen Teil davon." },
    es: { q: "¿Cómo se llama el 'empuje' total que le queda a un cohete para cambiar su velocidad o dirección — básicamente su presupuesto de combustible, medido en velocidad?", choices: ["Delta-v", "Velocidad de escape", "Fuerza g", "Apogeo"], explain: "Los planificadores de misión presupuestan el delta-v (en km/s) igual que presupuestarían dinero — cada maniobra gasta parte de él." },
    sv: { q: "Vad kallas den totala 'knuff' en raket har kvar för att ändra hastighet eller riktning — i praktiken dess bränslebudget, mätt i hastighet?", choices: ["Delta-v", "Flykthastighet", "G-kraft", "Apogeum"], explain: "Uppdragsplanerare budgeterar delta-v (i km/s) precis som man skulle budgetera pengar — varje manöver spenderar en del av den." },
  },
  "rc2-5": {
    fr: { q: "Ta fusée vient d'atteindre l'orbite, et le réservoir du deuxième étage est vide et sur le point d'être largué. Écris ce moment du point de vue du pilote." },
    de: { q: "Deine Rakete hat gerade die Umlaufbahn erreicht, und der Tank der zweiten Stufe ist leer und wird gleich abgeworfen. Schreibe diesen Moment aus der Sicht der Pilotin." },
    es: { q: "Tu cohete acaba de llegar a órbita, y el tanque de combustible de la segunda etapa está vacío y a punto de soltarse. Escribe ese momento desde el punto de vista del piloto." },
    sv: { q: "Din raket har precis nått omloppsbana, och andra stegets bränsletank är tom och ska strax släppas. Skriv det ögonblicket ur pilotens perspektiv." },
  },
  "rc3-1": {
    fr: { q: "Pourquoi la capsule d'équipage est-elle tellement plus petite que le reste de la fusée ?", choices: ["C'est moins cher à construire en petit", "Tout le reste servait de carburant et de moteurs juste pour la mettre en mouvement — seule la capsule doit survivre à tout le trajet", "Les petites capsules volent plus vite", "Des règlements limitent la taille des capsules"], explain: "Le booster et le réservoir ont fait leur travail et ont été largués — la capsule est la seule partie qui a vraiment besoin d'un support de vie et doit revenir." },
    de: { q: "Warum ist die Besatzungskapsel so viel kleiner als der Rest der Rakete?", choices: ["Es ist billiger, sie klein zu bauen", "Alles andere war nur Treibstoff und Triebwerke, um sie in Bewegung zu bringen — nur die Kapsel muss die ganze Reise überstehen", "Kleinere Kapseln fliegen schneller", "Vorschriften begrenzen die Kapselgröße"], explain: "Booster und Tank haben ihre Aufgabe erfüllt und wurden abgeworfen — die Kapsel ist der einzige Teil, der wirklich Lebenserhaltung braucht und zurückkehren muss." },
    es: { q: "¿Por qué la cápsula de la tripulación es mucho más pequeña que el resto del cohete?", choices: ["Es más barato construirla pequeña", "Todo lo demás era solo combustible y motores para ponerla en movimiento — solo la cápsula necesita sobrevivir todo el viaje", "Las cápsulas pequeñas vuelan más rápido", "Las normas limitan el tamaño de la cápsula"], explain: "El propulsor y el tanque hicieron su trabajo y se soltaron — la cápsula es la única parte que realmente necesita soporte vital y tiene que volver." },
    sv: { q: "Varför är besättningskapseln så mycket mindre än resten av raketen?", choices: ["Det är billigare att bygga den liten", "Allt annat var bara bränsle och motorer för att få den i rörelse — bara kapseln behöver överleva hela resan", "Mindre kapslar flyger snabbare", "Regler begränsar kapselns storlek"], explain: "Boostern och tanken gjorde sitt jobb och släpptes — kapseln är den enda delen som verkligen behöver livsuppehållande system och måste ta sig hem." },
  },
  "rc3-2": {
    fr: { q: "Quand une capsule rentre dans l'atmosphère à grande vitesse, la majeure partie de cette vitesse se transforme en...", choices: ["Chaleur, due à la friction et à la compression de l'air", "Son uniquement", "Vitesse supplémentaire", "Lumière, sans chaleur"], explain: "Le rôle d'un bouclier thermique est de gérer cette chaleur pour qu'elle n'atteigne pas l'équipage." },
    de: { q: "Wenn eine Kapsel mit hoher Geschwindigkeit in die Atmosphäre eintritt, verwandelt sich der Großteil dieser Geschwindigkeit in...", choices: ["Hitze, durch Luftreibung und -kompression", "Nur Schall", "Zusätzliche Geschwindigkeit", "Licht, ohne Hitze"], explain: "Die ganze Aufgabe eines Hitzeschilds besteht darin, diese Hitze so zu bewältigen, dass sie die Besatzung nicht erreicht." },
    es: { q: "Cuando una cápsula reingresa a la atmósfera a alta velocidad, la mayor parte de esa velocidad se convierte en...", choices: ["Calor, por la fricción y compresión del aire", "Solo sonido", "Velocidad extra", "Luz, sin calor"], explain: "El trabajo de un escudo térmico es gestionar ese calor para que no llegue a la tripulación." },
    sv: { q: "När en kapsel återinträder atmosfären i hög hastighet omvandlas det mesta av hastigheten till...", choices: ["Värme, från luftfriktion och kompression", "Bara ljud", "Extra hastighet", "Ljus, utan värme"], explain: "En värmesköld hela uppgift är att hantera den värmen så att den inte når besättningen." },
  },
  "rc3-3": {
    fr: { q: "Qu'est-ce qu'un bouclier thermique 'ablatif' est conçu pour faire ?", choices: ["Réfléchir toute la chaleur instantanément", "Brûler et s'éroder volontairement, emportant la chaleur avec lui", "Rester parfaitement intact pendant la rentrée", "Refroidir la capsule à l'azote liquide"], explain: "Les boucliers AVCOAT d'Apollo et PICA-X de Dragon sont tous deux ablatifs — ils sont conçus pour se carboniser et s'écailler, emportant la chaleur avec eux." },
    de: { q: "Was soll ein 'ablativer' Hitzeschild bewirken?", choices: ["Sofort alle Hitze reflektieren", "Absichtlich verbrennen und erodieren und dabei Hitze mitnehmen", "Beim Wiedereintritt völlig intakt bleiben", "Die Kapsel mit flüssigem Stickstoff kühlen"], explain: "Apollos AVCOAT- und Dragons PICA-X-Schilde sind beide ablativ — sie sollen verkohlen und abblättern und dabei Hitze mit sich nehmen." },
    es: { q: "¿Qué está diseñado para hacer un escudo térmico 'ablativo'?", choices: ["Reflejar todo el calor al instante", "Quemarse y erosionarse a propósito, llevándose el calor consigo", "Mantenerse perfectamente intacto durante la reentrada", "Enfriar la cápsula con nitrógeno líquido"], explain: "Los escudos AVCOAT del Apollo y PICA-X del Dragon son ambos ablativos — están hechos para carbonizarse y desprenderse, llevándose el calor con ellos." },
    sv: { q: "Vad är en 'ablativ' värmesköld designad att göra?", choices: ["Reflektera all värme direkt", "Brinna och eroderas med avsikt, och ta med sig värmen när den gör det", "Förbli helt intakt genom återinträdet", "Kyla kapseln med flytande kväve"], explain: "Apollos AVCOAT och Dragons PICA-X-sköldar är båda ablativa — de är gjorda för att förkolna och flagna av, och ta värmen med sig." },
  },
  "rc3-4": {
    fr: { q: "Quelle famille de fusées a rendu les boosters réutilisables — capables de revenir se poser à la verticale — courants dans les lancements orbitaux ?", choices: ["Falcon 9", "Saturn V", "Soyouz", "Navette spatiale"], explain: "Les boosters Falcon 9 de SpaceX atterrissent et revolent, ce qui explique en grande partie pourquoi les lancements sont devenus moins chers." },
    de: { q: "Welche Raketenfamilie machte wiederverwendbare Booster — die selbstständig zurückfliegen und aufrecht landen — zu einem routinemäßigen Teil orbitaler Starts?", choices: ["Falcon 9", "Saturn V", "Sojus", "Space Shuttle"], explain: "SpaceX' Falcon-9-Booster landen und fliegen erneut, was ein großer Grund dafür ist, dass Starts günstiger wurden." },
    es: { q: "¿Qué familia de cohetes hizo que los propulsores reutilizables — volando de vuelta y aterrizando en posición vertical — fueran algo rutinario en los lanzamientos orbitales?", choices: ["Falcon 9", "Saturn V", "Soyuz", "Transbordador espacial"], explain: "Los propulsores Falcon 9 de SpaceX aterrizan y vuelven a volar, lo cual es una gran razón por la que los lanzamientos se abarataron." },
    sv: { q: "Vilken raketfamilj gjorde återanvändbara boostrar — som flyger tillbaka själva och landar upprätt — till en rutinmässig del av omloppsbanan uppskjutningar?", choices: ["Falcon 9", "Saturn V", "Sojuz", "Rymdfärjan"], explain: "SpaceX Falcon 9-boostrar landar och flyger igen, vilket är en stor anledning till att uppskjutningar blev billigare." },
  },
  "rc3-5": {
    fr: { q: "Planifie une mission spatiale réaliste : où va-t-elle, quelle est la taille de l'équipage, et quel est le plus gros risque à prendre en compte dans la conception ?" },
    de: { q: "Plane eine realistische Weltraummission: Wohin geht sie, wie groß ist die Besatzung, und was ist das größte Risiko, das du einplanen müsstest?" },
    es: { q: "Planea una misión espacial realista: ¿adónde va, cuál es el tamaño de la tripulación, y cuál es el mayor riesgo para el que tendrías que diseñar?" },
    sv: { q: "Planera ett realistiskt rymduppdrag: vart är det på väg, hur stor är besättningen, och vad är den största risken du skulle behöva designa för?" },
  },
};

// Snapshots each node's original English on first run (so re-localizing to
// English, or falling back when a language has no entry, always has the
// real source text to return to), then applies the current language's
// override in place. Same call sites as localizeDomains()/localizeAchievements().
function localizeQuestionNode(node, lang) {
  if (!node._baseQ) {
    node._baseQ = node.q;
    node._baseChoices = node.choices;
    node._baseExplain = node.explain;
  }
  const tr = QUESTIONS_I18N[node.id] && QUESTIONS_I18N[node.id][lang];
  node.q = (tr && tr.q) || node._baseQ;
  if (node._baseChoices) node.choices = (tr && tr.choices) || node._baseChoices;
  if (node._baseExplain) node.explain = (tr && tr.explain) || node._baseExplain;
}

function localizeQuestions() {
  const lang = I18n.current;
  Object.values(QUESTIONS).forEach((pool) => pool.forEach((node) => localizeQuestionNode(node, lang)));
  ROCKET_COURSE.forEach((stage) => stage.nodes.forEach((node) => localizeQuestionNode(node, lang)));
}

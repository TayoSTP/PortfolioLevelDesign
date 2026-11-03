# Portfolio Level Design – Rimet Tao

Site statique (HTML / CSS / JS, sans framework) hébergé avec GitHub Pages.

## Mise en ligne
1. Sur GitHub : **Settings → Pages**.
2. *Source* : « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. Le site est disponible quelques minutes plus tard sur `https://tayostp.github.io/PortfolioLevelDesign/`.

## Ce qu'il reste à déposer
| Quoi | Où | Remarque |
|---|---|---|
| Police **Caviar Dreams** (normal + gras) | `fonts/CaviarDreams.woff2` ou `.ttf`, `fonts/CaviarDreams_Bold.woff2` ou `.ttf` | Tant qu'elle est absente, la police de repli Quicksand s'affiche. Rajdhani est chargée depuis Google Fonts. |
| Vidéo d'accueil | `media/intro.mp4` | Chemin réglable dans `js/data.js` (`site.introVideo`). Format conseillé : MP4 H.264, moins de 25 Mo. |
| Médias de chaque projet | `media/<projet>/…` | Références à renseigner dans `js/data.js` : `cover`, `preview` (vidéo au survol), `logo`, `map`. |
| URL LinkedIn | `js/data.js` → `site.contact.linkedin` | |

## Modifier le contenu
Tout le contenu (projets, textes FR/EN, compétences, loisirs) est dans **`js/data.js`**.
Les mots entre `<b>…</b>` s'affichent en violet gras, comme dans le CV.

## Structure
- `index.html` : squelette de la page
- `css/style.css` : charte (polices, palette, bandeaux, badges du CV)
- `js/bg.js` : fond animé (courbes de niveau générées en code, réglages en tête de fichier)
- `js/app.js` : navigation par onglets, bascule FR/EN, vidéo au survol
- `assets/` : photo, CV PDF, icônes du CV

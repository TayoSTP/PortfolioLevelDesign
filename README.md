# Portfolio Level Design – Rimet Tao

Site statique (HTML / CSS / JS, sans framework) hébergé avec GitHub Pages.

## Mise en ligne
1. Sur GitHub : **Settings → Pages**.
2. *Source* : « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. Le site est disponible quelques minutes plus tard sur `https://tayostp.github.io/PortfolioLevelDesign/`.

## Ce qu'il reste à déposer
| Quoi | Où | Remarque |
|---|---|---|
| Vidéo d'accueil | `media/intro.mp4` | Chemin réglable dans `js/data.js` (`site.introVideo`). MP4 H.264 conseillé, moins de 25 Mo. |
| Médias de chaque projet | `media/<projet>/…` | À référencer dans `js/data.js` : `cover`, `preview` (vidéo au survol), `logo`, `map`. |
| Nombre de personnes / moteur | `js/data.js` → `team`, `engine`, `engineIcon` | `team: null` affiche « ? ». Sans icône de moteur, un monogramme s'affiche (`engineMark`). |

## Modifier le contenu
Tout le contenu (projets, textes FR/EN, compétences, loisirs, contacts) est dans **`js/data.js`**.
Les mots entre `<b>…</b>` s'affichent en violet gras, comme dans le CV.

## Charte
- Polices : **Rajdhani** (titres, via Google Fonts) et **Caviar Dreams** (corps, fichiers dans `fonts/`).
- Contour des icônes : tracés vectoriels extraits du CV (`js/rings.js`), un par taille de pastille
  (petites icônes, contacts, loisirs, photo). Les icônes, la photo et le fond lilas (`assets/disc_lilac.png`)
  sont découpés à la même forme polygonale.
- Fond animé : `js/bg.js`. Deux cadrages : normal (par défaut) et dézoomé, visible en ajoutant `?topo=dezoom`
  à l'adresse du site. Pour changer le cadrage par défaut : `DEFAULT_PRESET` en tête du fichier.
- CV téléchargeable en deux versions : `assets/CV_Rimet_Tao_Couleur.pdf` et `assets/CV_Rimet_Tao_Imprimable.pdf`
  (la version imprimable est le même document recoloré en noir et blanc : mise en page identique).

## Structure
- `index.html` : squelette de la page
- `css/style.css` : charte (polices, palette, bandeaux, badges du CV)
- `js/bg.js` : fond animé (courbes de niveau générées en code, réglages en tête de fichier)
- `js/app.js` : navigation par onglets, bascule FR/EN, vidéo au survol, menu de téléchargement du CV

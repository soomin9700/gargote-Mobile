# TP Gargote Mobile — Partie 1 : Ionic et Vue

Vous allez construire, en JavaScript, l'application mobile d'une gargote :
consulter le menu, remplir un panier, envoyer la commande en cuisine et suivre
les commandes.

Cette archive accompagne le deck **« Partie 1 — Ionic et Vue »**. La partie 2
(problèmes et TypeScript) sera distribuée ensuite et **repartira de votre code** :
gardez ce dossier précieusement.

## Prérequis

| Outil | Version | Vérifier |
|---|---|---|
| Node.js | 22.12 ou plus récent | `node -v` |
| npm | fourni avec Node | `npm -v` |
| Git | récent | `git --version` |
| VS Code | récent | — |
| Extension VS Code « Vue (Official) » | — | recommandée |

## Contenu du dossier

```
tp-ionic-gargote/
├── README.md               ce fichier
├── REPONSES-partie1.md     à compléter au fil des fiches, puis à rendre
├── fiches/                 fiches 00 à 04, à suivre dans l'ordre
├── api/                    la mini-API de la gargote (Node, aucune dépendance)
├── app/                    l'application Ionic + Vue : VOTRE code
└── exercices/js/           diagnostic JavaScript (fiche 00)
```

## Lancer le projet

Il faut **deux terminaux** ouverts en même temps.

**Terminal 1 : l'API**

```bash
cd api
npm start                # API sur http://localhost:3000/api
```

Testez dans le navigateur : <http://localhost:3000/api/plats> doit afficher du JSON.
Les données sont en mémoire : chaque redémarrage de l'API remet tout à zéro.

**Terminal 2 : l'application**

```bash
cd app
npm install              # une seule fois (connexion Internet nécessaire)
npm run dev              # application sur http://localhost:8100
```

Dans Chrome, ouvrez les outils de développement (F12) puis activez le
**mode appareil** (Ctrl+Maj+M) et choisissez un téléphone.

## Les fiches

Chaque passage au TP est signalé dans le deck par une slide verte « Au TP : fiche NN ».

| Section du deck | Fiche | Contenu | Durée indicative |
|---|---|---|---|
| 1 · Rappels JS | 00 | Diagnostic JavaScript | 30 min |
| 2 · Ionic et Vue | 01 | Prise en main : structure, composants, liste du menu | 1 h 30 |
| 2 · Ionic et Vue | 02 | Navigation : page de détail, retour, cycle de vie | 1 h |
| 2 · Ionic et Vue | 03 | Le panier : état partagé, badge, quantités | 1 h 30 |
| 2 · Ionic et Vue | 04 | La commande : formulaire, confirmation, erreurs de l'API | 1 h 30 |

## Règles

- Avant de commencer, placez **ce dossier** sous Git, à sa racine :
  `git init`, `git add .`, `git commit -m "depart"`.
- Faites un **commit à la fin de chaque fiche** (`git commit -am "fiche 03"`).
  Le commit de la fiche 04 est indispensable : la partie 2 compare votre code avec lui.
- Chaque fiche se termine par des **questions** : répondez-y dans `REPONSES-partie1.md`.
- Si vous êtes bloqué, relisez la fiche et la slide indiquée, puis la documentation
  d'Ionic : <https://ionicframework.com/docs/components>.

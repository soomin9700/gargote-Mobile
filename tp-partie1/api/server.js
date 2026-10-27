/*
 * Mini-API « Gargote » pour le TP Ionic.
 * Aucune dépendance : lancer avec   node server.js
 * Écoute sur http://localhost:3000/api
 *
 * Les données vivent en mémoire : un redémarrage remet tout à zéro.
 *
 * ATTENTION, comme une vraie API branchée sur PostgreSQL, les montants
 * arrivent sous forme de CHAÎNES ("5000.00") et non de nombres.
 * C'est volontaire : vous verrez pourquoi dans la fiche 05.
 */
const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const LATENCE_MS = Number(process.env.LATENCE_MS || 300); // simule un réseau mobile

// Fiche 05 : la « version 2 » de l'API renomme le champ `nom` des plats en `libelle`.
//   npm run start:v2      (ou : node server.js --v2)
const API_VERSION = process.argv.includes('--v2') ? '2' : '1';

/* ------------------------------------------------------------------ */
/*  Données                                                            */
/* ------------------------------------------------------------------ */
const categories = [
  { id: 1, nom: 'Plats' },
  { id: 2, nom: 'Soupes' },
  { id: 3, nom: 'Accompagnements' },
  { id: 4, nom: 'Boissons' },
];

let plats = [
  { id: 1, nom: 'Romazava', description: 'Bouillon de brèdes et zébu', prix: '6000.00', categorie_id: 1, disponible: true },
  { id: 2, nom: 'Ravitoto sy henakisoa', description: 'Feuilles de manioc pilées au porc', prix: '7000.00', categorie_id: 1, disponible: true },
  { id: 3, nom: 'Henomby ritra', description: 'Zébu mijoté', prix: '8000.00', categorie_id: 1, disponible: true },
  { id: 4, nom: 'Akoho sy voanio', description: 'Poulet au lait de coco', prix: '7500.00', categorie_id: 1, disponible: false },
  { id: 5, nom: 'Soupe chinoise', description: 'Nouilles, légumes et viande', prix: '5000.00', categorie_id: 2, disponible: true },
  { id: 6, nom: 'Lasopy', description: 'Soupe de légumes', prix: '3000.00', categorie_id: 2, disponible: true },
  { id: 7, nom: 'Vary fotsy', description: 'Riz blanc', prix: '1000.00', categorie_id: 3, disponible: true },
  { id: 8, nom: 'Lasary voatabia', description: 'Rougail de tomates', prix: '1500.00', categorie_id: 3, disponible: true },
  { id: 9, nom: 'Ranovola', description: 'Eau de riz', prix: '500.00', categorie_id: 4, disponible: true },
  { id: 10, nom: 'Jus de corossol', description: 'Pressé maison', prix: '2500.00', categorie_id: 4, disponible: true },
];

let commandes = [];
let prochainIdPlat = plats.length + 1;
let prochainIdCommande = 1;

/* ------------------------------------------------------------------ */
/*  Outils                                                             */
/* ------------------------------------------------------------------ */
const montant = (n) => Number(n).toFixed(2); // nombre -> "1234.00"

function avecCategorie(plat) {
  const categorie = categories.find((c) => c.id === plat.categorie_id) || null;
  if (API_VERSION === '2') {
    const { nom, ...reste } = plat;
    return { ...reste, libelle: nom, categorie };
  }
  return { ...plat, categorie };
}

function envoyer(res, statut, donnees) {
  const corps = donnees === undefined ? '' : JSON.stringify(donnees);
  setTimeout(() => {
    res.writeHead(statut, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(corps);
  }, LATENCE_MS);
}

function lireCorps(req) {
  return new Promise((resolve) => {
    let brut = '';
    req.on('data', (morceau) => (brut += morceau));
    req.on('end', () => {
      if (!brut) return resolve({});
      try { resolve(JSON.parse(brut)); } catch { resolve(null); }
    });
  });
}

function validerPlat(corps) {
  const erreurs = {};
  if (typeof corps.nom !== 'string' || corps.nom.trim().length < 3) {
    erreurs.nom = 'Le nom est obligatoire (3 caractères minimum).';
  } else if (plats.some((p) => p.nom.toLowerCase() === corps.nom.trim().toLowerCase())) {
    erreurs.nom = 'Un plat porte déjà ce nom.';
  }
  const prix = Number(corps.prix);
  if (corps.prix === undefined || corps.prix === '' || Number.isNaN(prix) || prix <= 0) {
    erreurs.prix = 'Le prix doit être un nombre strictement positif.';
  }
  if (!categories.some((c) => c.id === Number(corps.categorie_id))) {
    erreurs.categorie_id = 'Catégorie inconnue.';
  }
  return erreurs;
}

/* ------------------------------------------------------------------ */
/*  Routes                                                             */
/* ------------------------------------------------------------------ */
async function router(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const chemin = url.pathname.replace(/\/+$/, '');
  const m = req.method;
  let r;

  if (m === 'OPTIONS') return envoyer(res, 204);

  // GET /api/categories
  if (m === 'GET' && chemin === '/api/categories') return envoyer(res, 200, categories);

  // GET /api/plats            ?categorie=1
  if (m === 'GET' && chemin === '/api/plats') {
    const cat = url.searchParams.get('categorie');
    const liste = cat ? plats.filter((p) => p.categorie_id === Number(cat)) : plats;
    return envoyer(res, 200, liste.map(avecCategorie));
  }

  // GET /api/plats/:id
  if (m === 'GET' && (r = chemin.match(/^\/api\/plats\/(\d+)$/))) {
    const plat = plats.find((p) => p.id === Number(r[1]));
    return plat ? envoyer(res, 200, avecCategorie(plat)) : envoyer(res, 404, { message: 'Plat introuvable.' });
  }

  // POST /api/plats
  if (m === 'POST' && chemin === '/api/plats') {
    const corps = await lireCorps(req);
    if (corps === null) return envoyer(res, 400, { message: 'JSON invalide.' });
    const erreurs = validerPlat(corps);
    if (Object.keys(erreurs).length) return envoyer(res, 422, { message: 'Données invalides.', erreurs });
    const plat = {
      id: prochainIdPlat++,
      nom: corps.nom.trim(),
      description: corps.description ? String(corps.description) : '',
      prix: montant(corps.prix),
      categorie_id: Number(corps.categorie_id),
      disponible: corps.disponible !== false,
    };
    plats.push(plat);
    return envoyer(res, 201, avecCategorie(plat));
  }

  // GET /api/commandes
  if (m === 'GET' && chemin === '/api/commandes') {
    return envoyer(res, 200, [...commandes].reverse());
  }

  // GET /api/commandes/:id
  if (m === 'GET' && (r = chemin.match(/^\/api\/commandes\/(\d+)$/))) {
    const c = commandes.find((x) => x.id === Number(r[1]));
    return c ? envoyer(res, 200, c) : envoyer(res, 404, { message: 'Commande introuvable.' });
  }

  // POST /api/commandes   { table: 4, lignes: [{ plat_id: 1, quantite: 2 }] }
  if (m === 'POST' && chemin === '/api/commandes') {
    const corps = await lireCorps(req);
    if (corps === null) return envoyer(res, 400, { message: 'JSON invalide.' });
    const erreurs = {};
    const table = Number(corps.table);
    if (!Number.isInteger(table) || table < 1 || table > 20) {
      erreurs.table = 'Le numéro de table doit être un entier entre 1 et 20.';
    }
    if (!Array.isArray(corps.lignes) || corps.lignes.length === 0) {
      erreurs.lignes = 'La commande doit contenir au moins un plat.';
    }
    if (Object.keys(erreurs).length) return envoyer(res, 422, { message: 'Données invalides.', erreurs });

    const lignes = [];
    for (const l of corps.lignes) {
      const plat = plats.find((p) => p.id === Number(l.plat_id));
      const quantite = Number(l.quantite);
      if (!plat) return envoyer(res, 422, { message: 'Données invalides.', erreurs: { lignes: `Plat ${l.plat_id} inconnu.` } });
      if (!Number.isInteger(quantite) || quantite < 1) {
        return envoyer(res, 422, { message: 'Données invalides.', erreurs: { lignes: `Quantité invalide pour « ${plat.nom} ».` } });
      }
      if (!plat.disponible) return envoyer(res, 409, { message: `« ${plat.nom} » n'est plus disponible.` });
      lignes.push({
        plat_id: plat.id,
        nom: plat.nom,
        quantite,
        prix_unitaire: plat.prix,
        sous_total: montant(Number(plat.prix) * quantite),
      });
    }
    const total = lignes.reduce((t, l) => t + Number(l.sous_total), 0);
    const commande = {
      id: prochainIdCommande++,
      table,
      date: new Date().toISOString(),
      statut: 'en_attente',
      total: montant(total),
      lignes,
    };
    commandes.push(commande);
    return envoyer(res, 201, commande);
  }

  return envoyer(res, 404, { message: `Route inconnue : ${m} ${chemin}` });
}

http.createServer((req, res) => {
  router(req, res).catch((e) => {
    console.error(e);
    envoyer(res, 500, { message: 'Erreur interne.' });
  });
}).listen(PORT, () => {
  console.log(`API Gargote (version ${API_VERSION}) prête sur http://localhost:${PORT}/api`);
  console.log('Routes : GET /api/categories, GET|POST /api/plats, GET /api/plats/:id,');
  console.log('         GET|POST /api/commandes, GET /api/commandes/:id');
});

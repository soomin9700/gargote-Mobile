import assert from 'node:assert/strict';
import { plats } from './donnees.js';
import * as d from './diagnostic.js';

const tests = {
  '1. Déstructuration': () => {
    assert.equal(d.resumePlat(plats[0]), 'Romazava : 6000.00 Ar');
  },
  '2. Spread et immutabilité': () => {
    const panier = [{ plat: plats[0], quantite: 2 }];
    const copie = structuredClone(panier);
    const nouveau = d.ajouterLigne(panier, plats[2]);
    assert.deepEqual(panier, copie, 'le panier reçu a été modifié');
    assert.notEqual(nouveau, panier, 'il faut renvoyer un NOUVEAU tableau');
    assert.equal(nouveau.length, 2);
    assert.deepEqual(nouveau[1], { plat: plats[2], quantite: 1 });
  },
  '3. Filter et map': () => {
    assert.deepEqual(d.nomsDisponibles(plats), ['Romazava', 'Lasopy', 'Vary fotsy']);
  },
  '4. Reduce': () => {
    const lignes = [{ plat: plats[0], quantite: 2 }, { plat: plats[3], quantite: 3 }];
    assert.strictEqual(d.totalPanier(lignes), 15000);
    assert.strictEqual(d.totalPanier([]), 0);
  },
  '5. find, ?. et ??': () => {
    assert.equal(d.nomCategorie(plats, 6), 'Soupes');
    assert.equal(d.nomCategorie(plats, 7), 'Inconnue');
    assert.equal(d.nomCategorie(plats, 99), 'Inconnue');
  },
  '6. async / await': async () => {
    const ok = await d.chargerMenu(async () => plats);
    assert.deepEqual(ok, { nombre: 4, erreur: null });
    const ko = await d.chargerMenu(async () => { throw new Error('Réseau indisponible'); });
    assert.deepEqual(ko, { nombre: 0, erreur: 'Réseau indisponible' });
  },
};

let reussis = 0;
for (const [nom, test] of Object.entries(tests)) {
  try {
    await test();
    console.log(`  ✓ ${nom}`);
    reussis++;
  } catch (e) {
    const detail = 'actual' in e && !e.message.startsWith('le ') && !e.message.startsWith('il ')
      ? `reçu ${JSON.stringify(e.actual)}, attendu ${JSON.stringify(e.expected)}`
      : e.message.split('\n')[0];
    console.log(`  ✗ ${nom}\n      ${detail}`);
  }
}
console.log(`\n${reussis} / ${Object.keys(tests).length} exercices réussis`);

<template>
  <!-- ion-page : l'enveloppe obligatoire de chaque page -->
  <ion-page>
    <!-- En-tête fixe en haut de l'écran -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Menu du jour</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Zone qui défile -->
    <ion-content>
      <!-- 1. Chargement en cours -->
      <div v-if="chargement" class="ion-text-center ion-padding">
        <ion-spinner />
      </div>

      <!-- 2. Erreur -->
      <div v-else-if="erreur" class="ion-padding">
        <ion-text color="danger">
          <p>{{ erreur }}</p>
        </ion-text>
        <ion-button expand="block" @click="charger">Réessayer</ion-button>
      </div>

      <!-- 3. La liste des plats -->
      <ion-list v-else>
        <ion-item v-for="plat in plats" :key="plat.id">
          <ion-label>
            <h2>{{ plat.nom }}</h2>
            <p>{{ plat.categorie.nom }}</p>
          </ion-label>
          <ion-note slot="end">{{ formatAriary(plat.prix) }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonNote, IonSpinner, IonText, IonButton,
} from '@ionic/vue';
import api from '@/services/api';
import { formatAriary } from '@/utils/format';

const plats = ref([]);
const chargement = ref(true);
const erreur = ref(null);

async function charger() {
  chargement.value = true;
  erreur.value = null;
  try {
    plats.value = await api.getPlats();
  } catch (e) {
    erreur.value = "Impossible de joindre l'API. Est-elle lancée ?";
    console.error(e);
  } finally {
    chargement.value = false;
  }
}

onMounted(charger);
</script>

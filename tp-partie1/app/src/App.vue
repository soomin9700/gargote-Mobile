<template>
  <!-- ion-app : la racine obligatoire de toute application Ionic -->
  <ion-app>
    <!-- ion-router-outlet : l'endroit où s'affiche la page courante -->
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

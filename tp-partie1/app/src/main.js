import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import App from './App.vue';
import router from './router';

/* CSS indispensable au fonctionnement des composants Ionic */
import '@ionic/vue/css/core.css';
/* CSS de base (mise en forme minimale du texte et des titres) */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
/* Classes utilitaires : ion-padding, ion-text-center, ion-margin-top... */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
/* Mode sombre automatique selon le réglage du téléphone */
import '@ionic/vue/css/palettes/dark.system.css';

/* Couleurs de l'application */
import './theme/variables.css';

const app = createApp(App)
  .use(IonicVue)   // active Ionic dans Vue
  .use(router);    // active la navigation

// On attend que le routeur soit prêt avant d'afficher l'application
router.isReady().then(() => {
  app.mount('#app');
});

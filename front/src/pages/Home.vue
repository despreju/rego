<template>
    <h1>Listes des commandes : {{ formattedData.length }}</h1>
    <ImportOrders />
    <button @click="onLogout">Se déconnecter</button>
    <div class="table-head">
      <div class="table-head__id">ID</div>
      <div class="table-head__categorie">Catégorie</div>
      <div class="table-head__prixClient">Prix Client</div>
      <div class="table-head__prixAchat">Prix Achat</div>
      <div class="table-head__margeEuro">Marge €</div>
      <div class="table-head__margePercent">Marge €</div>
      <div class="table-head__commentaire">Commentaire</div>
    </div>
    <div v-for="data in formattedData" :key="data.id">
      <div class="table-row">
        <div class="table-row__id">
          <Money class="w-2 h-2 text-red-500" />
          <div>
            <div>{{ data.id }}</div>
            <div class="table-row__date">{{ data.date }}</div>
          </div>
        </div>
        <div class="table-row__categorie"><div>{{ data.categorie }}</div></div>
        <div class="table-row__prixClient">{{ data.prixClient }}</div>
        <div class="table-row__prixAchat">{{ data.prixAchat }}</div>
        <div class="table-row__margeEuro">{{ data.margeEuro }}</div> 
        <div class="table-row__margePercent">{{ data.margePercent }}</div>
        <div class="table-row__commentaire">{{ data.commentaire }}</div>
      </div>
    </div>
</template>

<script setup lang="ts">
  import { useGetOrders } from '../composables/useOrder';
  import { onMounted, computed } from 'vue';
  import ImportOrders from '../components/ImportOrders.vue';
  import { useOrderStore } from '../stores/order'
  import Money from '../assets/icons/money.svg'
import { useLogout } from '../composables/useAuth';

  interface TransformedItem {
    date: string;
    categorie: string;
    id: string;
    prixClient: number;
    prixAchat: number;
    margeEuro: number;
    margePercent: number;
    commentaire: string;
  }

  const order = useOrderStore()

  // Définition des colonnes
  const columns = [
    { title: 'Date', key: 'date', defaultSortOrder: 'ascend', sorter: 'default' },
    { title: 'Catégorie', key: 'categorie', defaultSortOrder: 'ascend', sorter: 'default' },
    { title: 'ID', key: 'id', defaultSortOrder: 'ascend', sorter: 'default' },
    { title: 'Prix client', key: 'prixClient', defaultSortOrder: 'ascend', sorter: 'default' },
    { title: 'Prix achat', key: 'prixAchat', defaultSortOrder: 'ascend', sorter: 'default' },
    { title: 'Commentaire', key: 'commentaire', defaultSortOrder: 'ascend', sorter: 'default' },
  ]

  const formattedData = computed<TransformedItem[]>(() => {
    return order.ordersList.map(item => ({
      date: item.date
        ? item.date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        : '',
      categorie: item.categorie ?? '',
      id: '#' + (item.id ?? ''),
      prixClient: (item.prixClient ?? 0) + " €",
      prixAchat: Math.abs(item.prixAchat ?? 0) + " €",
      margeEuro: ((item.prixClient ?? 0) + (item.prixAchat ?? 0)).toFixed(2) + " €",
      margePercent: item.prixClient
        ? (((item.prixClient ?? 0) + (item.prixAchat ?? 0)) / (item.prixClient ?? 1) * 100).toFixed(2) + " %"
        : "0 %",
      commentaire: item.commentaire ?? ''
    }))
  })

  const logoutMutation = useLogout();
  const onLogout = () => {
    logoutMutation.mutate();
  };

  onMounted(() => {
    useGetOrders().mutate()
})
</script>

<style scoped>
.table-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #32323B;
  color: #F0F1F8;
  border-radius:1rem;
  margin-bottom:0.5rem;
  padding: 1rem 1rem;
}

.table-head__id {
  text-align: left;
  width: 20%;
}

.table-head__categorie {
  text-align: right;
  width: 10%;
}

.table-head__prixClient {
  text-align: right;
  width: 10%;
}

.table-head__prixAchat {
  text-align: right;
  width: 10%;
}

.table-head__margeEuro {
  text-align: right;
  width: 10%;
}

.table-head__margePercent {
  text-align: right;
  width: 10%;
}

.table-head__commentaire {
  padding-left: 5rem;
  text-align: left;
    width: 20%;
}

.table-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #32323B;
  color: #F0F1F8;
  border-radius:1rem;
  margin-bottom:0.5rem;
  padding: 1rem 1rem;
}

.table-row:hover {
  background: #444450;
  cursor: pointer;
}

.table-row__id {
  display: flex;
  width: 20%;
}

.table-row__id > div {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  width: 20%;
}

.table-row__date {
  color: #808187;
  font-style: italic;
}

.table-row__categorie {
  text-align: right;
  width: 10%;
}

.table-row__categorie > div{
  background: #1C1B20;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  color: #808187;
}

.table-row__prixClient {
  text-align: right;
  color: #F0F1F8;
  font-weight: bold;
  width: 10%
}
.table-row__prixAchat {
  text-align: right;
  color: #F0F1F8;
  font-weight: bold;
  width: 10%;
}
.table-row__margeEuro {
  text-align: right;
  color: #59AD9A;
  font-weight: bold;
  width: 10%;
}
.table-row__margePercent {
  text-align: right;
  color: #59AD9A;
  font-weight: bold;
  width: 10%;
}
.table-row__commentaire {
  padding-left: 5rem;
  width: 20%;
  color: #b2b4bd;
  font-style: italic;
  text-align: left;
}
</style>
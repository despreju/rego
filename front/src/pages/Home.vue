<template>
  <EditOrderPanel v-if="isNewOrderPanelOpen" @close="isNewOrderPanelOpen = false;" :order="null" />
  <EditAdPanel v-if="isNewAdPanelOpen" @close="isNewAdPanelOpen = false;" :order="null" />
  <EditPaymentPanel v-if="isNewPaymentPanelOpen" @close="isNewPaymentPanelOpen = false;" :order="null" />
  <EditShopifyPanel v-if="isNewShopifyPanelOpen" @close="isNewShopifyPanelOpen = false;" :order="null" />
  <div class="dashboard">
    <div class="topbar">
      <div class="title-page">Dashboard</div>
      <div class="actions">
        <ExportOrders class="action-button" />
        <ImportOrders class="action-button" style="margin-left: 2rem;" />
      </div>
    </div>
    <div class="stats">
      <div class="grid-card" style="grid-column: 1;grid-row: 1">
        <div class="card-title">Nombre d'opérations</div>
        <div class="card-info">{{ order.ordersList.length + order.shopifyList.length + order.adsList.length +
          order.paymentsList.length }}</div>
      </div>
      <div class="grid-card" style="grid-column: 2;grid-row: 1">
        <div class="card-title">Trésorerie</div>
        <div class="card-info">{{ (totalMarge() - sumPrixAchat(order.paymentsList) - sumPrixAchat(order.shopifyList) - sumPrixAchat(order.adsList)).toFixed(2) }} €</div>
      </div>
      <div class="grid-card" style="grid-column: 3;grid-row: 1">
        <div class="card-title">Chiffre d'affaires</div>
        <div class="card-info">{{ totalMarge().toFixed(2) }} €</div>
      </div>
      <div class="grid-card button-actions" style="grid-column: 4;grid-row: 1">
        <Button class="button-action" color="blue" @click="isNewOrderPanelOpen = true" :icon="addIcon"
          msg="Ajouter une commande" />
        <Button class="button-action" color="blue" @click="isNewAdPanelOpen = true" :icon="addIcon"
          msg="Ajouter une dépense" />
        <Button class="button-action" color="blue" @click="isNewPaymentPanelOpen = true" :icon="addIcon"
          msg="Ajouter un versement" />
        <Button class="button-action" color="blue" @click="isNewShopifyPanelOpen = true" :icon="addIcon"
          msg="Ajouter Shopify" />
      </div>
      <div class="graph grid-card"
        style="grid-column-start: 1; grid-column-end: 4; grid-row-start: 2; grid-row-end: 4;">
        <div class="card-title">Commandes sur les 10 dernières semaines</div>
        <apexchart type="area" height="100%" :options="chartOptions" :series="series"></apexchart>
      </div>
      <div class="grid-card" style="grid-column: 4;grid-row: 2">
        <div class="card-title">Dépenses Shopify</div>
        <div class="card-info">{{ sumPrixAchat(order.shopifyList) }} €</div>
      </div>
      <div class="grid-card" style="grid-column: 4;grid-row: 3">
        <div class="card-title">Dépenses Autres</div>
        <div class="card-info">{{ sumPrixAchat(order.adsList) }} €</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOrderStore } from '../stores/order'
import type { Order } from '../types';
import ImportOrders from '../components/ImportOrders.vue';
import addIcon from '../assets/icons/add.svg'
import EditOrderPanel from '../components/EditOrderPanel.vue';
import EditAdPanel from '../components/EditAdsPanel.vue';
import EditPaymentPanel from '../components/EditPaymentPanel.vue';
import EditShopifyPanel from '../components/EditShopifyPanel.vue';
import Button from '../components/Button.vue';
import ExportOrders from '../components/ExportOrders.vue';

const isNewOrderPanelOpen = ref(false)
const isNewAdPanelOpen = ref(false)
const isNewPaymentPanelOpen = ref(false)
const isNewShopifyPanelOpen = ref(false)

const order = useOrderStore()

function sumPrixAchat(list: Array<Order>): number {
  return Number((list || []).reduce((acc, item) => {
    const v = Number(item?.prixAchat ?? 0) || 0;
    return acc + v;
  }, 0).toFixed(2));
}

function totalMarge(): number {
  return Number((order.ordersList || []).reduce((acc, item) => {
    const v = Number(item?.prixClient ?? 0) || 0;
    return acc + v;
  }, 0).toFixed(2)) - Number((order.ordersList || []).reduce((acc, item) => {
    const v = Number(item?.prixAchat ?? 0) || 0;
    return acc + v;
  }, 0).toFixed(2));
}

const MS_PER_DAY = 24 * 60 * 60 * 1000
const MS_PER_WEEK = 7 * MS_PER_DAY

function startOfWeekMonday(date: Date) {
  const d = new Date(date)
  const day = (d.getDay() + 6) % 7 // 0 = Monday
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - day)
  return d
}

function formatDateShort(d: Date) {
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

// build 10 week buckets (oldest -> newest)
const weekBuckets = computed(() => {
  const today = new Date()
  const curWeekStart = startOfWeekMonday(today)
  // earliest week start (9 weeks before current)
  const firstWeekStart = new Date(curWeekStart)
  firstWeekStart.setDate(firstWeekStart.getDate() - 9 * 7)

  const buckets: { start: Date; end: Date; key: string; label: string }[] = []
  for (let i = 0; i < 10; i++) {
    const start = new Date(firstWeekStart)
    start.setDate(start.getDate() + i * 7)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    const key = start.toISOString().slice(0, 10) // yyyy-mm-dd
    const label = `${formatDateShort(start)} — ${formatDateShort(end)}`
    buckets.push({ start, end, key, label })
  }
  return buckets
})

// labels for x axis
const categories = computed(() => weekBuckets.value.map(w => w.label))

// series: commandes count and marge sum per week
const series = computed(() => {
  const buckets = weekBuckets.value
  const counts = new Array(buckets.length).fill(0)
  const marges = new Array(buckets.length).fill(0)

  order.ordersList.forEach(item => {
    const dateObj = item.date ? new Date(item.date) : null
    if (!dateObj || isNaN(dateObj.getTime())) return

    // find index: floor((date - firstStart) / week)
    const firstStart = buckets[0].start
    const diff = dateObj.getTime() - firstStart.getTime()
    const index = Math.floor(diff / MS_PER_WEEK)
    if (index < 0 || index >= buckets.length) return

    counts[index] = (counts[index] || 0) + 1
    const marge = Number(item.margeEuro ?? 0)
    marges[index] = Number(((marges[index] || 0) + marge).toFixed(1))
  })

  return [
    { name: 'Commandes (sem)', data: counts },
    { name: 'Marge (€)', data: marges }
  ]
})

// chart options should use the computed categories
const chartOptions = computed(() => ({
  chart: {
    height: 1200,
    type: 'line', // changed to line → pas de zone remplie
    toolbar: { show: false }
  },
  dataLabels: { enabled: false },
  // remove area fill: force no fill and keep a visible stroked line
  fill: { opacity: 0 },
  stroke: { curve: 'smooth', width: 2 }, // ajuster width si besoin
  xaxis: {
    type: 'category',
    categories: categories.value,
    labels: { rotate: -20 }
  }, yaxis: [
    {
      title: { text: 'Commandes' },
      labels: { formatter: (val: number) => String(Math.round(val)) }
    },
    {
      opposite: true,
      title: { text: 'Marge (€)' },
      labels: { formatter: (val: number) => (val / 10).toFixed(1) }
    }
  ],
  tooltip: {
    x: { format: 'dd/MM' },
    y: {
      formatter: (val: number, { seriesIndex }: any) => {
        if (seriesIndex === 1) return `${(val / 10).toFixed(1)} €`
        return String(val)
      }
    }
  },
  legend: {
    show: true,
    itemMargin: { horizontal: 24, vertical: 8 },
    position: 'top',
    horizontalAlign: 'right',
    labels: { colors: 'var(--color-text)' },
  },
  grid: {
    show: true,
    borderColor: 'rgba(255,255,255,0.4)',
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } }
  }
}))
</script>

<style scoped>
.topbar {
  display: flex;
  height: 10rem;
  align-items: end;
  margin-bottom: 1rem;
}

.title-page {
  color: var(--color-text);
  font-weight: bold;
  font-size: 3rem;
  text-align: left;
}

.actions {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-bottom: 1rem;
}

.button-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* 2 colonnes */
  grid-auto-rows: minmax(48px, auto);
  /* hauteur minimale par bouton */
  gap: 2.5rem;
  /* espace entre boutons */
  padding: 0.5rem;
  align-items: stretch;
  justify-items: stretch;
}

.button-action {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 1rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  align-items: start;
}

.graph {
  height: 40rem !important;
}

.grid-card {
  background: var(--color-surface);
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  padding: 1rem 2rem;
}

.card-title {
  color: var(--color-text);
  text-align: left;
  font-size: 1.5rem;
  box-sizing: border-box;
}

.card-info {
  color: var(--color-success);
  font-size: 2rem;
  text-align: left;
  margin-top: 1rem;
  font-style: italic;
}
</style>
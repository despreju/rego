<template>
  <div class="dashboard">
    <div class="topbar">
      <div class="title-page">Dashboard</div>
      <div class="actions">
      </div>
    </div>
    <div class="stats">
      <div class="grid-card" style="grid-column: 1;grid-row: 1">
        <div class="card-title">Nombre de commandes</div>
        <div class="card-info">{{ order.ordersList.length }}</div>
      </div>
      <div class="grid-card" style="grid-column: 2;grid-row: 1">
        <div class="card-title">Rentrée d'argent</div>
        <div class="card-info">---</div>
      </div>
      <div class="grid-card" style="grid-column: 3;grid-row: 1">
        <div class="card-title">Sortie d'argent</div>
        <div class="card-info">---</div>
      </div>
      <div class="grid-card" style="grid-column: 4;grid-row: 1">
        <div class="card-title">Marge totale</div>
        <div class="card-info">---</div>
      </div>
      <div class="graph grid-card"
        style="grid-column-start: 1; grid-column-end: 4; grid-row-start: 2; grid-row-end: 4;">
        <div class="card-title">Commandes sur les 10 dernières semaines</div>
        <apexchart type="area" height="100%" :options="chartOptions" :series="series"></apexchart>
      </div>
      <div class="grid-card" style="grid-column: 4;grid-row: 2">
        <div class="card-title">Dépenses Shopify</div>
        <div class="card-info">---</div>
      </div>
      <div class="grid-card" style="grid-column: 4;grid-row: 3">
        <div class="card-title">Dépenses Pub</div>
        <div class="card-info">---</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore } from '../stores/order'

const order = useOrderStore()

const MS_PER_DAY = 24 * 60 * 60 * 1000
const MS_PER_WEEK = 7 * MS_PER_DAY

function startOfWeekMonday(date: Date) {
  const d = new Date(date)
  // getDay: 0 (Sun) .. 6 (Sat). We want Monday as start => shift
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
  },yaxis: [
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

.action-button {
  margin-left: 2rem;
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
  font-size: 4rem;
  text-align: left;
}
</style>
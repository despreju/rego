<template>
  <div class="dashboard">
    <div class="topbar">
      <div class="title-page">Dashboard</div>
      <div class="actions">
      </div>
    </div>
    <div class="stats">
      <div class="stats-bilan">
        <div>Dépenses Shopify : <span class="stats-value">0 €</span></div>
        <div>Dépenses Autres : <span class="stats-value">0 €</span></div>
        <div>Chiffre d'affaires : <span class="stats-value">0 €</span></div>
        <div>Bénéfice : <span class="stats-value">0 €</span></div>
      </div>
      <div class="stats-curve">
        <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { computed } from 'vue'
import { useOrderStore } from '../stores/order'

const order = useOrderStore()

// Génère les 30 derniers jours (du plus ancien au plus récent)
const last30Days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (29 - i))
  d.setHours(0, 0, 0, 0)
  return d
})
// Prépare les catégories (jj/mm pour ApexCharts)
const categories = last30Days.map(d =>
  d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
)

const series = computed(() => {
  const countByDay: Record<string, number> = {}
  const margeByDay: Record<string, number> = {}

  order.ordersList.forEach(item => {
    let dateObj: Date
    dateObj = item.date
    const key = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    if (categories.includes(key)) {
      countByDay[key] = (countByDay[key] || 0) + 1
      const marge = Number(item.margeEuro ?? 0)
      margeByDay[key] = (margeByDay[key] || 0) + marge
    }
  })

  return [
    {
      name: 'Commandes',
      data: categories.map(key => Math.round(countByDay[key]) || 0)
    },
    {
      name: 'Marge (€)',
      data: categories.map(key => Number((margeByDay[key] || 0).toFixed(1)))
    }
  ]
})

console.log('Series:', series.value)

// Met à jour les catégories de l'axe X
const chartOptions = computed(() => ({
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    type: 'category',
    categories,
    labels: {
      show: false
    },
  },
  yaxis: {
    type: 'category',
    categories,
    labels: {
      show: false
    },
  },
  tooltip: {
    x: {
      format: 'MM-dd'
    }
  },
  legend: {
    show: true,
    position: "top",
    labels: {
      colors: "#fff"
    }
  },
  grid: {
    show: false   // ✅ enlève toutes les grilles
  }
}))
</script>

<style scoped>
.dashboard {}

.topbar {
  display: flex;
  height: 10rem;
  align-items: end;
  margin-bottom: 1rem;
}

.title-page {
  color: rgb(228, 227, 227);
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
  display: flex;
}

.stats-bilan {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem;
  margin-right: 4rem;
}

.stats-curve {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem;
}
</style>
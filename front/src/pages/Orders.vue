<template>
    <NewOrderDrawer :class="newOrderPanelClass" @close="isNewOrderPanelOpen = false" />
    <div class="orders-content" :class="isBlur">
        <div class="topbar">
            <div class="title-page">Commandes</div>
            <div class="actions">
                <ImportOrders class="action-button" />
                <Button class="action-button" @click="isNewOrderPanelOpen = true">
                    Ajouter une commande
                </Button>
            </div>
        </div>
        <div class="table-info"><strong>{{ formattedData.length }}</strong> résultats</div>
        <div class="table-head">
            <div v-for="(column, index) in columns" :key="index" :style="{ width: column.size + '%' }">
                {{ column.title }}
                <div v-if="column.filter" class="filter" @click="filter(index)">
                    <arrow_down class="filter-icon" v-if="column.filter === 'up'" />
                    <arrow_up class="filter-icon" v-else-if="column.filter === 'down'" />
                    <filterIcon class="filter-icon" v-else />
                </div>
            </div>
        </div>
        <div v-for="(data, index) in formattedData" :key="index">
            <div class="table-row">
                <div class="table-row__id">
                    <money style="width: 40px;" class="w-2 h-2 text-red-500" v-if="data.categorie === 'Commandes'" />
                    <shopify style="width: 48px; fill: white;" class="w-2 h-2 text-red-500" v-else-if="data.categorie === 'Shopify'" />
                    <unknowIcon style="width: 48px; fill: white;" class="w-2 h-2 text-red-500" v-else />
                    <div>
                        <div>#{{ data.id }}</div>
                        <div class="table-row__date">{{ format(data.date, 'dd/MM/yyyy') }}</div>
                    </div>
                </div>
                <div class="table-row__categorie">
                    <Tag :icon="data.categorie === 'Shopify' ? shopify : data.categorie === 'Commandes' ? money : unknowIcon" 
                         :color="data.categorie === 'Shopify' ? 'green' : data.categorie === 'Commandes' ? 'orange' : 'blue'">{{ data.categorie }}</Tag>
                </div>
                <div class="table-row__prixClient">{{ data.prixClient }} €</div>
                <div class="table-row__prixAchat">{{ data.prixAchat }} €</div>
                <div class="table-row__margeEuro">{{ data.margeEuro }} €</div>
                <div class="table-row__margePercent">{{ data.margePercent }} %</div>
                <div class="table-row__commentaire">{{ data.commentaire }}</div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ImportOrders from '../components/ImportOrders.vue';
import { useOrderStore } from '../stores/order'
import money from '../assets/icons/money.svg'
import arrow_up from '../assets/icons/arrow_up.svg'
import arrow_down from '../assets/icons/arrow_down.svg'
import shopify from '../assets/icons/shopify.svg'
import filterIcon from '../assets/icons/filter.svg'
import unknowIcon from '../assets/icons/unknow.svg'
import Button from '../components/Button.vue';
import Tag from '../components/Tag.vue';
import NewOrderDrawer from '../components/NewOrderDrawer.vue';
import { format } from 'date-fns'

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
const columns = ref([
    { title: '# ID', size: 20, filter: 'down' },
    { title: 'Catégorie', size: 10 },
    { title: 'Prix Client', size: 10, filter: 'none' },
    { title: 'Prix Achat', size: 10, filter: 'none' },
    { title: 'Marge €', size: 10, filter: 'none' },
    { title: 'Marge %', size: 10, filter: 'none' },
    { title: 'Commentaire', size: 20 },
])

function filter(index: number) {
    columns.value.forEach((col, i) => {
        if (i === index) {
            col.filter = col.filter === 'up' ? 'down' : 'up'
        } else if ('filter' in col) {
            col.filter = 'none'
        }
    })
}

const formattedData = computed<TransformedItem[]>(() => {
    const columnKeys = [
        'id',
        'categorie',
        'prixClient',
        'prixAchat',
        'margeEuro',
        'margePercent',
        'commentaire'
    ] as const;

    const list = Array.isArray(order.ordersList) ? order.ordersList.slice() : [];

    const activeColumn = columns.value.find(col => col.filter === 'up' || col.filter === 'down');
    if (!activeColumn) return list as unknown as TransformedItem[];

    const colIndex = columns.value.indexOf(activeColumn);
    if (colIndex < 0 || colIndex >= columnKeys.length) return list as unknown as TransformedItem[];

    const sortKey = columnKeys[colIndex] as string;

    // copie pour ne pas muter store
    const sorted = list.slice().sort((a, b) => {
        const aRaw = (a as any)[sortKey];
        const bRaw = (b as any)[sortKey];

        // gérer numériques vs chaines
        const numericKeys = ['prixClient', 'prixAchat', 'margeEuro', 'margePercent', 'id'];
        let aValue: number | string = aRaw ?? '';
        let bValue: number | string = bRaw ?? '';

        if (numericKeys.includes(sortKey)) {
            aValue = Number(aValue) || 0;
            bValue = Number(bValue) || 0;
        } else {
            aValue = String(aValue);
            bValue = String(bValue);
        }

        if (aValue < bValue) return activeColumn.filter === 'up' ? -1 : 1;
        if (aValue > bValue) return activeColumn.filter === 'up' ? 1 : -1;
        return 0;
    });

    // si TransformedItem diffère du type d'origine, transforme ici ; sinon cast
    return sorted as unknown as TransformedItem[];
});

const isNewOrderPanelOpen = ref(false)

const newOrderPanelClass = computed(() => ({
    'new-order-panel': true,
    '-open': isNewOrderPanelOpen.value
}))

const isBlur = computed(() => ({
    '-blur': isNewOrderPanelOpen.value
}))
</script>

<style scoped>
.new-order-panel.-open {
    width: 30%;
    transition: all 0.15s ease-in-out;
    box-shadow: -8px 0 16px -8px rgba(0, 0, 0, 0.25);
    padding: 2rem 4rem;
}

.orders-content {
    filter: blur(0px);
    transition: all 0.15s ease-in-out;
}

.orders-content.-blur {
    filter: blur(4px);
    pointer-events: none;
    user-select: none;
    transition: all 0.15s ease-in-out;
}

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

.table-info {
    text-align: left;
    font-style: italic;
    color: #c7c7c7;
    margin-bottom: 0.25rem;
}

.table-head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #32323B;
    color: #c7c7c7;
    border-radius: 1rem;
    margin-bottom: 0.5rem;
    padding: 1rem 1rem;
    font-size: 0.85rem;
}

* .table-head>div:first-child {
    padding-left: 3.5rem;
    justify-content: start;
}

.table-head>div {
    display: flex;
    justify-content: end;
}

.filter {
    cursor: pointer;
}

.filter-icon {
    width: 16px;
    margin-left: 1rem;
    fill: white;
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
    border-radius: 1rem;
    margin-bottom: 0.5rem;
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

.table-row__id>div {
    margin-left: 1rem;
    display: flex;
    flex-direction: column;
    width: 20%;
    text-align: left;
}

.table-row__date {
    color: #808187;
    font-style: italic;
}

.table-row__categorie {
    display: flex;
    justify-content: end;
    width: 10%;
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
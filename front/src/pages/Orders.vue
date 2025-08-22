<template>
    <EditOrderPanel v-if="isNewOrderPanelOpen" @close="isNewOrderPanelOpen = false; orderToEdit = null"
        :order="orderToEdit" />
    <DeleteOrderPanel v-if="idOrderToDelete !== null" :orderId="idOrderToDelete" @close="idOrderToDelete = null" />
    <div class="orders-content">
        <div class="topbar">
            <div class="title-page">Commandes</div>
            <div class="actions">
                <ImportOrders class="action-button" />
                <Button color="blue" class="action-button" @click="isNewOrderPanelOpen = true" :icon="addIcon"
                    msg="Ajouter une commande" />
            </div>
        </div>
        <div class="table-info"><strong>{{ formattedData.length }}</strong> résultats</div>
        <div class="table-head">
            <div v-for="(column, index) in columns" :class="column.title" :key="index"
                :style="{ width: column.size + '%' }">
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
                    <warning v-if="data.watch" class="data-watch__warning" />
                    <success v-else class="data-watch__success" />
                    <money style="width: 40px;" class="w-2 h-2 text-red-500" v-if="data.categorie === 'Commandes'" />
                    <shopify style="width: 48px; fill: white;" class="w-2 h-2 text-red-500"
                        v-else-if="data.categorie === 'Shopify'" />
                    <unknowIcon style="width: 48px; fill: white;" class="w-2 h-2 text-red-500" v-else />
                    <div>
                        <div>#{{ data.orderId }}</div>
                        <div class="table-row__date">{{ format(data.date, 'dd/MM/yyyy') }}</div>
                    </div>
                </div>
                <div class="table-row__categorie">
                    <Tag :icon="data.categorie === 'Shopify' ? shopify : data.categorie === 'Commandes' ? money : unknowIcon"
                        :color="data.categorie === 'Shopify' ? 'green' : data.categorie === 'Commandes' ? 'orange' : 'blue'">
                        {{ data.categorie }}</Tag>
                </div>
                <div class="table-row__prixClient">{{ data.prixClient }} €</div>
                <div class="table-row__prixAchat">{{ data.prixAchat }} €</div>
                <div class="table-row__margeEuro">{{ data.margeEuro }} €</div>
                <div class="table-row__margePercent">{{ data.margePercent }} %</div>
                <div class="table-row__commentaire">{{ data.commentaires }}</div>
                <div class="table-row__data-actions">
                    <Button @click="editOrder(data)" :icon="edit"></Button>
                    <Button :icon="history"></Button>
                    <Button :icon="comments"></Button>
                    <Button color="red" @click="idOrderToDelete = data.orderId" :icon="deleteIcon"></Button>
                </div>
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
import edit from '../assets/icons/edit.svg'
import deleteIcon from '../assets/icons/delete.svg'
import shopify from '../assets/icons/shopify.svg'
import filterIcon from '../assets/icons/filter.svg'
import unknowIcon from '../assets/icons/unknow.svg'
import Button from '../components/Button.vue';
import Tag from '../components/Tag.vue';
import EditOrderPanel from '../components/EditOrderPanel.vue';
import DeleteOrderPanel from '../components/DeleteOrderPanel.vue';
import { format } from 'date-fns'
import type { Order, OrderToDisplay } from '../types/index.ts';
import addIcon from '../assets/icons/add.svg'
import history from '../assets/icons/history.svg'
import comments from '../assets/icons/comments.svg'
import success from '../assets/icons/success.svg'
import warning from '../assets/icons/warning.svg'

const order = useOrderStore()

// Définition des colonnes
const columns = ref([
    { title: 'ID', size: 10, filter: 'down' },
    { title: 'Catégorie', size: 10 },
    { title: 'Prix Client', size: 10, filter: 'none' },
    { title: 'Prix Achat', size: 10, filter: 'none' },
    { title: 'Marge €', size: 10, filter: 'none' },
    { title: 'Marge %', size: 10, filter: 'none' },
    { title: 'Commentaire', size: 25 },
    { title: '', size: 10 },
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

const formattedData = computed<OrderToDisplay[]>(() => {
    const columnKeys = [
        'orderId',
        'categorie',
        'prixClient',
        'prixAchat',
        'margeEuro',
        'margePercent',
        'commentaire'
    ] as const;

    const list = Array.isArray(order.ordersList) ? order.ordersList.slice() : [];

    const activeColumn = columns.value.find(col => col.filter === 'up' || col.filter === 'down');
    if (!activeColumn) return list as unknown as OrderToDisplay[];

    const colIndex = columns.value.indexOf(activeColumn);
    if (colIndex < 0 || colIndex >= columnKeys.length) return list as unknown as OrderToDisplay[];

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

    return sorted as unknown as OrderToDisplay[];
});

const orderToEdit = ref<Order | null>(null);

const editOrder = (data: OrderToDisplay) => {
  const targetId = String(data.orderId);
  const matched = order.ordersList.find(o => {
    if (o._id !== undefined && o._id !== null) {
      if (String(o._id) === targetId) return true;
    }
    if ((o as any).orderId !== undefined && (o as any).orderId !== null) {
      if (String((o as any).orderId) === targetId) return true;
    }
    if ((o as any)._id && String((o as any)._id) === targetId) return true;
    return false;
  }) ?? null;
  if (!matched) {
    return;
  }
  orderToEdit.value = matched as Order;
  isNewOrderPanelOpen.value = true;
}

const isNewOrderPanelOpen = ref(false)
const idOrderToDelete = ref<number | null>(null)
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
    color: var(--color-text);
}

.action-button {
    margin-left: 2rem;
}

.table-info {
    text-align: left;
    font-style: italic;
    color: var(--color-text);
    margin-bottom: 0.25rem;
}

.table-head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-surface);
    color: var(--color-text);
    border-radius: 1rem;
    margin-bottom: 0.5rem;
    padding: 1rem 1rem;
    font-size: 0.85rem;
}

.table-head>div.Commentaire {
    padding-left: 5rem;
    justify-content: start;
}

.table-head>div {
    display: flex;
    justify-content: end;
}

.table-head>.ID {
    padding-left: 5rem;
    justify-content: start !important;
}

.filter {
    cursor: pointer;
}

.filter-icon {
    width: 16px;
    margin-left: 1rem;
    fill: var(--color-text);
}

.table-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: var(--color-surface);
    color: var(--color-text);
    border-radius: 1rem;
    margin-bottom: 0.5rem;
    padding: 1rem 1rem;
}

.data-watch__success {
    width: 32px;
    height: 32px;
    fill: var(--color-bg);
    background: var(--color-success);
    border-radius: 100%;
    margin-right: 2rem;
    margin-left: 1rem;
}

.data-watch__warning {
    width: 32px;
    height: 32px;
    fill: var(--color-bg);
    background: var(--color-error);
    border-radius: 100%;
    margin: 0 1rem;
    margin-right: 2rem;
    margin-left: 1rem;
}

.table-row__id {
    display: flex;
    width: 10%;
    align-items: center;
}

.table-row__id>div {
    margin-left: 1rem;
    display: flex;
    flex-direction: column;
    width: 15%;
    text-align: left;
}

.table-row__date {
    color: var(--color-text);
    font-style: italic;
}

.table-row__categorie {
    display: flex;
    justify-content: end;
    width: 10%;
}

.table-row__prixClient {
    text-align: right;
    color: var(--color-text);
    font-weight: bold;
    width: 10%
}

.table-row__prixAchat {
    text-align: right;
    color: var(--color-text);
    font-weight: bold;
    width: 10%;
}

.table-row__margeEuro {
    text-align: right;
    color: var(--color-success);
    font-weight: bold;
    width: 10%;
}

.table-row__margePercent {
    text-align: right;
    color: var(--color-success);
    font-weight: bold;
    width: 10%;
}

.table-row__commentaire {
    padding-left: 5rem;
    width: 25%;
    color: var(--color-text);
    font-style: italic;
    text-align: left;
}

.table-row__data-actions {
    display: flex;
    width: 10%;
    justify-content: end;
    color: var(--color-text);
    gap: 1rem;
}

.actions-icons {
    width: 3rem;
    height: 3rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all .18s ease;
    box-sizing: border-box;
    background: var(--color-bg);
    border-radius: 12px;
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.03), inset 0 0 0 rgba(0, 0, 0, 0.6), inset 0 0 0 rgba(255, 255, 255, 0.02);
    transition: box-shadow .10s ease, transform .10s ease;
}

.actions-icons:hover {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.4), 0 0 0 rgba(255, 255, 255, 0.03), inset 4px 4px 10px rgba(0, 0, 0, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.02);
    transform: translateY(1px);
    transition: box-shadow .10s ease, transform .10s ease;
}
</style>
<template>
    <EditOrderPanel v-if="isNewOrderPanelOpen" @close="isNewOrderPanelOpen = false; orderToEdit = null"
        :order="orderToEdit" />
    <DeleteOrderPanel v-if="idOrderToDelete !== null" :orderId="idOrderToDelete" @close="idOrderToDelete = null" />
    <CommentsPanel v-if="openCommentsPanel !== null"
        :order="formattedData.find(order => order._id === openCommentsPanel)" @close="openCommentsPanel = null" />
    <HistoryPanel v-if="openHistoryPanel !== null" :order="formattedData.find(order => order._id === openHistoryPanel)"
        @close="openHistoryPanel = null" />

    <div class="orders-content">
        <div class="topbar">
            <div class="title-page">Commandes</div>
            <div class="actions">
                <Input class="search-input" type="text" placeholder="Rechercher ..." v-model="search" />
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
                    <money style="width: 40px; fill: var(--color-text)" class="w-2 h-2 text-red-500" />
                    <div>
                        <div>#{{ data.orderId }}</div>
                        <div class="table-row__date"></div>
                    </div>
                </div>
                <div class="table-row__categorie">
                    {{ format(data.date, 'dd/MM/yyyy') }}
                </div>
                <div class="table-row__prixClient">{{ data.prixClient }} €</div>
                <div class="table-row__prixAchat">{{ data.prixAchat }} €</div>
                <div class="table-row__margeEuro">{{ data.margeEuro }} €</div>
                <div class="table-row__margePercent">{{ data.margePercent }} %</div>
                <div class="table-row__data-actions">
                    <Button @click="editOrder(data)" :icon="edit"></Button>
                    <Button @click="openHistoryPanel = data._id" :icon="history">
                        <Badge type="primary">{{ data.history?.length }}</Badge>
                    </Button>
                    <Button @click="openCommentsPanel = data._id" :icon="comments">
                        <Badge type="primary">{{ data.commentaires?.length }}</Badge>
                    </Button>
                    <Button color="red" @click="idOrderToDelete = data._id" :icon="deleteIcon"></Button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CommentsPanel from '../components/CommentsPanel.vue';
import { useOrderStore } from '../stores/order'
import money from '../assets/icons/money.svg'
import arrow_up from '../assets/icons/arrow_up.svg'
import arrow_down from '../assets/icons/arrow_down.svg'
import edit from '../assets/icons/edit.svg'
import deleteIcon from '../assets/icons/delete.svg'
import filterIcon from '../assets/icons/filter.svg'
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import EditOrderPanel from '../components/EditOrderPanel.vue';
import DeleteOrderPanel from '../components/DeleteOrderPanel.vue';
import { format } from 'date-fns'
import type { Order } from '../types/index.ts';
import addIcon from '../assets/icons/add.svg'
import history from '../assets/icons/history.svg'
import comments from '../assets/icons/comments.svg'
import success from '../assets/icons/success.svg'
import warning from '../assets/icons/warning.svg'
import Badge from '../components/Badge.vue'
import HistoryPanel from '../components/HistoryPanel.vue';

const order = useOrderStore()

const columns = ref([
    { title: 'ID', size: 15, filter: 'down' },
    { title: 'DATE', size: 10, filter: 'none' },
    { title: 'PRIX CLIENT', size: 10, filter: 'none' },
    { title: 'PRIX ACHAT', size: 10, filter: 'none' },
    { title: 'MARGE €', size: 10, filter: 'none' },
    { title: 'MARGE %', size: 10, filter: 'none' },
    { title: '', size: 30 },
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

const search = ref('');

const formattedData = computed<Order[]>(() => {
    const columnKeys = [
        'orderId',
        'date',
        'prixClient',
        'prixAchat',
        'margeEuro',
        'margePercent',
        'commentaire'
    ] as const;

    const list = Array.isArray(order.ordersList) ? order.ordersList.slice() : [];

    // --- FILTER ---
    const q = String(search.value ?? '').trim().toLowerCase();
    const filtered = q.length === 0 ? list : list.filter(o => {
        // build a searchable string containing relevant fields
        const parts: string[] = [];

        if (o._id) parts.push(String(o._id));
        if (o.orderId !== undefined) parts.push(String(o.orderId));
        if (o.categorie) parts.push(String(o.categorie));
        if (o.prixClient !== undefined) parts.push(String(o.prixClient));
        if (o.prixAchat !== undefined) parts.push(String(o.prixAchat));
        if (o.margeEuro !== undefined) parts.push(String(o.margeEuro));
        if (o.margePercent !== undefined) parts.push(String(o.margePercent));
        if (o.date) {
            try {
                parts.push(format(new Date(o.date), 'dd/MM/yyyy'));
            } catch (e) { parts.push(String(o.date)); }
        }

        // commentaires : array of objects or string
        if (Array.isArray((o as any).commentaires)) {
            for (const c of (o as any).commentaires) {
                if (c?.commentaire) parts.push(String(c.commentaire));
                if (c?.user_id !== undefined) parts.push(String(c.user_id));
            }
        } else if ((o as any).commentaire) {
            parts.push(String((o as any).commentaire));
        }

        // history entries
        if (Array.isArray((o as any).history)) {
            for (const h of (o as any).history) {
                if (h?.action) parts.push(String(h.action));
                if (h?.user_id !== undefined) parts.push(String(h.user_id));
            }
        }

        const hay = parts.join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
    });

    // --- SORT (same logic as before, applied on filtered list) ---
    const activeColumn = columns.value.find(col => col.filter === 'up' || col.filter === 'down');
    if (!activeColumn) return filtered as unknown as Order[];

    const colIndex = columns.value.indexOf(activeColumn);
    if (colIndex < 0 || colIndex >= columnKeys.length) return filtered as unknown as Order[];

    const sortKey = columnKeys[colIndex] as string;
    const direction = activeColumn.filter === 'up' ? 1 : -1;

    const numericKeys = ['prixClient', 'prixAchat', 'margeEuro', 'margePercent', 'orderId', 'id'];

    const sorted = filtered.slice().sort((a, b) => {
        let aRaw = (a as any)[sortKey];
        let bRaw = (b as any)[sortKey];

        if (aRaw === undefined || aRaw === null) aRaw = '';
        if (bRaw === undefined || bRaw === null) bRaw = '';

        if (sortKey === 'date') {
            const aTime = aRaw ? new Date(aRaw).getTime() : 0;
            const bTime = bRaw ? new Date(bRaw).getTime() : 0;
            if (aTime < bTime) return -1 * direction;
            if (aTime > bTime) return 1 * direction;
            return 0;
        }

        if (numericKeys.includes(sortKey)) {
            const aNum = Number(aRaw) || 0;
            const bNum = Number(bRaw) || 0;
            if (aNum < bNum) return -1 * direction;
            if (aNum > bNum) return 1 * direction;
            return 0;
        }

        const aStr = String(aRaw);
        const bStr = String(bRaw);
        return aStr.localeCompare(bStr) * direction;
    });

    return sorted as unknown as Order[];
});

const orderToEdit = ref<Order | null>(null);

const editOrder = (data: Order) => {
    const targetId = String(data._id);
    const matched = order.ordersList.find(o => {
        if (o._id !== undefined && o._id !== null) {
            if (String(o._id) === targetId) return true;
        }
        if ((o as any)._id !== undefined && (o as any)._id !== null) {
            if (String((o as any)._id) === targetId) return true;
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
const idOrderToDelete = ref<string | null>(null)
const openCommentsPanel = ref<string | null>(null)
const openHistoryPanel = ref<string | null>(null)
</script>

<style scoped>
.topbar {
    display: flex;
    height: 7rem;
    align-items: end;
    margin-bottom: 1rem;
}

.title-page {
    color: var(--color-text);
    font-weight: bold;
    font-size: 3rem;
    text-align: left;
        width: 100%;
}

.actions {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    color: var(--color-text);
    width: 100%;
    justify-content: end;
}

.search-input {
    display: flex;
    flex-direction: column;
    width: 30rem;
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
    color: var(--color-text-secondary);
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
    padding-left: 8.5rem;
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
    width: 15%;
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
    width: 30%;
    justify-content: end;
    color: var(--color-text);
    gap: 2rem;
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
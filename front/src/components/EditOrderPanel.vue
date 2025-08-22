<template>
    <Panel>
        <div class="panel-title"> {{ title }}</div>
        <div class="new-order-panel__row">
            <Input class="order-input" label="ID" type="number" placeholder="0000" v-model="formOrder.id" />
            <span style="width:10%"></span>
            <Input class="order-input" label="Date" type="date" placeholder="jj-mm-aaaa" v-model="dateString" />
        </div>
        <div class="new-order-panel__row">
            <Input class="order-input" label="Prix client (€)" type="number" placeholder="0"
                v-model="formOrder.clientPrice" />
            <span style="width:10%"></span>
            <Input class="order-input" label="Prix achat (€)" type="number" placeholder="0"
                v-model="formOrder.ourPrice" />
        </div>

        <Input class="order-input" label="Catégories" type="text" placeholder="" v-model="formOrder.category" />
        <Input class="order-input" label="Commentaire" type="text" placeholder="" v-model="formOrder.commentary" />
        <div style="margin-top: auto;">
            <div class="actions-bar">
                <Button color="green" @click="onSaveOrder" v-if="!isLoading && !props.order" msg="Ajouter" />
                <Button color="green" @click="onUpdateOrder" v-if="!isLoading && props.order" msg="Mettre à jour" />
                <Button color="grey" @click="emit('close')" v-if="!isLoading" msg="Annuler" />
                <Loading v-else />
            </div>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import Loading from '../assets/icons/loading.svg';
import { computed, onMounted, ref } from 'vue'
import { useOrderStore } from '../stores/order';
import { saveOrder, updateOrder, getOrders } from '../api/orderApi';
import { useError } from '../composables/useError'
import type { ApiError } from '../api/axios';
import Panel from './Panel.vue';
import type { TransformedItem } from '../types/index.ts';
import { useToast } from '../composables/useToast.ts';

const props = defineProps<{ order: TransformedItem | null }>()

const emit = defineEmits(['close'])
const { handleApiError } = useError()
const apiErr = ref<ApiError | null>(null)

const formOrder = ref<{
    id: number,
    clientPrice: number,
    ourPrice: number,
    commentary: string,
    category: string,
    date: Date
}>({
    id: 0,
    clientPrice: 0,
    ourPrice: 0,
    commentary: '',
    category: 'Commandes',
    date: new Date()
})

const dateString = computed({
    get() {
        return formOrder.value.date
            ? formOrder.value.date.toISOString().split('T')[0]
            : ''
    },
    set(val: string) {
        formOrder.value.date = val ? new Date(val) : new Date(0);
    }
})

const isLoading = ref(false);

const fetchOrders = async () => {
    try {
        await getOrders()
    } catch (e) {
        apiErr.value = handleApiError(e)
    }
};


const onSaveOrder = async () => {
    isLoading.value = true;
    try {
        await saveOrder({
            id: formOrder.value.id,
            prixClient: formOrder.value.clientPrice,
            prixAchat: formOrder.value.ourPrice,
            commentaire: formOrder.value.commentary,
            date: formOrder.value.date,
            categorie: formOrder.value.category
        })
        await fetchOrders()        
        const { showToast } = useToast()
        showToast('Commande ajoutée', 'success')
    } catch (e) {
        apiErr.value = handleApiError(e)
    } finally {
        isLoading.value = false
        emit('close')
    }
}

const onUpdateOrder = async () => {
    isLoading.value = true;
    try {
        await updateOrder({
            id: formOrder.value.id,
            prixClient: formOrder.value.clientPrice,
            prixAchat: formOrder.value.ourPrice,
            commentaire: formOrder.value.commentary,
            date: formOrder.value.date,
            categorie: formOrder.value.category
        })
        await fetchOrders()        
        const { showToast } = useToast()
        showToast('Commande mise à jour', 'success')
    } catch (e) {
        apiErr.value = handleApiError(e)
    } finally {
        isLoading.value = false
        emit('close')
    }
}

const order = useOrderStore()
function getLastId() {
    if (!order.ordersList.length) return 1
    // On récupère le plus grand id numérique de la liste
    return Math.max(...order.ordersList.map(o => Number(o.id) || 0)) + 1
}

const title = ref<string>('Ajouter une nouvelle commande')

onMounted(() => {
    if (props.order) {
        title.value = 'Modifier la commande'
        formOrder.value = {
            id: props.order.id,
            clientPrice: props.order.prixClient,
            ourPrice: props.order.prixAchat,
            commentary: props.order.commentaire,
            category: props.order.categorie,
            date: new Date(props.order.date)
        };
    } else {
        formOrder.value = {
            id: getLastId(),
            clientPrice: 0,
            ourPrice: 0,
            commentary: '',
            category: 'Commandes',
            date: new Date()
        };
    }
});
</script>

<style scoped>
.new-order-panel__row {
    display: flex;
    width: 100%;
}

.panel-title {
    font-size: 1.5rem;
    color: var(--color-text);
    margin-bottom: 3rem;
}

.actions-bar {
    display: flex;
    justify-content: space-around;
}

.order-input {
    margin-bottom: 2rem;
}
</style>
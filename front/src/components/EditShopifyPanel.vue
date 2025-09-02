<template>
    <Panel>
        <div class="panel-title"> {{ title }}</div>
        <div class="new-order-panel__row">
            <Input class="order-input" label="Date" type="date" placeholder="jj-mm-aaaa" v-model="dateString" />
        </div>
        <div class="new-order-panel__row">
            <Input class="order-input" label="Prix achat (€)" type="number" placeholder="0"
                v-model="formOrder.ourPrice" />
        </div>

        <Input class="order-input" label="Ajouter un commentaire" type="text" placeholder=""
            v-model="formOrder.commentary" />
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
import { useAuthStore } from '../stores/auth.ts';
import { saveOrder, updateOrder, getOrders } from '../api/orderApi.ts';
import { useError } from '../composables/useError.ts'
import type { ApiError } from '../api/axios.ts';
import Panel from './Panel.vue';
import type { Order } from '../types/index.ts';
import { useToast } from '../composables/useToast.ts';

const props = defineProps<{ order: Order | null }>()

const emit = defineEmits(['close'])
const { handleApiError } = useError()
const apiErr = ref<ApiError | null>(null)

const formOrder = ref<{
    id: string,
    orderId: number,
    clientPrice: number,
    ourPrice: number,
    commentary: string,
    category: string,
    date: Date,
    watch: boolean
}>({
    id: '',
    orderId: 0,
    clientPrice: 0,
    ourPrice: 30,
    commentary: '',
    category: 'Shopify',
    date: new Date(),
    watch: false
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

const auth = useAuthStore()

const onSaveOrder = async () => {
    isLoading.value = true;
    try {
        await saveOrder({
            _id: formOrder.value.id,
            orderId: formOrder.value.orderId,
            prixClient: formOrder.value.clientPrice,
            prixAchat: formOrder.value.ourPrice,
            commentaires: formOrder.value.commentary,
            date: formOrder.value.date,
            categorie: formOrder.value.category,
            watch: formOrder.value.watch,
            user_id: auth.user._id,
            history: "Création"
        })
        await fetchOrders()
        const { showToast } = useToast()
        showToast('Paiment Shopify ajoutée', 'success')
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
            _id: formOrder.value.id,
            orderId: formOrder.value.orderId,
            prixClient: formOrder.value.clientPrice,
            prixAchat: formOrder.value.ourPrice,
            commentaires: formOrder.value.commentary,
            date: formOrder.value.date,
            categorie: formOrder.value.category,
            watch: formOrder.value.watch,
            user_id: auth.user?._id,
            history: getHistoryAction()
        })
        await fetchOrders()
        const { showToast } = useToast()
        showToast('Paiment Shopify mise à jour', 'success')
    } catch (e) {
        apiErr.value = handleApiError(e)
    } finally {
        isLoading.value = false
        emit('close')
    }
}

const title = ref<string>('Ajouter un paiement Shopify')

const getHistoryAction = () => {
    return `Mise à jour`
}

onMounted(() => {
    if (props.order) {
        title.value = 'Modifier le paiement Shopify'
        formOrder.value = {
            id: props.order._id,
            orderId: props.order.orderId,
            clientPrice: props.order.prixClient,
            ourPrice: props.order.prixAchat,
            commentary: '',
            category: props.order.categorie,
            date: new Date(props.order.date),
            watch: props.order.watch
        };
    } else {
        formOrder.value = {
            id: '',
            orderId: 0,
            clientPrice: 0,
            ourPrice: 30,
            commentary: '',
            category: 'Shopify',
            date: new Date(),
            watch: false
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
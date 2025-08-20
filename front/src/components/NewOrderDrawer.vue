<template>
    <div class="new-order-panel">
        <div class="panel-title">Ajouter une nouvelle commande</div>
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
        <div class="actions-bar">
            <Button color="grey" @click="onSaveOrder" v-if="!isLoading">Ajouter</Button>
            <Button color="red" @click="emitClose" v-if="!isLoading">Annuler</Button>
            <Loading v-else/>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import Loading from '../assets/icons/loading.svg';
import { computed, onMounted, ref } from 'vue'
import { useOrderStore } from '../stores/order';
import { saveOrder } from '../api/orderService';

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

const onSaveOrder = () => {
    isLoading.value = true;
    saveOrder({
        id: formOrder.value.id,
        prixClient: formOrder.value.clientPrice,
        prixAchat: formOrder.value.ourPrice,
        commentaire: formOrder.value.commentary,
        date: formOrder.value.date,
        categorie: formOrder.value.category
    }).then(() => {
        emitClose();
    }).finally(() => {
        isLoading.value = false;
    });
};

const emit = defineEmits(['close'])
function emitClose() {
    emit('close')
}

const order = useOrderStore()
function getLastId() {
    if (!order.ordersList.length) return 1
    // On récupère le plus grand id numérique de la liste
    return Math.max(...order.ordersList.map(o => Number(o.id) || 0)) + 1
}

onMounted(() => {
    formOrder.value = {
        id: getLastId(),
        clientPrice: 0,
        ourPrice: 0,
        commentary: '',
        category: 'Commandes',
        date: new Date()
    };
});
</script>

<style scoped>
.new-order-panel {
    position: fixed;
    display: none;
    top: 100%;
    right: 0;
    left: 0;
    bottom: 0;
    margin: 10% 30%;
    padding: 4rem;
    background-color: #1C1B20;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    box-shadow: -8px 0 16px -8px rgba(0, 0, 0, 0.25);
    padding: 2rem 4rem;
}

.new-order-panel__row {
    display: flex;
    width: 100%;
}

.panel-title {
    font-size: 1.5rem;
    color: rgb(228, 227, 227);
    margin-bottom: 5rem;
    text-align: left;
}

.actions-bar {
    display: flex;
    justify-content: space-around;
    margin-top: auto;
}

.order-input {
    margin-bottom: 2rem;
}
</style>
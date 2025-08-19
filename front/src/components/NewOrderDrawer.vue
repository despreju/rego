<template>
    <div class="new-order-panel">
        <div class="panel-title">Ajouter une nouvelle commande</div>
        <Input class="order-input" label="ID" type="number" placeholder="0000" v-model="formOrder.id" />
        <Input class="order-input" label="Date" type="date" placeholder="jj-mm-aaaa" v-model="dateString"/>
        <Input class="order-input" label="Prix client (€)" type="number" placeholder="0" v-model="formOrder.clientPrice" />
        <Input class="order-input" label="Prix achat (€)" type="number" placeholder="0" v-model="formOrder.ourPrice" />
        <Input class="order-input" label="Catégories" type="text" placeholder="" v-model="formOrder.category" />
        <Input class="order-input" label="Commentaire" type="text" placeholder="" v-model="formOrder.commentary" />
        <div class="actions-bar">
            <Button @click="saveOrder">Ajouter</Button>
            <Button color="red" @click="emitClose">Annuler</Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import { useSaveOrder } from '../composables/useOrder';

import { computed, defineEmits, onMounted, ref } from 'vue'
import { useOrderStore } from '../stores/order';

const formOrder = ref<{
    id: number,
    clientPrice: number,
    ourPrice: number,
    commentary: string,
    category: string,
    date: Date | null
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
        formOrder.value.date = val ? new Date(val) : null
    }
})

const saveOrderMutation = useSaveOrder();

const saveOrder = () => {
    saveOrderMutation.mutate({
        id: formOrder.value.id,
        prixClient: formOrder.value.clientPrice,
        prixAchat: formOrder.value.ourPrice,
        commentaire: formOrder.value.commentary,
        date: formOrder.value.date,
        categorie: 'TEST'
    });
    emitClose();
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
    top: 0;
    right: 0;
    width: 0%;
    height: 100%;
    background-color: #1C1B20;
    z-index: 1000;
    transition: all 0.15s ease-in-out;
    display: flex;
    flex-direction: column;
}

.order-input {
    margin-bottom: 1rem;
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
</style>
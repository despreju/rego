<template>
    <Panel>
        <div class="message">
            Etes-vous sur de vouloir supprimer la commande
            <span class="order-id"># {{ props.orderId }}</span> ?
        </div>
        <div>
            <div class="actions-bar">
                <Button color="red" @click="onDeleteOrder" v-if="!isLoading" msg="Supprimer" />
                <Button color="grey" @click="close" v-if="!isLoading" msg="Annuler" />
                <Loading v-else />
            </div>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import Button from '../components/Button.vue';
import Loading from '../assets/icons/loading.svg';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getOrders, removeOrder } from '../api/orderApi';
import { useError } from '../composables/useError'
import type { ApiError } from '../api/axios';
import Panel from './Panel.vue';
import { useToast } from '../composables/useToast';

const { handleApiError } = useError()
const apiErr = ref<ApiError | null>(null)

const props = defineProps<{
    orderId: string;
}>();
const emit = defineEmits(['close']);


const isLoading = ref(false);

function close() {
    emit('close');
}

const fetchOrders = async () => {
    try {
        await getOrders()
    } catch (e) {
        apiErr.value = handleApiError(e)
    }
};

const onDeleteOrder = async () => {
    try {
        isLoading.value = true;
        await removeOrder(props.orderId)
        await fetchOrders()        
        const { showToast } = useToast()
        showToast('Commande supprimée', 'success')
    } catch (e) {
        apiErr.value = handleApiError(e)
    } finally {
        emit('close');
        isLoading.value = false
    }
};

// prevent background scroll while panel is open
onMounted(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // restore on unmount
    onBeforeUnmount(() => {
        document.body.style.overflow = prev || '';
    });
});
</script>

<style scoped>
.message {
    color: var(--color-text);
    font-size: 1.25rem;
}

.order-id {
    color: var(--color-text);
    background: var(--color-surface);
    padding: 0.3rem 0.3rem;
    border-radius: 6px;
}

/* Actions */
.actions-bar {
    display: flex;
    margin-top: 2rem;
    justify-content: space-around;
    align-items: center;
}
</style>
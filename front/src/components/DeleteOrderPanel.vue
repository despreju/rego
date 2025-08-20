<template>
    <Panel>
        <div class="message">
            Etes-vous sur de vouloir supprimer la commande
            <span class="order-id"># {{ props.orderId }}</span> ?
        </div>
        <div>
            <div class="actions-bar">
                <Button color="red" @click="onDeleteOrder" v-if="!isLoading">Supprimer</Button>
                <Button color="grey" @click="close" v-if="!isLoading">Annuler</Button>
                <Loading v-else />
            </div>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import Button from '../components/Button.vue';
import Loading from '../assets/icons/loading.svg';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { removeOrder } from '../api/orderApi';
import { useError } from '../composables/useError'
import type { ApiError } from '../api/axios';
import Panel from './Panel.vue';

const { handleApiError } = useError()
const apiErr = ref<ApiError | null>(null)

const props = defineProps<{
    orderId: number;
}>();
const emit = defineEmits(['close']);


const isLoading = ref(false);

function close() {
    emit('close');
}

const onDeleteOrder = async () => {
    try {
        isLoading.value = true;
        await removeOrder(props.orderId)
        emit('close');
        isLoading.value = false
    } catch (e) {
        apiErr.value = handleApiError(e)
    } finally {
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
    color: #e7e7e7;
    font-size: 1.25rem;
}

.order-id {
    color: #fff;
    background: rgba(255, 255, 255, 0.03);
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
<template>
    <Panel>
        <div class="history-panel">
            <div class="history-title">Historique des actions</div>
            <div class="history">
                <div class="history-item" v-for="(historyItem, index) in order?.history" :key="index">
                    <div class="history-author">
                        <div class="user">
                            <div class="user-logo">{{ historyItem.user?.firstname ? historyItem.user?.firstname[0] : '' }}{{
                                historyItem.user?.name ? historyItem.user?.name[0] : '' }}</div>
                        </div>
                    </div>
                    <div v-if="historyItem.date" class="history-date">{{ format(historyItem.date, 'dd/MM/yyyy') }}</div>
                    <div class="history-text">{{ historyItem?.action }}</div>
                </div>
            </div>
            <Button color="grey" @click="emit('close')" msg="Fermer" />
        </div>
    </Panel>
</template>

<script setup lang="ts">
import type { Order } from '../types';
import Panel from './Panel.vue';
import { format } from 'date-fns'
import Button from './Button.vue';

const emit = defineEmits(['close']);
defineProps<{ order?: Order }>()
</script>

<style scoped>
.history-panel {
    width: 50rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.history-title {
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--color-text);
}

.history {
    width: 100%
}

.history-item {
    width: 100%;
    display: flex;
    align-items: center;
    color: var(--color-text);
    margin-bottom:1rem;
}

.history-date {
    display: flex;
    align-items: center;
    color: var(--color-text-secondary);
    margin-right: 2rem;
}

.user-logo {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--color-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-bg);
    font-weight: bold;
    margin-right: 2rem;
}
</style>
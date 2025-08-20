<template>
    <div class="toasts-container" aria-live="polite">
        <div v-for="t in toasts" :key="t.id" :class="['toast', t.type]" @click="removeToast(t.id)">
            {{ t.message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'
const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toasts-container {
    position: fixed;
    right: 1rem;
    top: 1rem;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    z-index: 9999;
}

.toast {
    min-width: 220px;
    padding: .6rem .9rem;
    border-radius: 8px;
    color: #fff;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    font-size: .95rem;
}

.toast.success {
    background: #2db34a;
}

.toast.error {
    background: #e04545;
}

.toast.info {
    background: #2b7be4;
}
</style>
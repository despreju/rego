<template>
    <span :class="['badge', type]">
        <slot />
    </span>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    type: {
        type: String,
        default: 'default', // options: default, success, warning, error, info
    },
})
</script>

<style scoped>
.badge {
    display: flex;
    position: absolute;
    align-items: center;
    font-size: 0.8em;
    justify-content: center;
    font-weight: bold;
    border-radius: 50px;
    color: var(--color-bg);
    top: 24px;
    left: 24px;
    padding: 0 0.4rem;
    width: auto;
    height: 20px;
}

.badge.success {
    background: var(--color-success);
}

.badge.primary {
    background: var(--color-primary);
}

.badge.error {
    background: var(--color-error);
}
</style>
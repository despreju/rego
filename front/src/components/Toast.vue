<template>
    <div class="toasts-container" aria-live="polite">
        <transition-group name="toast" tag="div" class="toasts-list">
            <div v-for="t in toasts" :key="t.id" :class="['toast', t.type]" @click="removeToast(t.id)">
                <div class="toast-icon-container">
                    <component :class="['toast-icon', t.type]" :is="t.type === 'success' ? Success : Error" />
                </div>
                <div class="toast-message">
                    <div :class="['toast-status', t.type]">{{ t.type }}</div>
                    {{ t.message }}
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'
import Success from '../assets/icons/success.svg'
import Error from '../assets/icons/error.svg'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toasts-container {
    position: fixed;
    bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 9999;
    left: 50%;
    transform: translateX(-50%);
}

.toasts-list {
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

.toast {
    display: flex;
    min-width: 220px;
    padding: .6rem .9rem;
    color: var(--color-text);
    box-shadow: 0 6px 18px var(--color-surface);
    cursor: pointer;
    font-size: .95rem;
    background: var(--color-bg);
    border-bottom: 2px solid transparent;
    padding-right: 6rem;
}

/* fade + slight upward motion */
.toast-enter-active,
.toast-leave-active {
    transition: opacity .22s ease, transform .22s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.toast-enter-to,
.toast-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.toast.success {
    border-color: var(--color-success);
}

.toast.error {
    border-color: var(--color-error);
}

.toast.info {
    border-color: var(--color-info);
}

.toast-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
}

.toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    fill: var(--color-bg);
    border-radius: 100%
}

.toast-icon.error {
    background: var(--color-error);
}

.toast-icon.success {
    background: var(--color-success);
}

.toast-message {
    text-align:left;
}

.toast-status.success {
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: .2rem;
    color: var(--color-success);
}

.toast-status.error {
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: .2rem;
    color: var(--color-error);
}
</style>
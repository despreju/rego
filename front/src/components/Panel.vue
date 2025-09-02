<template>
    <div class="panel-overlay">
        <div class="panel" role="dialog" aria-modal="true">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

onMounted(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // restore on unmount
    onBeforeUnmount(() => {
        document.body.style.overflow = prev || '';
    });
});
</script>

<style>
.panel-overlay {
    position: fixed;
    inset: 0;
    /* top:0; right:0; bottom:0; left:0; */
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    z-index: 1000;
    padding: 1.5rem;
}

.panel {
    background-color: var(--color-bg);
    border-radius: 12px;
    padding: 1.75rem 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
}
</style>
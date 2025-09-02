<template>
    <Panel>
        <div class="comments-panel">
            <div class="comments-title">Commentaires</div>
            <div class="comments">
                <div class="comment" v-for="(comment, index) in order?.commentaires" :key="index">
                    <div class="comment-author">
                        <div class="user">
                            <div class="user-logo">{{ comment.user?.firstname ? comment.user?.firstname[0] : '' }}{{
                                comment.user?.name ? comment.user?.name[0] : '' }}</div>
                        </div>
                    </div>
                    <div v-if="comment.date" class="comment-date">{{ format(comment.date, 'dd/MM/yyyy') }}</div>
                    <div class="comment-text">{{ comment?.commentaire }}</div>
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
.comments-panel {
    width: 50rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.comments-title {
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--color-text);
}

.comments {
    width: 100%
}

.comment {
    width: 100%;
    display: flex;
    align-items: center;
    color: var(--color-text);
    margin-bottom:1rem;
}

.comment-date {
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
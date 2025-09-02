<template>
    <AddUser v-if="isNewUserPanelOpen" @close="isNewUserPanelOpen = false" />
    <div class="users-content">
        <div class="topbar">
            <div class="title-page">Gestion des Utilisateurs</div>
            <div class="actions">
                <Input class="search-input" type="text" placeholder="Rechercher ..." v-model="search" />
                <Button color="blue" class="action-button" @click="isNewUserPanelOpen = true" :icon="addIcon"
                    msg="Ajouter un utilisateur" />
            </div>
        </div>
        <div class="table-info"><strong>{{ auth.users.length }}</strong> résultats</div>
        <div class="table-head">
            <div v-for="(column, index) in columns" :class="column.title" :key="index"
                :style="{ width: column.size + '%' }">
                {{ column.title }}
                <div v-if="column.filter" class="filter" @click="filter(index)">
                    <arrow_down class="filter-icon" v-if="column.filter === 'up'" />
                    <arrow_up class="filter-icon" v-else-if="column.filter === 'down'" />
                    <filterIcon class="filter-icon" v-else />
                </div>
            </div>
        </div>
        <div v-for="(data, index) in auth.users" :key="index">
            <div class="table-row">
                <div class="table-row__login">
                    <profile class="profile-icon" />
                    {{ data.login }}
                </div>
                <div class="table-row__firstname">{{ data.firstname }}</div>
                <div class="table-row__name">{{ data.name }}</div>
                <div class="table-row__email">{{ data.email }}</div>
                <div class="table-row__data-actions"></div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import arrow_up from '../assets/icons/arrow_up.svg'
import arrow_down from '../assets/icons/arrow_down.svg'
import filterIcon from '../assets/icons/filter.svg'
import Input from '../components/Input.vue';
import { useAuthStore } from '../stores/auth.ts';
import profile from '../assets/icons/profile.svg';
import addIcon from '../assets/icons/add.svg';
import AddUser from '../components/AddUser.vue';
import Button from '../components/Button.vue';
const auth = useAuthStore()

const isNewUserPanelOpen = ref(false)

// Définition des colonnes
const columns = ref([
    { title: 'LOGIN', size: 15, filter: 'none' },
    { title: 'NOM', size: 15, filter: 'down' },
    { title: 'PRENOM', size: 15, filter: 'none' },
    { title: 'MAIL', size: 25, filter: 'none' },
    { title: '', size: 30 },
])

function filter(index: number) {
    columns.value.forEach((col, i) => {
        if (i === index) {
            col.filter = col.filter === 'up' ? 'down' : 'up'
        } else if ('filter' in col) {
            col.filter = 'none'
        }
    })
}

const search = ref('');
</script>

<style scoped>
.topbar {
    display: flex;
    height: 7rem;
    align-items: end;
    margin-bottom: 1rem;
}

.title-page {
    color: var(--color-text);
    font-weight: bold;
    font-size: 3rem;
    text-align: left;
    width: 100%;
}

.actions {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    color: var(--color-text);
    width: 100%;
    justify-content: end;
}

.search-input {
    display: flex;
    flex-direction: column;
    width: 30rem;
}

.action-button {
    margin-left: 2rem;
}

.table-info {
    text-align: left;
    font-style: italic;
    color: var(--color-text);
    margin-bottom: 0.25rem;
}

.table-head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-surface);
    color: var(--color-text-secondary);
    border-radius: 1rem;
    margin-bottom: 0.5rem;
    padding: 1rem 1rem;
    font-size: 0.85rem;
}

.table-head>div.Commentaire {
    padding-left: 5rem;
    justify-content: start;
}

.table-head>div {
    display: flex;
    justify-content: end;
}

.table-head>.LOGIN {
    justify-content: start !important;
}

.filter {
    cursor: pointer;
}

.filter-icon {
    width: 16px;
    margin-left: 1rem;
    fill: var(--color-text);
}

.table-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: var(--color-surface);
    color: var(--color-text);
    border-radius: 1rem;
    margin-bottom: 0.5rem;
    padding: 1rem 1rem;
}

.table-row__login {
    text-align: left;
    color: var(--color-text);
    font-style: italic;
    width: 15%;
    display: flex;
    align-items: center;
}

.profile-icon {
    width: 2rem;
    margin-right: 2rem;
}

.table-row__firstname {
    color: var(--color-text);
    font-style: italic;
    width: 15%;
    text-align: right;
}

.table-row__name {
    color: var(--color-text);
    font-style: italic;
    width: 15%;
    text-align: right;
}

.table-row__email {
    color: var(--color-text);
    font-style: italic;
    width: 25%;
    text-align: right;
}

.table-row__data-actions {
    display: flex;
    width: 30%;
    justify-content: end;
    color: var(--color-text);
    gap: 2rem;
}

.actions-icons {
    width: 3rem;
    height: 3rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all .18s ease;
    box-sizing: border-box;
    background: var(--color-bg);
    border-radius: 12px;
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.03), inset 0 0 0 rgba(0, 0, 0, 0.6), inset 0 0 0 rgba(255, 255, 255, 0.02);
    transition: box-shadow .10s ease, transform .10s ease;
}

.actions-icons:hover {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.4), 0 0 0 rgba(255, 255, 255, 0.03), inset 4px 4px 10px rgba(0, 0, 0, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.02);
    transform: translateY(1px);
    transition: box-shadow .10s ease, transform .10s ease;
}
</style>
<template>
    <div>
        <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
        <Button color="blue" type="file" @click="triggerFileInput" accept=".xlsx, .xls" :icon="importIcon"
            msg="Importer un fichier (xlsx)" />
    </div>
</template>

<script lang="ts" setup>
import * as XLSX from 'xlsx';
import Button from './Button.vue';
import { ref } from 'vue';
import { saveOrder } from '../api/orderApi';
import importIcon from '../assets/icons/import.svg';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore()

function handleFileUpload(file: File) {

    const reader = new FileReader();

    reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        for (const [, rowObj] of (rows as any[]).entries()) {

            // nettoyer l'ID : enlever tous les '#' et les espaces autour
            const rawId = String(rowObj["ID"] ?? '');
            const cleanIdStr = rawId.replace(/#/g, '').trim();
            const orderId = Number(cleanIdStr) || 0;

            // gérer la date (Excel serial -> Date ou string convertible)
            const rawDate = rowObj["Date"];
            const date = typeof rawDate === 'number' ? excelDateToJSDate(rawDate) : (rawDate ? new Date(String(rawDate)) : '');

            saveOrder({
                date: date || new Date(),
                categorie: rowObj["Catégorie"] || '',
                orderId,
                prixClient: Math.abs(Number(rowObj["Prix client"])) || 0,
                prixAchat: Math.abs(Number(rowObj["Prix achat"])) || 0,
                commentaires: rowObj["Commentaire"] || '',
                watch: false,
                user_id: auth.user._id,
                history: "Import"
            }).then(response => {
                console.log('Order saved successfully:', response);
            }).catch(error => {
                console.error('Error saving order:', error);
            });
        }
    };

    reader.readAsArrayBuffer(file);
}

function excelDateToJSDate(serial: number): Date {
    const utc_days = Math.floor(serial - 25569); // Décalage Excel -> Unix epoch
    const utc_value = utc_days * 86400; // Secondes
    return new Date(utc_value * 1000);
}

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        handleFileUpload(file);
    }
};
</script>

<style scoped>
input[type="file"] {
    display: none;
}
</style>

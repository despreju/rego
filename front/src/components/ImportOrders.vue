<template>
    <div>
        <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
        <Button color="accent" type="file" @click="triggerFileInput" accept=".xlsx, .xls" :icon="importIcon"
            msg="Importer (.xlsx)" />
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

    function excelDateToJSDate(serial: number): Date {
        // Excel stores dates as days since 1899-12-31 (with a bug for 1900 leap year)
        // This formula handles typical serials (Windows Excel).
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400; // seconds
        const date_info = new Date(utc_value * 1000);
        // If serial has fractional part, add the time portion
        const fractional = serial - Math.floor(serial);
        if (fractional > 0) {
            const secs = Math.round(fractional * 24 * 60 * 60);
            date_info.setSeconds(date_info.getSeconds() + secs);
        }
        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), date_info.getHours(), date_info.getMinutes(), date_info.getSeconds());
    }

    function parseDateDDMMYYYY(input: string): Date | null {
        if (!input || typeof input !== 'string') return null;
        const m = input.trim().match(/^(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{4})$/);
        if (!m) return null;
        const day = Number(m[1]);
        const month = Number(m[2]);
        const year = Number(m[3]);
        if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
        if (month < 1 || month > 12 || day < 1 || day > 31) return null;
        return new Date(year, month - 1, day);
    }

    reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        let counter = 0;
        for (const [, rowObj] of (rows as any[]).entries()) {
            // nettoyer l'ID : enlever tous les '#' et les espaces autour
            const rawId = String(rowObj["ID"] ?? '');
            const cleanIdStr = rawId.replace(/#/g, '').trim();
            const orderId = Number(cleanIdStr) || 0;

            // gérer la date correctement :
            // - si number => serial Excel -> excelDateToJSDate
            // - si string => try parse dd-mm-yyyy first, sinon fallback new Date(...)
            const rawDate = rowObj["Date"];
            let dateObj: Date | null = null;

            if (typeof rawDate === 'number') {
                dateObj = excelDateToJSDate(rawDate);
            } else if (typeof rawDate === 'string') {
                dateObj = parseDateDDMMYYYY(rawDate) || (() => {
                    const d = new Date(rawDate);
                    return isNaN(d.getTime()) ? null : d;
                })();
            } else if (rawDate instanceof Date) {
                dateObj = isNaN(rawDate.getTime()) ? null : rawDate;
            }

            // fallback à la date actuelle si non parseable
            const date = dateObj ?? new Date();
            counter ++;
            saveOrder({
                date,
                categorie: rowObj["Catégorie"] || '',
                orderId,
                prixClient: Math.abs(Number(rowObj["Prix client"])) || 0,
                prixAchat: Math.abs(Number(rowObj["Prix achat"])) || 0,
                commentaires: rowObj["Commentaire"] || '',
                watch: false,
                user_id: auth.user._id,
                history: "Import"
            }).then(() => {
                counter ++;
            }).catch(error => {
                console.error('Error saving order:', error);
            });
        }
        console.log(counter + ' orders processed.');
    };

    reader.readAsArrayBuffer(file);
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

<template>
    <div>
        <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
        <Button type="file" @click="triggerFileInput" accept=".xlsx, .xls">Importer un fichier (xlsx)</Button>
    </div>
</template>

<script lang="ts" setup>
import * as XLSX from 'xlsx';
import { useSaveOrder } from '../composables/useOrder';
import Button from './Button.vue';
import { ref } from 'vue';

const saveOrderMutation = useSaveOrder();

function handleFileUpload(file: File) {

    const reader = new FileReader();

    reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        let counter = ref(0);

        for (const [index, row] of (rows as any[]).entries()) {
            try {
                counter.value++;
                saveOrderMutation.mutate({
                    date: excelDateToJSDate(row["Date"]) || '',
                    categorie: row["Catégorie"] || '',
                    id: row["ID"] || '',
                    prixClient: Math.abs(Number(row["Prix client"])) || 0,
                    prixAchat: Math.abs(Number(row["Prix achat"])) || 0,
                    commentaire: row["Commentaire"] || '',
                },
                {
                    onSuccess: () => {
                        console.log('Ligne', index, ': succès');
                    },
                    onError: (error) => {
                        console.log('Erreur sur la ligne :', index, error);
                    }
                }
                );
            } catch (error) {
                console.log('erreur sur la ligne : ' + index + ' ' + error)
            }
        }
        console.log(`Import terminé, ${counter.value} lignes traitées.`);
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

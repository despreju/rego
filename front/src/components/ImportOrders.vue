<template>
  <div>
    <input type="file" accept=".xlsx,.xls" @change="handleFileUpload" />
  </div>
</template>

<script lang="ts" setup>
    import * as XLSX from 'xlsx';
    import { useSaveOrder } from '../composables/useOrder';

    const saveOrderMutation = useSaveOrder();

    function handleFileUpload(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            for (const [index, row] of (rows as any[]).entries()) { 
                try {
                    saveOrderMutation.mutate({
                        date: excelDateToJSDate(row["Date"]) || '',
                        categorie: row["Catégorie"] || '',
                        id: row["ID"] || '',
                        prixClient: row["Prix client"],
                        prixAchat: row["Prix achat"],
                        commentaire: row["Commentaire"] || '',
                    });
                } catch (error) {
                    console.log('erreur sur la ligne : ' + index + ' ' + error)
                }
                
            }
        };

        reader.readAsArrayBuffer(file);
    }

    function excelDateToJSDate(serial: number): Date {
        const utc_days = Math.floor(serial - 25569); // Décalage Excel -> Unix epoch
        const utc_value = utc_days * 86400; // Secondes
        return new Date(utc_value * 1000);
    }
</script>

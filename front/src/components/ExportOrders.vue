<template>
    <div>
        <Button color="accent" type="file" @click="exportXlsx()" accept=".xlsx, .xls" :icon="exportIcon"
            msg="Exporter (.xlsx)" />
    </div>
</template>

<script lang="ts" setup>

// ...existing code...
import * as XLSX from 'xlsx';
import Button from './Button.vue';
import exportIcon from '../assets/icons/exportIcon.svg';
import { useOrderStore } from '../stores/order';

const order = useOrderStore();

/** format date to dd-mm-yyyy (returns empty string if invalid) */
function formatDateDDMMYYYY(input: unknown): string {
    if (!input && input !== 0) return '';
    let d: Date | null = null;
    if (input instanceof Date) d = input;
    else if (typeof input === 'number') d = new Date(input);
    else if (typeof input === 'string') {
        // try parse dd-mm-yyyy or ISO fallback
        const m = input.trim().match(/^(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{4})$/);
        if (m) {
            const day = Number(m[1]), month = Number(m[2]), year = Number(m[3]);
            d = new Date(year, month - 1, day);
        } else {
            const tmp = new Date(input);
            d = isNaN(tmp.getTime()) ? null : tmp;
        }
    }
    if (!d || isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

/** pick best id representation */
function getId(o: any): string {
    if (o == null) return '';
    if (o.orderId !== undefined && o.orderId !== null) return String(o.orderId);
    if (o.id !== undefined && o.id !== null) return String(o.id);
    if (o._id !== undefined && o._id !== null) return String(o._id);
    return '';
}

/** commentaires -> JSON string (toujours un JSON: array ou objet) */
function commentairesToJSON(c: any): string {
    if (c == null) return '[]';
    try {
        // si c'est déjà une chaîne, essayer de la parser en JSON, sinon envelopper
        if (typeof c === 'string') {
            const s = c.trim();
            if (s === '') return '[]';
            try {
                const parsed = JSON.parse(s);
                return JSON.stringify(parsed);
            } catch {
                // pas du JSON : on le transforme en tableau d'objet commentaire
                return JSON.stringify([{ commentaire: s }]);
            }
        }
        // array/objet -> JSON
        return JSON.stringify(c);
    } catch (e) {
        return JSON.stringify({ raw: String(c) });
    }
}

/** history -> JSON string (toujours un JSON: array ou objet) */
function historyToJSON(h: any): string {
    if (h == null) return '[]';
    try {
        if (typeof h === 'string') {
            const s = h.trim();
            if (s === '') return '[]';
            try {
                const parsed = JSON.parse(s);
                return JSON.stringify(parsed);
            } catch {
                return JSON.stringify([{ action: s }]);
            }
        }
        return JSON.stringify(h);
    } catch (e) {
        return JSON.stringify({ raw: String(h) });
    }
}

/** Export function: récupère 4 listes du store et télécharge un .xlsx */
function exportXlsx() {
    // 4 listes attendues dans le store — adapte les clés si nécessaire
    const listKeys = ['ordersList', 'shopifyList', 'paymentsList', 'adsList'];

    const rows: Record<string, any>[] = [];

    for (const key of listKeys) {
        const list = (order as any)[key];
        if (!Array.isArray(list)) continue;
        for (const o of list) {
            rows.push({
                'Date': formatDateDDMMYYYY(o?.date),
                'Catégorie': o?.categorie ?? '',
                'ID': getId(o),
                'Prix client': (o?.prixClient !== undefined && o?.prixClient !== null) ? Number(o.prixClient) : '',
                'Prix achat': (o?.prixAchat !== undefined && o?.prixAchat !== null) ? Number(o.prixAchat) : '',
                'watch': o?.watch ? 1 : 0,
                'Commentaires': commentairesToJSON(o?.commentaires ?? o?.commentaire ?? '[]'),
                'History': historyToJSON(o?.history ?? '[]')
            });
        }
    }

    // si aucune ligne -> créer un fichier vide minimal
    if (rows.length === 0) {
        rows.push({
            'Date (dd-mm-yyyy)': '',
            'Catégorie': '',
            'ID': '',
            'Prix client': '',
            'Prix achat': '',
            'Commentaires': '',
            'History': ''
        });
    }

    const ws = XLSX.utils.json_to_sheet(rows, {
        header: [
            'Date (dd-mm-yyyy)',
            'Catégorie',
            'ID',
            'Prix client',
            'Prix achat',
            'Commentaires',
            'History'
        ]
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    const now = new Date();
    const fn = `orders_export_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.xlsx`;
    XLSX.writeFile(wb, fn);
}
</script>

<style scoped>
input[type="file"] {
    display: none;
}
</style>

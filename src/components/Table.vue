<template>
    <div ref="parentContainer">
        <v-data-table :headers="headers" :items="items" density="compact" :items-per-page="10"
            :sort-by="[{ key: 'created', order: 'desc' }]" multi-sort :height="tableHeight" fixed-header show-select
            select-strategy="single">
            <template v-slot:item.status="{ item }">
                <v-chip size="small" :class="{
                    'text-success': item.status === 'success',
                    'text-error': item.status === 'error',
                    'text-progress': item.status === 'progress',
                    'text-warning': item.status === 'warning',
                    'text-pending': item.status === 'pending',
                }" small>{{ item.status }}</v-chip>
            </template>
            <template v-slot:item.info="{ item }">
                <v-btn density="compact" icon="mdi-alert-circle-outline" flat @click="onSelection(item.id)"></v-btn>
            </template>
            <template v-slot:item.created="{ item }">
                {{ new Date(item.created).toLocaleString() }}
            </template>
            <template v-slot:item.selected="{ item }">
                <v-checkbox v-model="selected" :value="item.id"></v-checkbox>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Workflows</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="fetchData">
                        <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
        </v-data-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: [],
            headers: [
                { title: 'ID', key: 'id' },
                { title: 'Name', key: 'name' },
                { title: 'Project', key: 'project' },
                { title: 'Status', key: 'status' },
                { title: 'Created', key: 'created' },
                { title: 'Info', key: 'info' },
            ],
            items: [],
            tableHeight: 300, // Default height
        }
    },
    mounted() {
        this.updateTableHeight();
        window.addEventListener('resize', this.updateTableHeight);
        this.fetchData();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateTableHeight);
    },
    methods: {
        updateTableHeight() {
            if (this.$refs.parentContainer) {
                const windowHeight = window.innerHeight;
                this.tableHeight = windowHeight * 0.5;
            } else {
                console.error('parentContainer ref is not defined');
            }
        },
        async fetchData() {
            const data_url = 'http://127.0.0.1:5000/api/workflows';
            try {
                const response = await fetch(data_url);
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    this.items = data;
                } else {
                    console.error('Data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        onSelection(selectedItems) {
            this.selected = selectedItems;
            
            this.$emit('selection-changed', selectedItems);
        },
        showInfo(info) {
            alert(info);
        }
    },
}
</script>

<style scoped>
.text-success {
    color: green;
}

.text-error {
    color: red;
}

.text-body {
    color: black;
}

.text-progress {
    color: blue;
}

.text-warning {
    color: orange;
}

.text-pending {
    color: gray;
}
</style>
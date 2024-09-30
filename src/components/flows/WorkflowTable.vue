<template>
    <div ref="parentContainer">
        <v-data-table :headers="headers" :items="items" density="compact" :items-per-page="10"
            :sort-by="[{ key: 'created', order: 'desc' }]" multi-sort :height="tableHeight" fixed-header show-select
            select-strategy="single" v-model="selected" @update:modelValue="emitSelected">
            <template v-slot:item.status="{ item }">
                <v-chip size="small" :class="{
                    'text-success': item.status === 'success',
                    'text-error': item.status === 'error',
                    'text-progress': item.status === 'progress',
                    'text-warning': item.status === 'warning',
                    'text-pending': item.status === 'pending',
                }" small>{{ item.status }}</v-chip>
            </template>
            <template v-slot:item.created="{ item }">
                {{ new Date(item.created).toLocaleString() }}
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Workflows</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="showRunWorkflowDialog">RUN</v-btn>
                    <v-btn icon @click="fetchData">
                        <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" max-width="290">
            <v-form @submit.prevent="runWorkflow">
                <v-card>
                    <v-card-title>Run Workflow</v-card-title>
                    <v-card-text>
                        <v-select v-model="workflowId" :items="definitions" item-title="name" item-value="fullname"
                            label="Workflow ID" required></v-select>
                        <v-text-field v-model="payload" label="Payload" 
                        placeholder='{"key": "value"}'
                        required></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="dialog = false">Cancel</v-btn>
                        <v-btn type="submit" color="primary">Run</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
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
            ],
            items: [],
            tableHeight: 300, // Default height
            dialog: false,
            workflowId: '',
            definitions: [
                {
                    "fullname": "example.ETL",
                    "name": "ETL",
                    "project": "example",
                    "tasks": [
                        "EXTRACT",
                        "TRANSFORM",
                        "LOAD"
                    ],
                    "timeout": 60
                },
                {
                    "fullname": "example.PIPELINE",
                    "name": "PIPELINE",
                    "project": "example",
                    "tasks": [
                        {
                            "name": "Build",
                            "script": "echo \"Building...\""
                        }
                    ]
                },
                {
                    "fullname": "example.RANDOMS",
                    "name": "RANDOMS",
                    "project": "example",
                    "tasks": [
                        {
                            "GROUP_RANDOMS": {
                                "tasks": [
                                    "RANDOM",
                                    "RANDOM"
                                ],
                                "type": "group"
                            }
                        },
                        "ADD"
                    ]
                }
            ]
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
        showRunWorkflowDialog() {
            this.dialog = true;
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
        emitSelected(value) {
            this.$emit('update:modelValue', value);
        },
        showInfo(info) {
            alert(info);
        },
        async runWorkflow() {
            const run_url = `http://127.0.0.1:5000/api/workflows`;
            const requestData = {
                project: this.workflowId.split('.')[0],
                name: this.workflowId.split('.')[1],
                payload: this.payload ? JSON.parse(this.payload) : {},
            };
            try {
                const response = await fetch(run_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });
                if (response.ok) {
                    this.dialog = false;
                    this.fetchData(); // Refresh the data table
                } else {
                    console.error('Error running workflow:', response.statusText);
                }
            } catch (error) {
                console.error('Error running workflow:', error);
            }
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
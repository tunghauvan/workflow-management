<template>
    <Sidebar :drawer="drawer" @toggleDrawer="toggleDrawer"></Sidebar>
    <v-app>
        <v-main class="main-content">
            <v-container fluid class="pa-0 fixed-container">
                <v-row no-gutters>
                    <v-col cols="12" class="pa-0">
                        <v-card class="elevation-0">
                            <v-card-title class="headline">Manage Workflows</v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col cols="12" class="pa-0">
                        <v-divider></v-divider>
                    </v-col>
                </v-row>
                <v-row no-gutters class="content-row" rows="1">
                    <v-col cols="8" class="pa-0 border-right">
                        <div>
                            <Table @selection-changed="handleSelectionChange" />
                        </div>
                    </v-col>
                    <v-col cols="4" class="pa-0 scrollable-column">
                        <!-- <div>
              <Details></Details>
            </div> -->
                        <div class="content">
                            <div v-if="selectedNode">
                                <h3>Selected Node Information</h3>
                                <p><strong>ID:</strong> {{ selectedNode.id }}</p>
                                <p><strong>Name:</strong> {{ selectedNode.data.name }}</p>
                                <p><strong>Status:</strong> {{ selectedNode.data.status }}</p>
                                <p><strong>Begin:</strong> {{ selectedNode.data.begin }}</p>
                                <p><strong>End:</strong> {{ selectedNode.data.end }}</p>
                            </div>
                            <div v-else>
                                <p>No node selected</p>
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters class="chart-row" rows="1">
                    <v-col cols="12" class="pa-0">
                        <!-- header when selecte workflow -->
                        <v-divider></v-divider>
                        <v-card class="elevation-0">
                            <v-card-title 
                            :class="{'headline': true, 'text-h6': true}"
                            class="headline">Workflow Chart: {{ workflowId }}</v-card-title>
                        </v-card>
                        <TaskChart @node-selected="updateSelectedNode" :workflow-id="workflowId" />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    components: {
        Sidebar,
        Table,
        Details,
        TaskChart,
    },
    setup() {
        const selectedNode = ref(null)

        function updateSelectedNode(node) {
            selectedNode.value = node
        }

        return {
            selectedNode,
            updateSelectedNode,
        }
    },
    data() {
        return {
            drawer: false,
            workflowId: 'a1b8c238-d38e-4110-ac0e-cb2e74720338',
        }
    },
    methods: {
        toggleDrawer() {
            this.drawer = !this.drawer
        },
        handleSelectionChange(selectedItem) {
            // set workflowId to the selected item ID
            this.workflowId = selectedItem
            // Set title to the selected item name in 
        },
    },
}
</script>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from '@/components/Navbar.vue';
import Table from '@/components/Table.vue';
import Details from '@/components/Details.vue';
import TaskChart from '@/components/flows/TaskChart.vue';
const selectedNode = ref(null)

function updateSelectedNode(node) {
    selectedNode.value = node
}

onMounted(() => {
    document.title = 'Manage Workflows';
});
</script>

<style scoped>
.main-content {
    height: 100vh;
    overflow: hidden;
    /* Prevent main content from scrolling */
}

.border-right {
    border-right: 1px solid #ccc;
}

.content-row {
    /* flex: 1; */
    /* overflow: auto; */
    /* Adjust height to account for the divider */
    height: calc(100vh - 350px);

    text-align: center;
    padding-top: 10px;
}


.chart-row {
    flex: 0 0 auto;
    height: 200px;
    /* Adjust the height as needed */
    /* Additional styling for TaskChart if needed */
}

.scrollable-column {
    height: 100%;
    overflow-y: auto;
    /* Enable vertical scrolling */
}
</style>
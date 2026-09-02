<template>
  <ag-grid-vue class="ag-theme-alpine" style="height: 500px" :columnDefs="columnDefs.value" :rowData="rowData"
    :defaultColDef="defaultColDef" rowSelection="multiple" animateRows="true" @cell-clicked="cellWasClicked"
    @grid-ready="onGridReady">
  </ag-grid-vue>
</template>

<script setup lang='ts'>
import { AgGridVue } from "ag-grid-vue3";  // the AG Grid Vue Component
import { reactive, onMounted, ref, Ref } from "vue";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { EIManager, EI } from 'EIX/ei';
import { GridApi } from 'ag-grid-community';


const gridApi: Ref<GridApi | null> = ref(null); // Optional - for accessing Grid's API

// Obtain API from grid's onGridReady event
const onGridReady = (params: any) => {
  gridApi.value = params.api;
};

const rowData: Ref<any[]> = ref([]); // Set rowData to Array of Objects, one Object per Row

// Each Column Definition results in one Column.
const columnDefs = reactive({
  value: [
    {
      field: "FORM_NAME",
      headerName: "子画面",
      cellRenderer: function(params: any) {
        return '<a href="/' + params.data.FORM_BASE_NAME + '?formName=' + params.value + '">' + params.value + '</a>'
      }
    },
    {
      field: "FORM_BASE_NAME",
      headerName: "母画面",
      cellRenderer: function(params: any) {
        return '<a href="/' + params.value + '">' + params.value + '</a>'
      }
    },
  ],
});

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  sortable: true,
  filter: true,
  flex: 1
};

// Example load data from server
onMounted(() => {
  const inInfo = new EI.EIInfo();
  const inBlock = inInfo.addBlock(new EI.EiBlock(), 'NAME');
  inBlock.addColumns('FORM_BASE_NAME');
  const viewsList = import.meta.glob('@/views/**/*.vue', { import: 'default', eager: true })
  Object.keys(viewsList).forEach((key: string) => {
    const statIndex = key.indexOf('/', 5);
    const endIndex = key.lastIndexOf('/');
    const name = key.substring(statIndex + 1, endIndex);
    console.log('name', name);
    if (name !== '404' && name !== 'dashboard') {
      inBlock.addRow({
        FORM_BASE_NAME: name,
      });
    }
  });
  console.log('inInfo', inInfo);
  EIManager.callService("TGT8Z", "form_helper", inInfo).then((result: any) => {
    const data = result.blocks["Table0"].data; // 假设结果中的数组被命名为 data
    rowData.value = data;
  }).catch((error: any) => {
    console.error(error);
  })
})
const cellWasClicked = (event: any) => { // Example of consuming Grid Event
  console.log("cell was clicked", event);
}


</script>

<style lang="scss"></style>

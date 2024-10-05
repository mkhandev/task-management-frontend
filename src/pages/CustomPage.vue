<template>
    <v-container>
      <!-- Input field that triggers the date picker popup -->
      <v-menu
        v-model="showDatePicker"
        close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <!-- Activator for the date picker (input field) -->
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="formattedDate"
            label="Select a date"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
  
        <!-- Date picker inside a popup menu -->
        <v-date-picker
          v-model="date"
          @input="saveDate"
          show-current
        ></v-date-picker>
      </v-menu>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const date = ref(null);
  const formattedDate = ref(null);
  const showDatePicker = ref(false); // Controls the popup menu visibility
  
  const saveDate = (val) => {
    formattedDate.value = formatDate(val);
    showDatePicker.value = false; // Close the popup after selecting a date
  };
  
  const formatDate = (date) => {
    if (!date) return null;
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-CA', options); // Adjust locale as needed
  };
  </script>
  
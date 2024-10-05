<script setup>
import { onMounted } from "vue";

import Header from "@/components/Header.vue";

import { useTaskStore } from "@/stores/taskStore";
const taskStore = useTaskStore();

onMounted(() => {
  taskStore.checkAuthentication();
});
</script>

<template>
  <div>
    <Header />

    <div class="container mx-auto">
      <div class="flex flex-col items-center gap-5 justify-center h-[100vh]">
        <h3 class="text-[20px] font-semibold">Not found</h3>

        <div v-if="taskStore.isAuthenticated">
          <router-link
            :to="{ name: 'Dashboard' }"
            class="bg-[#42ad7e] text-[#FFF] text-[20px] px-5 py-4 rounded cursor-pointer"
            >Go To Dashboard</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

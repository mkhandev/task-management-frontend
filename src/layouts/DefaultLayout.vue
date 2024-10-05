<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";

const isSidebarVisible = ref(true);

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const hideSidebar = () => {
  if (window.innerWidth < 768) {
    isSidebarVisible.value = false;
  }
};

const handleResize = () => {
  if (window.innerWidth >= 768) {
    isSidebarVisible.value = true;
  } else {
    isSidebarVisible.value = false;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize(); // Initial check
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});


watch(isSidebarVisible, (newValue) => {
  console.log("Sidebar visibility changed:", newValue);
});
</script>

<template>
  <div class="bg-[#fafafb]">
    <Header @toggleSidebar="toggleSidebar" />
    <div class="flex min-h-[100vh]">
      <Sidebar :visible="isSidebarVisible" @closeSidebar="hideSidebar" />
      <main class="flex-1 p-4">
        <div class="container mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style></style>

<script setup>
import { onMounted } from "vue";
import Logo from "@/assets/images/logo.png";

import { useTaskStore } from "@/stores/taskStore";
const taskStore = useTaskStore();

onMounted(() => {
  taskStore.checkAuthentication();
});

const emit = defineEmits(['toggleSidebar']);
</script>

<template>
  <div class="w-full bg-white border-b border-gray-200 border-solid">
    <div class="container mx-auto">
      <div class="flex items-center justify-between p-4">
        <img class="w-[170px] md:w-[202px]" :src="Logo" alt="Example Image" />
        <div
          v-if="!taskStore.isAuthenticated"
          class="text-xl text-[#2E3033] text-center"
        >
          <div class="flex gap-1 mdgap-[5px]">
            <router-link
              :to="{ name: 'Login' }"
              class="flex gap-1 p-2 text-[#090E18] font-normal hover:bg-[#f3f4f6] text-[11px] md:text-[16px]"
            >
              Sign In
            </router-link>

            <router-link
              :to="{ name: 'Register' }"
              class="flex gap-1 p-2 text-[#090E18] font-normal hover:bg-[#f3f4f6] text-[11px] md:text-[16px]"
            >
              Register
            </router-link>
          </div>
        </div>

        <div v-else class="text-xl text-[#2E3033] text-center hidden md:block">
          Task Management
        </div>

        <button  @click="emit('toggleSidebar')" v-if="taskStore.isAuthenticated" class="md:hidden" id="toggle-sidebar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#be312d"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

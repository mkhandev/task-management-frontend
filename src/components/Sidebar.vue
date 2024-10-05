<script setup>

import { useTaskStore } from "@/stores/taskStore";
const taskStore = useTaskStore();

import dashboard from "@/assets/images/dashboard.png";
import task from "@/assets/images/task.png";
import turnOff from "@/assets/images/turn-off.png";


const logout = async () => {
  try {
    await taskStore.signOut();
  } catch (error) {
  } finally {
  }
};

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['closeSidebar']);

</script>

<template>
  <aside
    v-if="visible"
    id="sidebar"
    class="fixed top-[0] h-[100%] md:h-[initial] z-30 w-64 transition-transform transform bg-white shadow-md md:relative md:top-0 md:translate-x-0 sidebar-hidden md:block"
  >
    <div class="p-4">
      <nav>
        <ul>
          <li class="mb-2">
            <router-link
              @click="emit('closeSidebar')"
              :to="{ name: 'Dashboard' }"
              class="flex gap-1 p-2 text-[16px] text-[#090E18] font-normal hover:bg-[#f3f4f6]"
            >
              <img :src="dashboard" /> Dashboard
            </router-link>
          </li>

          <li class="mb-2">
            <router-link
              @click="emit('closeSidebar')"
              :to="{ name: 'AddTask' }"
              class="flex gap-1 p-2 text-[16px] text-[#090E18] font-normal hover:bg-[#f3f4f6]"
            >
              <img :src="task" /> Add Task
            </router-link>
          </li>
          <li
            @click="logout"
            class="flex gap-1 p-2 text-[16px] hover:bg-[#f3f4f6] text-[#090E18] font-normal cursor-pointer"
          >
            <img :src="turnOff" class="w-[25px]" />
            Logout
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<style></style>

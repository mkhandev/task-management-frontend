<script setup>
import { ref, watchEffect, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";

import { useRoute } from "vue-router";
const route = useRoute();

import { ElMessageBox } from 'element-plus'

import Loader from "@/utils/Loader.vue";
import plusIcon from "@/assets/images/plus.png";
import groupIcon from "@/assets/images/group.png";
import buttonIcon from "@/assets/images/button.png";

const loading = ref(true);

import { useTaskStore } from "@/stores/taskStore";
const taskStore = useTaskStore();

const filters = ref({
  title: '',
  user_id: '',
  due_date: '',
})

onMounted(async () => {
  await taskStore.fetchTasks();
  await taskStore.fetchAssignUser();
  initialDropdownState();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const dropdownTaskStates = ref({});

const initialDropdownState = () => {
  Object.values(taskStore.tasks).forEach((taskStatus) => {
    Object.values(taskStatus).forEach((task) => {
      dropdownTaskStates.value[task.id] = false;
    });
  });
};

function toggleDropdown(taskId) {
  closeAllDropdowns();
  dropdownTaskStates.value[taskId] = !dropdownTaskStates.value[taskId];
}

const deleteTask = (taskId) => {
  closeAllDropdowns();

  loading.value = true;
  taskStore.removeTask(taskId).finally(() => {
    loading.value = false;
  });
};

const confirmDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this task?',
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );

    deleteTask(id);
  } catch (error) {
    if (error === 'cancel') {
      console.log('Deletion canceled');
    } else {
      console.error('Error during deletion:', error);
    }
    closeAllDropdowns();
  }
};

function closeAllDropdowns() {
  for (const id in dropdownTaskStates.value) {
    dropdownTaskStates.value[id] = false;
  }
}

// Handle click outside of the dropdown to close it
function handleClickOutside(event) {
  const dropdownMenus = document.querySelectorAll(".dropdownMenu");
  const optionsButtons = document.querySelectorAll(".optionsButton");

  let isDropdownClicked = false;
  optionsButtons.forEach((button) => {
    if (button.contains(event.target)) {
      isDropdownClicked = true;
    }
  });

  dropdownMenus.forEach((menu) => {
    if (!menu.contains(event.target) && !isDropdownClicked) {
      closeAllDropdowns();
    }
  });
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const submitForm = async () => {
  await taskStore.fetchTasks(filters.value);
};

const userList = computed(() => taskStore.getUserList);

const hasTasks = computed(() => {
  return Object.values(taskStore.tasks).some(statusArray => statusArray.length > 0);
});

const resetForm = async () => {
  filters.value = {
    title: '',
    user_id: '',
    due_date: ''
  };

  await taskStore.fetchTasks();
};
</script>

<template>
  <div>
    
    <div class="">
      <form  @submit.prevent="submitForm">
        <div class="border border-solid border-[#D2D6DC] flex flex-wrap flex-col md:flex-row  gap-3 p-4 w-full rounded">
          <input type="text" v-model="filters.title" name="title" class="p-2 rounded focus:outline-none w-full md:max-w-[160px]" placeholder="Task Name" />

          <select name="user_id" v-model="filters.user_id" class="p-2 bg-white text-[#a6a4a4] focus:outline-none w-full md:max-w-[160px] rounded">
            <option value="">Assign User</option>
            <option :value="user.id" v-for="user in userList" :key="user.id">{{ user.name }}</option>
          </select>

          <input type="date" v-model="filters.due_date" name="due_date" autocomplete="off" placeholder="Due Date" class="w-full md:max-w-[160px] p-2 border rounded focus:outline-none">

          <input type="submit" name="submit" value="Search"
              class="bg-[#42ad7e] text-[#FFF] text-[16px] px-3 py-2 rounded cursor-pointer" />

          <button type="button" @click="resetForm" class="bg-[#e74c3c] text-[#FFF] text-[16px] px-3 py-2 rounded cursor-pointer">Reset</button>

        </div>
      </form>
    </div>

    <h1
      class="font-semibold text-[28px] py-5 border-b border-solid border-[#D2D6DC] mb-5 text-[#161E2E]"
    >
      Task List
    </h1>

    <div
      class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div class="w-full">
        <div
          class="bg-[#E9E9FF] py-3 px-4 rounded-[6px] mb-5 flex justify-between items-center"
        >
          <div class="flex items-center gap-2">
            <div class="font-semibold text-[16px] text-[#252F3F]">To Do</div>
            <div
              class="rounded-[50%] min-w-[30px] min-h-[30px] px-[4px] box-border flex items-center justify-center bg-white font-bold text[12px] text-[#161919]"
            >
              {{
                taskStore.tasks["To Do"] ? taskStore.tasks["To Do"].length : 0
              }}
            </div>
          </div>
          <div>
            <router-link :to="{ name: 'AddTask' }"><img class="w-[11px]" :src="plusIcon" /></router-link>
          </div>
        </div>

        <div
          v-if="taskStore.tasks['To Do'] && taskStore.tasks['To Do'].length"
          class="border border-dotted border-[#AEAEAE] p-3 rounded-[9px]"
        >
          <div
            v-for="toDoTask in taskStore.tasks['To Do']"
            :key="toDoTask.id"
            class="p-4 mb-5 bg-white rounded-[9px] shadow-md"
          >
            <div class="mb-3 font-semibold text-[16px] text-[#000000]">
              {{ toDoTask.title }}
            </div>
            <div class="border-b border-solid border-[#E3E6EA] mb-[10px]">
              <div class="mb-[10px] font-normal text-[#2E3033] text-[16px]">
                {{ toDoTask.description }}
              </div>
              <img class="w-[75px] mb-[10px]" :src="groupIcon" />
            </div>

            <div class="flex items-center justify-between">
              <div
                class="rounded-[8px] bg-[#FA8223] flex gap-2 py-[8px] px-[10px]"
              >
                <img class="w-[18px]" :src="buttonIcon" />
                <span class="text-[#FFF] text-[14px] font-normal">
                  {{ formatDate(toDoTask.due_date) }}
                </span>
              </div>

              <div class="relative flex gap-2 dropdown">
                <div
                  href="#"
                  class="optionsButton text-[20px] font-bold cursor-pointer"
                  @click="toggleDropdown(toDoTask.id)"
                  >...</div>

                <div
                  v-if="dropdownTaskStates[toDoTask.id]"
                  class="absolute right-0 w-32 mt-2 bg-white border rounded-md shadow-lg dropdownMenu"
                >
                  <router-link
                    :to="{ name: 'EditTask', params: { id: toDoTask.id } }"
                    class="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Edit
                  </router-link>
                  <div
                    class="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-200"
                    @click="confirmDelete(toDoTask.id)"
                    >Delete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div
          class="bg-[#fffbe9] py-3 px-4 rounded-[6px] mb-5 flex justify-between items-center"
        >
          <div class="flex items-center gap-2">
            <div class="font-semibold text-[16px] text-[#252F3F]">
              Work In Progress
            </div>
            <div
              class="rounded-[50%] min-w-[30px] min-h-[30px] px-[4px] box-border flex items-center justify-center bg-white font-bold text[12px] text-[#161919]"
            >
              {{
                taskStore.tasks["Work In Progress"]
                  ? taskStore.tasks["Work In Progress"].length
                  : 0
              }}
            </div>
          </div>
          <div>
             <router-link :to="{ name: 'AddTask' }"><img class="w-[11px]" :src="plusIcon" /></router-link>
          </div>
        </div>

        <div
          v-if="
            taskStore.tasks['Work In Progress'] &&
            taskStore.tasks['Work In Progress'].length
          "
          class="border border-dotted border-[#AEAEAE] p-3 rounded-[9px]"
        >
          <div
            v-for="workTask in taskStore.tasks['Work In Progress']"
            :key="workTask.id"
            class="p-4 mb-5 bg-white rounded-[9px] shadow-md"
          >
            <div class="mb-3 font-semibold text-[16px] text-[#000000]">
              {{ workTask.title }}
            </div>
            <div class="border-b border-solid border-[#E3E6EA] mb-[10px]">
              <div class="mb-[10px] font-normal text-[#2E3033] text-[16px]">
                {{ workTask.description }}
              </div>
              <img class="w-[75px] mb-[10px]" :src="groupIcon" />
            </div>

            <div class="flex items-center justify-between">
              <div
                class="rounded-[8px] bg-[#FA8223] flex gap-2 py-[8px] px-[10px]"
              >
                <img class="w-[18px]" :src="buttonIcon" />
                <span class="text-[#FFF] text-[14px] font-normal">
                  {{ formatDate(workTask.due_date) }}
                </span>
              </div>

              <div class="relative flex gap-2 dropdown">
                <div
                  href="#"
                  class="optionsButton text-[20px] font-bold cursor-pointer"
                  @click="toggleDropdown(workTask.id)"
                  >...</div>

                <div
                  v-if="dropdownTaskStates[workTask.id]"
                  class="absolute right-0 w-32 mt-2 bg-white border rounded-md shadow-lg dropdownMenu"
                >
                  <router-link
                    :to="{ name: 'EditTask', params: { id: workTask.id } }"
                    class="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Edit
                  </router-link>
                  <div
                    class="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-200"
                    @click="confirmDelete(workTask.id)"
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div
          class="bg-[#fedcc7] py-3 px-4 rounded-[6px] mb-5 flex justify-between items-center"
        >
          <div class="flex items-center gap-2">
            <div class="font-semibold text-[16px] text-[#252F3F] uppercase">
              Under Review
            </div>
            <div
              class="rounded-[50%] min-w-[30px] min-h-[30px] px-[4px] box-border flex items-center justify-center bg-white font-bold text[12px] text-[#161919]"
            >
              {{
                taskStore.tasks["Under Review"]
                  ? taskStore.tasks["Under Review"].length
                  : 0
              }}
            </div>
          </div>
          <div>
             <router-link :to="{ name: 'AddTask' }"><img class="w-[11px]" :src="plusIcon" /></router-link>
          </div>
        </div>

        <div
          v-if="
            taskStore.tasks['Under Review'] &&
            taskStore.tasks['Under Review'].length
          "
          class="border border-dotted border-[#AEAEAE] p-3 rounded-[9px]"
        >
          <div
            v-for="underReview in taskStore.tasks['Under Review']"
            :key="underReview.id"
            class="p-4 mb-5 bg-white rounded-[9px] shadow-md"
          >
            <div class="mb-3 font-semibold text-[16px] text-[#000000]">
              {{ underReview.title }}
            </div>
            <div class="border-b border-solid border-[#E3E6EA] mb-[10px]">
              <div class="mb-[10px] font-normal text-[#2E3033] text-[16px]">
                {{ underReview.description }}
              </div>
              <img class="w-[75px] mb-[10px]" :src="groupIcon" />
            </div>

            <div class="flex items-center justify-between">
              <div
                class="rounded-[8px] bg-[#FA8223] flex gap-2 py-[8px] px-[10px]"
              >
                <img class="w-[18px]" :src="buttonIcon" />
                <span class="text-[#FFF] text-[14px] font-normal">
                  {{ formatDate(underReview.due_date) }}
                </span>
              </div>

              <div class="relative flex gap-2 dropdown">
                <div
                  class="optionsButton text-[20px] font-bold cursor-pointer"
                  @click="toggleDropdown(underReview.id)"
                >
                  ...
                </div>

                <div
                  v-if="dropdownTaskStates[underReview.id]"
                  class="absolute right-0 w-32 mt-2 bg-white border rounded-md shadow-lg dropdownMenu"
                >
                  <router-link
                    :to="{ name: 'EditTask', params: { id: underReview.id } }"
                    class="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Edit
                  </router-link>
                  <div
                    class="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-200"
                    @click="confirmDelete(underReview.id)"
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div
          class="bg-[#e3f5e4] py-3 px-4 rounded-[6px] mb-5 flex justify-between items-center"
        >
          <div class="flex items-center gap-2">
            <div class="font-semibold text-[16px] text-[#252F3F] uppercase">
              Complete
            </div>
            <div
              class="rounded-[50%] min-w-[30px] min-h-[30px] px-[4px] box-border flex items-center justify-center bg-white font-bold text[12px] text-[#161919]"
            >
              {{
                taskStore.tasks["Complete"]
                  ? taskStore.tasks["Complete"].length
                  : 0
              }}
            </div>
          </div>
          <div>
             <router-link :to="{ name: 'AddTask' }"><img class="w-[11px]" :src="plusIcon" /></router-link>
          </div>
        </div>

        <div
          v-if="
            taskStore.tasks['Complete'] && taskStore.tasks['Complete'].length
          "
          class="border border-dotted border-[#AEAEAE] p-3 rounded-[9px]"
        >
          <div
            v-for="completeTask in taskStore.tasks['Complete']"
            :key="completeTask.id"
            class="p-4 mb-5 bg-white rounded-[9px] shadow-md"
          >
            <div class="mb-3 font-semibold text-[16px] text-[#000000]">
              {{ completeTask.title }}
            </div>
            <div class="border-b border-solid border-[#E3E6EA] mb-[10px]">
              <div class="mb-[10px] font-normal text-[#2E3033] text-[16px]">
                {{ completeTask.description }}
              </div>
              <img class="w-[75px] mb-[10px]" :src="groupIcon" />
            </div>

            <div class="flex items-center justify-between">
              <div
                class="rounded-[8px] bg-[#FA8223] flex gap-2 py-[8px] px-[10px]"
              >
                <img class="w-[18px]" :src="buttonIcon" />
                <span class="text-[#FFF] text-[14px] font-normal">
                  {{ formatDate(completeTask.due_date) }}
                </span>
              </div>

              <div class="relative flex gap-2 dropdown">
                <div
                  class="optionsButton text-[20px] font-bold cursor-pointer"
                  @click="toggleDropdown(completeTask.id)"
                >
                  ...
                </div>

                <div
                  v-if="dropdownTaskStates[completeTask.id]"
                  class="absolute right-0 w-32 mt-2 bg-white border rounded-md shadow-lg dropdownMenu"
                >
                  <router-link
                    :to="{ name: 'EditTask', params: { id: completeTask.id } }"
                    class="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Edit
                  </router-link>
                  <div
                    class="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-200"
                    @click="confirmDelete(completeTask.id)"
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if="!hasTasks" class="w-full border border-solid border-[#D2D6DC] bg-white text-[20px] text-[#252F3F] text-center p-[20px] font-semibold">
      No task found.
    </div>
      
  </div>
</template>

<style></style>

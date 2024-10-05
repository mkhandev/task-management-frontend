<script setup>
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { ref, onMounted, computed } from "vue";

import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

import { useToast } from "vue-toast-notification";
const $toast = useToast();

import { useTaskStore } from "@/stores/taskStore";
const taskStore = useTaskStore();

onMounted(async () => {
  await taskStore.fetchAssignUser();
});

const editTaskData = ref("");

taskStore.getSingleTask(route.params.id)
.then((response) =>{
    editTaskData.value = {...response}
    loading.value = false;
})
.catch((error) =>{
  $toast.error(error.message)
})

const loading = ref(false);

const formSchema = yup.object({
    user_id: yup
        .array()
        .min(1, "At least one user must be assigned")
        .required("The user selection is required"),
    title: yup.string().required("The task name is required"),
    description: yup.string().required("The description is required"),
    due_date: yup.date().required("The due date is required"),
    status: yup.string().required("The task status is required")
});

const onSubmit = (values) => {

    loading.value = true;
    taskStore.updateTask(route.params.id, values)
    .finally(() =>{
        loading.value = false;
    });
};

const userList = computed(() => taskStore.getUserList);
const userIds = computed(() => taskStore.getTaskUserIds);

</script>

<template>
  <div>
    <h1
      class="font-semibold text-[28px] py-5 border-b border-solid border-[#D2D6DC] mb-5 text-[#161E2E]"
    >
    Edit New Task
    </h1>

    <div class="w-full">
      <Form @submit="onSubmit" :validation-schema="formSchema" v-loading="loading">

        <div class="mb-4 for_assign">
          <label for="user_id" class="block mb-1 text-gray-700"
            >Assign To</label
          >
          <Field name="user_id" v-model="userIds" v-slot="{ field, errorMessage }">
            <el-select
              v-model="field.value"
              multiple
              placeholder="Select user"
              class="w-full bg-white"
              @change="(value) => field.onChange(value)"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <div class="text-sm text-red-500" v-if="errorMessage">{{ errorMessage }}</div>
          </Field>

        </div>

        <div class="mb-4">
          <label for="title" class="block mb-1 text-gray-700">Task Name</label>
          <Field name="title" v-model="editTaskData.title" v-slot="{ field, errors, errorMessage }">
            <input
              type="text"
              class="block mb-1 text-gray-700 border border-solid border-[#e5e7eb] p-2 focus:outline-none bg-white w-full"
              placeholder="Enter your task name"
              v-bind="field"
              :class="{ 'border-red-500': errors.length !== 0 }"
            />

            <div class="text-sm text-red-500" v-if="errors.length !== 0">
              {{ errorMessage }}
            </div>
          </Field>
        </div>

        <div class="mb-4">
          <label for="due_date" class="block mb-1 text-gray-700">Due Date</label>
          <Field name="due_date"  v-model="editTaskData.due_date" v-slot="{ field, errors, errorMessage }">
            <input
              type="date"
              class="block mb-1 text-gray-700 border border-solid border-[#e5e7eb] p-2 focus:outline-none bg-white w-full"
              placeholder="Enter your task name"
              v-bind="field"
              :class="{ 'border-red-500': errors.length !== 0 }"
            />

            <div class="text-sm text-red-500" v-if="errorMessage">
              {{ errorMessage }}
            </div>
          </Field>
        </div>

      
        <div class="mb-4">
          <label for="description" class="block mb-1 text-gray-700"
            >Describe Your Answer</label
          >
          <Field name="description"  v-model="editTaskData.description" v-slot="{ field, errors, errorMessage }">
            <textarea
              class="block mb-1 text-gray-700 border border-solid border-[#e5e7eb] p-2 focus:outline-none bg-white w-full"
              placeholder="Describe your answer here....."
              v-bind="field"
              :class="{ 'border-red-500': errors.length !== 0 }"
            ></textarea>

            <div class="text-sm text-red-500" v-if="errors.length !== 0">
              {{ errorMessage }}
            </div>
          </Field>
        </div>

        <div class="mb-4">
          <label for="status" class="block mb-1 text-gray-700">Status</label>
          <Field name="status" v-model="editTaskData.status" v-slot="{ field, errors, errorMessage }">
            <select
              v-bind="field"
              class="block mb-1 text-gray-700 border border-solid border-[#e5e7eb] p-2 focus:outline-none bg-white w-full"
              :class="{ 'border-red-500': errors.length !== 0 }"
            >
              <option value="">Select status</option>
              <option value="To Do">To Do</option>
              <option value="Work In Progress" selected>Work In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Complete">Complete</option>
            </select>
            <div class="text-sm text-red-500" v-if="errorMessage">{{ errorMessage }}</div>
          </Field>
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-center gap-3">
          <button
            type="button"
            class="px-10 py-3 text-[16px] text-[#6B7280] bg-[#E5E7EB] rounded-[7px]"
            @click="() => router.push({ name: 'Dashboard' })"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-10 py-3 text-[16px] text-white bg-[#BE1E2D] rounded-[7px]"
          >
            Update
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<style>
.for_assign .el-select__wrapper{
  height: 42px;
}
</style>

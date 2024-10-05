<script setup>
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

import { useTaskStore } from "@/stores/taskStore";
const taskStore = useTaskStore();

import Loader from "@/utils/Loader.vue";

const router = useRouter();
const isLoading = ref(false);
let errorMessage = ref(false);

const formSchema = yup.object({
  name: yup
    .string()
    .required("The name is required")
    .min(1, "Name must be at least 3 characters")
    .max(255, "Name must not exceed 255 characters"),
  email: yup
    .string()
    .required("The email is required")
    .email("Not a valid email"),
  password: yup
    .string()
    .required("The password is required")
    .min(8, "Password must be at least 8 characters"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
});

async function onSubmit(values, { resetForm }) {
  isLoading.value = true;

  try {
    await taskStore.register(values);
    resetForm();
  } catch (error) {
    console.log(error);
    errorMessage.value = "Registration failed.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <Loader v-if="isLoading" class="mt-[30px]" />

    <div
      class="w-full md:w-1/3 mt-[50px] mx-auto border border-solid border-[#e5e7eb] p-5"
      v-if="!isLoading"
    >
      <Form @submit="onSubmit" :validation-schema="formSchema">
        <h1 class="text-center text-[20px]">Sign Up</h1>

        <h1
          v-if="errorMessage"
          class="text-[18px] mt-[7px] mb-1 font-semibold text-center text-red-500"
        >
          {{ errorMessage }}
        </h1>

        <div class="mb-4">
          <label for="name" class="block mb-1 text-gray-700">Name</label>
          <Field name="name" value="" v-slot="{ field, errors, errorMessage }">
            <input
              type="text"
              class="block mb-1 text-gray-700 border border-solid border-[#e5e7eb] p-2 focus:outline-none w-full"
              placeholder="Enter your Name"
              v-bind="field"
              :class="{ 'border-red-500': errors.length != 0 }"
            />

            <div class="text-sm text-red-500" v-if="errors.length !== 0">
              {{ errorMessage }}
            </div>
          </Field>
        </div>

        <div class="mb-4">
          <label for="email" class="block mb-1 text-gray-700">Email</label>
          <Field name="email" value="" v-slot="{ field, errors, errorMessage }">
            <input
              type="text"
              class="block mb-1 text-gray-700 border border-solid border-[#e5e7eb] p-2 focus:outline-none w-full"
              placeholder="Enter your email"
              v-bind="field"
              :class="{ 'border-red-500': errors.length != 0 }"
            />

            <div class="text-sm text-red-500" v-if="errors.length !== 0">
              {{ errorMessage }}
            </div>
          </Field>
        </div>

        <div class="mb-4">
          <label for="password" class="block mb-1 text-gray-700"
            >Password</label
          >
          <Field
            name="password"
            value=""
            v-slot="{ field, errors, errorMessage }"
          >
            <input
              type="password"
              class="block mb-1 text-gray-700 border border-solid border-[#e5e7eb] p-2 focus:outline-none w-full"
              placeholder="Enter your password"
              v-bind="field"
              :class="{ 'border-red-500': errors.length !== 0 }"
            />
            <div class="text-sm text-red-500" v-if="errors.length !== 0">
              {{ errorMessage }}
            </div>
          </Field>
        </div>

        <div class="mb-4">
          <label for="password_confirmation" class="block mb-1 text-gray-700"
            >Password confirmation</label
          >
          <Field
            name="password_confirmation"
            value=""
            v-slot="{ field, errors, errorMessage }"
          >
            <input
              type="password"
              class="block mb-1 text-gray-700 border border-solid border-[#e5e7eb] p-2 focus:outline-none w-full"
              placeholder="Enter your password_confirmation"
              v-bind="field"
              :class="{ 'border-red-500': errors.length !== 0 }"
            />
            <div class="text-sm text-red-500" v-if="errors.length !== 0">
              {{ errorMessage }}
            </div>
          </Field>
        </div>

        <button type="submit" class="p-2 text-white bg-blue-500 rounded">
          Register
        </button>
      </Form>
    </div>
  </div>
</template>

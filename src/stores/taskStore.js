import { defineStore } from "pinia";
import axios from "axios";
import router from "@/router";

import axiosInstance from "@/utils/Axios";

import { useToast } from "vue-toast-notification";
const $toast = useToast();

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const token = localStorage.getItem("token");

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    tasks: [],
    usersList: [],
    taskUserIds: [],
    loaded: false,
    isAuthenticated: false,
  }),
  getters: {
    getUserList(state) {
      let userData = [];
      userData = state.usersList.map((user) => ({
        id: user.id,
        name: user.name,
      }));
      return userData;
    },
    getTaskUserIds(state) {
      return state.taskUserIds;
    },
  },
  actions: {
    async fetchTasks(filters = {}) {
      try {
        const response = await axiosInstance.get(`${apiUrl}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: filters,
        });
        this.tasks = response.data.data;
        this.loaded = true;
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    },
    async fetchAssignUser() {
      try {
        const response = await axiosInstance.get(`${apiUrl}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.usersList = response.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async addTask(formData) {
      try {
        const response = await axiosInstance.post(`${apiUrl}/tasks`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        router.push({ name: "Dashboard" });
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getSingleTask(id) {
      try {
        const response = await axiosInstance.get(`${apiUrl}/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.taskUserIds = response.data.data.users.map((user) => user.id);
        return response.data.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateTask(id, formData) {
      try {
        const response = await axiosInstance.put(`${apiUrl}/tasks/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        $toast.success("Task updated successfully!");

        router.push({ name: "Dashboard" });
        return true;
      } catch (error) {
        $toast.error(error.message);
        throw new Error(error);
      }
    },
    async removeTask(id) {
      try {
        await axiosInstance.delete(`${apiUrl}/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        $toast.success("Task successfully deleted !!");

        router.push({ name: "Dashboard" });
      } catch (error) {
        $toast.error(error.response.data.message);
        throw new Error(error);
      }
    },
    async register(formData) {
      try {
        // Step 1: Register the user
        await axiosInstance.post(`${apiUrl}/register`, formData);
        $toast.success("Registration successful!");

        // Step 2: Redirect to Login
        router.push({ name: "Login" });
      } catch (error) {
        $toast.error(error.response.data.message || "Registration failed");
        throw new Error(error);
      }
    },
    async login(formData) {
      try {
        const response = await axiosInstance.post(`${apiUrl}/login`, formData);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        this.isAuthenticated = true;

        router.push({ name: "Dashboard" });
      } catch (error) {
        throw new Error(error.response.data.error || "Login failed");
      }
    },
    async signOut() {
      try {
        await axiosInstance.post(`${apiUrl}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.isAuthenticated = false;

        router.push({ name: "Login" });

      } catch (error) {
        throw new Error(error);
      }
    },
    async checkAuthentication() {
      const token = localStorage.getItem("token");
      this.isAuthenticated = !!token; 
    }
  },
});

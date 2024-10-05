import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LoginLayout from "@/layouts/LoginLayout.vue";

import Login from "@/pages/Login.vue";
import Dashboard from "@/pages/Dashboard.vue";
import AddTask from "@/pages/AddTask.vue";
import EditTask from "@/pages/editTask.vue";
import Register from "@/pages/Register.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: LoginLayout,
      children: [
        {
          path: '',
          name: "Login",
          component: Login,
        },
        {
          path: 'register',
          name: "Register",
          component: Register,
        },
      ],
    },
    {
      path: "/",
      component: DefaultLayout,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: "add-task",
          name: "AddTask",
          component: AddTask,
        },
        {
          path: "edit-task/:id",
          name: "EditTask",
          component: EditTask,
        },
      ],
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {

  let isAuthenticated  = false;
  const token = localStorage.getItem("token");

  if(token){
    isAuthenticated = true;
  } else {
    isAuthenticated = false;
  }
  

  // Protecting routes
  if (["Dashboard", "AddTask", "EditTask"].includes(to.name) && !isAuthenticated) {
    next({ name: "Login" }); // Redirect to login if not authenticated
  } else if (isAuthenticated && (to.name === "Login" || to.name === "Register")) {
    next({ name: "Dashboard" }); // Redirect to Dashboard if already logged in
  } else {
    next(); // Proceed to the route
  }
});


export default router;

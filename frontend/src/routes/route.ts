import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import Home from "../page/Home.vue";
import Login from "../page/Login.vue";
import Register from '../page/Register.vue';
import Profile from "../page/Profile.vue";
import Chat from "../page/Chat.vue";
import Member from "../page/Member.vue";
import NotFound from "../page/NotFound.vue";

const requireAuth = (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const token = localStorage.getItem('token');
    
    if (to.meta.requiresAuth && !token) {
      next('/login');
    } else {
      next();
    }
  }

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
    },
    {
        path: '/members',
        name: 'Member',
        component: Member,
        meta: {
            requiresAuth: true 
        }
    },
    {
        path: '/chat',
        name: 'Chat',
        component: Chat,
        meta: {
            requiresAuth: true 
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
      }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Add navigation guard
router.beforeEach(requireAuth)

export default router

import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        redirect: '/course',
        children:[
            {
                path: 'course',
                name: 'Course',
                component: () => import('@/views/CourseView.vue')
            },
            {
                path: 'class',
                name: 'Class',
                component: () => import('@/views/ClassView.vue')
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue')
    }
]

const router = createRouter(
    {
        history: createWebHashHistory(),
        routes: routes,
        linkActiveClass: 'router-active'
    }
)

export default router
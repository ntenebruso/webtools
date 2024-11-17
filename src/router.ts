import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import { tools } from "./tools";

declare module "vue-router" {
    interface RouteMeta {
        title?: string;
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: () => import("./views/Index.vue"),
        meta: {
            title: "Home",
        },
    },
    ...tools.map((tool) => ({
        path: tool.path,
        component: tool.component,
        meta: {
            title: tool.title,
        },
    })),
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} | WebTools` : "WebTools";
    next();
});

export default router;

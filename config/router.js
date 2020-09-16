import Vue from 'vue';
import VueRouter from 'vue-router';
import ArticleList from '../src/views/article/list/list.vue';
import ArticleDetail from '../src/views/article/detail/detail.vue';
import ArticleEdit from '../src/views/article/edit/edit.vue';
import Login from '../src/views/mine/login/login.vue';
import PersonCenter from '../src/views/mine/personCenter/personalCenter.vue';
import Sign from '../src/views/sign/sign.vue';
import DictionaryManage from '../src/views/system/dictionaryManage.vue';
import Search from '../src/views/search/search.vue';

Vue.use(VueRouter);

const routes = [
    {
        name: 'root',
        path: '/',
        showFooter: true,           // 是否展示底部备案等信息
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
    },
    {
        name: 'personCenter',
        path: '/mine/personCenter',
        component: PersonCenter,
    },
    {
        name: 'sign',
        path: '/sign',
        component: Sign,
    },
    {
        name: 'search',
        path: '/search',
        component: Search,
    },
    {
        name: 'articleList',
        path: '/article/list/:page?',
        component: ArticleList,
    },
    {
        name: 'articleDetail',
        path: '/article/detail/:id',
        component: ArticleDetail,
    },
    {
        name: 'articleEdit',
        path: '/article/edit',
        component: ArticleEdit,
    },
    {
        name: 'systemDictionaryManage',
        path: '/system/dictionaryManage',
        component: DictionaryManage,
    },
];

const router = new VueRouter({
    routes,
    mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash', // 开发环境使用hash模式,生产环境使用history模式
});

// 排除component外的所有属性，用于路由导航设置
export const routerConfig = routes.map(route => {
    const { component, ...props } = route;
    return props;
})

export default router;
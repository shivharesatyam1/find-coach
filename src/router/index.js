import Vue from 'vue'
import VueRouter from 'vue-router'

// import CoachDetail from '../pages/coaches/CoachDetail.vue';
import CoachesList from '../pages/coaches/CoachesList.vue';
// import CoachRegistration from '../pages/coaches/CoachRegistration.vue';
// import ContactCoach from '../pages/requests/ContactCoach.vue';
// import RequestsReceived from '../pages/requests/RequestsReceived.vue';
// import UserAuth from '../pages/auth/UserAuth.vue'
// import NotFound from '../pages/NotFound.vue';

import store from '../store/index.js'

const CoachDetail = () => import('../pages/coaches/CoachDetail.vue')
const CoachRegistration = () => import('../pages/coaches/CoachRegistration.vue')
const ContactCoach = () => import('../pages/requests/ContactCoach.vue')
const RequestsReceived = () => import('../pages/requests/RequestsReceived.vue')
const UserAuth = () => import('../pages/auth/UserAuth.vue');
const NotFound = () => import('../pages/NotFound.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/coaches' },
  { path: '/coaches', component: CoachesList },
  { 
    path: '/coaches/:id', 
    component: CoachDetail,
    props: true,
    children: [
        { path: 'contact', component: ContactCoach } //coaches/c1/contact
    ]
  },
  { path: '/register', component: CoachRegistration, meta: { requiresAuth: true } },
  { path: '/requests', component: RequestsReceived, meta: { requiresAuth: true } },
  { path: '/auth', component: UserAuth, meta: { requiresUnAuth: true } },
  { path: '/:notFound(.*)', component: NotFound }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//navigation guard to check user is login so that he can only access the extra pages like requests, contact coaches etc
// this is global navigation guard
router.beforeEach(function(to, from, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated){
    // next(false);
    next('/auth');
  } else if (to.meta.UnrequiresAuth && store.getters.isAuthenticated) {
    next('/coaches');
  } else {
    next();
  }
});

export default router

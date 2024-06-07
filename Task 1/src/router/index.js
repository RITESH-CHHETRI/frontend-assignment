import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../components/UserLogin.vue';
import UserRegister from '../components/UserRegister.vue';
import ArithmeticOperation from '../components/ArithmeticOperation.vue';
import CalculationHistory from '../components/CalculationHistory.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/register', name: 'UserRegister', component: UserRegister },
  { path: '/arithmetic', name: 'ArithmeticOperation', component: ArithmeticOperation },
  { path: '/history', name: 'CalculationHistory', component: CalculationHistory },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

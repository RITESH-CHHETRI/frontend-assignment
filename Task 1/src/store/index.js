// store/index.js
import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    token: localStorage.getItem('token') || '',
    calculations: [],
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = '';
      localStorage.removeItem('token');
    },
    setCalculations(state, calculations) {
      state.calculations = calculations;
    },
  },
  actions: {
    loginUser({ commit }, token) {
      commit('setToken', token);
    },
    logoutUser({ commit }) {
      commit('clearToken');
    },
    fetchCalculations({ commit, state }) {
      const token = state.token;
      axios.get('http://localhost:5000/calculations', {
        headers: {
          Authorization: token,
        },
      })
      .then(response => {
        commit('setCalculations', response.data.calculations);
      })
      .catch(error => {
        console.error('There was an error fetching calculations!', error);
      });
    },
  },
  getters: {
    isAuthenticated: state => !!state.token,
    calculations: state => state.calculations,
  },
});

export default store;

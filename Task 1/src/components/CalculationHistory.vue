// CalculationHistory.vue
<template>
  <div>
    <nav class="navbar">
      <div class="navbar-title">Calculator</div>
      <div class="navbar-buttons">
        <button class="btn btn-secondary" @click="navigateTo('/login')">Login</button>
        <button class="btn btn-secondary" @click="navigateTo('/arithmetic')">Go back</button>
      </div>
    </nav>
    <div class="background"></div>
    <div class="history-container">
      <h2>Calculation History</h2>
      <ul class="calculation-list">
        <li v-for="calc in calculations" :key="calc.id" class="calculation-item">
          <div class="calculation-details">
            <span class="calculation-operation">{{ calc.operation }}</span>
            <span class="calculation-numbers">{{ calc.num1 }} and {{ calc.num2 }}</span>
            <span class="calculation-result">= {{ calc.result }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['calculations']),
  },
  methods: {
    ...mapActions(['fetchCalculations']),
    navigateTo(path) {
      this.$router.push(path);
    },
  },
  created() {
    this.fetchCalculations();
  },
};
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000; /* Fallback color */
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: brightness(70%);
  z-index: -1;
}

.history-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 60px; /* Adjust this value to avoid navbar overlap */
  color: #fff; /* Ensure text is readable over the background */
}

h2 {
  margin-bottom: 20px;
  font-size: 2em;
  color: #fff; /* Ensure title is readable over the background */
}

.calculation-list {
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
}

.calculation-item {
  background-color: rgba(248, 249, 250, 0.9); /* Slight transparency for better readability */
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.calculation-item:hover {
  transform: translateY(-5px);
}

.calculation-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
}

.calculation-operation {
  font-weight: bold;
  color: #007bff;
}

.calculation-numbers {
  font-style: italic;
  color: #6c757d;
}

.calculation-result {
  font-weight: bold;
  color: #28a745;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #6c757d;
  color: white;
  z-index: 1; /* Ensure the navbar is above other elements */
}

.navbar-title {
  font-size: 1.5em;
  font-weight: bold;
}

.navbar-buttons {
  display: flex;
  gap: 10px;
}
</style>

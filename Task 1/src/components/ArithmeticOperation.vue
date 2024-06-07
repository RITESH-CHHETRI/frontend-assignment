<template>
  <div>
    <nav class="navbar">
      <div class="navbar-title">Calculator</div>
      <div class="navbar-buttons">
        <button class="btn-secondary" @click="navigateTo('/login')">Login</button>
        <button class="btn-secondary" @click="navigateTo('/history')">History</button>
      </div>
    </nav>
    <div class="background"></div>
    <div class="calculator-container">
      <div class="calculator">
        <div class="display">
          <input v-model="num1" type="text" class="form-control" placeholder="Number 1" :readonly="currentInput === 'result'" />
          <span v-if="currentOperation" class="operator">{{ currentOperation }}</span>
          <input v-model="num2" type="text" class="form-control" placeholder="Number 2" :readonly="currentInput === 'result'" />
          <p v-if="currentInput === 'result'" class="result">Result: {{ result }}</p>
        </div>
        <div class="buttons">
          <button class="btn btn-light" @click="appendNumber(1)">1</button>
          <button class="btn btn-light" @click="appendNumber(2)">2</button>
          <button class="btn btn-light" @click="appendNumber(3)">3</button>
          <button class="btn btn-secondary" @click="setOperation('+')">+</button>
          <button class="btn btn-light" @click="appendNumber(4)">4</button>
          <button class="btn btn-light" @click="appendNumber(5)">5</button>
          <button class="btn btn-light" @click="appendNumber(6)">6</button>
          <button class="btn btn-secondary" @click="setOperation('-')">-</button>
          <button class="btn btn-light" @click="appendNumber(7)">7</button>
          <button class="btn btn-light" @click="appendNumber(8)">8</button>
          <button class="btn btn-light" @click="appendNumber(9)">9</button>
          <button class="btn btn-secondary" @click="setOperation('*')">x</button>
          <button class="btn btn-light" @click="appendNumber(0)">0</button>
          <button class="btn btn-warning" @click="clearNumbers">C</button>
          <button class="btn btn-light" @click="appendDecimal">.</button>
          <button class="btn btn-secondary" @click="setOperation('/')">÷</button>
          <button class="btn btn-primary" @click="performOperation" style="grid-column: span 4;">=</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'ArithmeticOperation',
  data() {
    return {
      num1: '',
      num2: '',
      currentInput: 'num1',
      currentOperation: null,
      result: null,
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    appendNumber(number) {
      if (this.currentInput === 'num1') {
        this.num1 += number;
      } else {
        this.num2 += number;
      }
    },
    appendDecimal() {
      if (this.currentInput === 'num1' && !this.num1.includes('.')) {
        this.num1 += '.';
      } else if (this.currentInput === 'num2' && !this.num2.includes('.')) {
        this.num2 += '.';
      }
    },
    clearNumbers() {
      this.num1 = '';
      this.num2 = '';
      this.result = null;
      this.currentInput = 'num1';
      this.currentOperation = null;
    },
    setOperation(operation) {
      this.currentOperation = operation;
      this.currentInput = 'num2';
    },
    performOperation() {
      if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
      }

      const token = localStorage.getItem('token');
      let endpoint;
      switch (this.currentOperation) {
        case '+':
          endpoint = 'add';
          break;
        case '-':
          endpoint = 'subtract';
          break;
        case '*':
          endpoint = 'multiply';
          break;
        case '/':
          endpoint = 'divide';
          break;
        default:
          console.error('Invalid operation');
          return;
      }

      axios.post(`http://localhost:5000/${endpoint}`, {
        num1: parseFloat(this.num1),
        num2: parseFloat(this.num2),
      }, {
        headers: {
          Authorization: token,
        },
      })
      .then(response => {
        this.result = response.data.result;
        this.currentInput = 'result';
      })
      .catch(error => {
        console.error(`There was an error performing ${this.currentOperation}!`, error);
      });
    },
    navigateTo(path) {
      this.$router.push(path);
    },
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

.calculator-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px); /* Adjust height to account for navbar */
  padding-top: 100px; /* Add padding to prevent overlap with navbar */
}

.calculator {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  max-width: 300px;
  width: 100%;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.6); /* Added box shadow for 3D effect */
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

.display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.form-control {
  margin-bottom: 10px;
  text-align: center;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.btn {
  width: 100%;
  padding: 20px;
  font-size: 1.2em;
}

.btn-light {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-warning {
  background-color: #ffc107;
  border: none;
  color: white;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.operator {
  font-size: 1em;
}

.result {
  font-size: 1em;
  font-weight: bold;
}
</style>

<template>
  <div class="background"></div>
  <div class="containall">
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Register</h5>
              <form @submit.prevent="register" class="form">
                <div class="form-group">
                  <label for="username">Username</label>
                  <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter username" required />
                </div>
                <div class="form-group mt-3">
                  <label for="password">Password</label>
                  <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control" id="password" placeholder="Enter password" required />
                    <div class="input-group-append">
                      <button type="button" class="btn btn-outline-secondary" @click="togglePassword">
                        <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary mt-4 btn-block">Register</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserRegister',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    register() {
      axios.post('http://localhost:5000/register', {
        username: this.username,
        password: this.password,
      })
      .then(() => {
        console.log('User registered successfully');
        this.$router.push('/login');
      })
      .catch(error => {
        console.error('There was an error registering!', error);
      });
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
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: brightness(70%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
}

.containall {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
}

.card {

  background-color: #ffffff; /* White background for the card */
  border: none;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Shadow effect */
  padding: 20px;
  
}

.form {
  animation: fadeInUp 1s ease; /* Fade-in animation */
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-primary {
  background-color: #007bff; /* Blue color for the button */
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3; /* Darker blue color on hover */
}

.btn-block {
  animation: slideInRight 1s ease; /* Slide-in animation for the button */
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.input-group-append .btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>

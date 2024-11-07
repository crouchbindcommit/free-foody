<template>
    <v-card>
      <v-card-title>Re-enter Your Password</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="password"
            label="Password"
            :rules="passwordRules"
            outlined
            type="password"
          />
          <v-btn @click="submitPassword">Submit</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const passwordVerified = ref(false);  // Declare passwordVerified
  const router = useRouter();
  const errorMessage = ref('');
  const password = ref('');
  const valid = ref(false);
  const user = ref('');
  
  // Password validation rules for login
  const passwordRules = computed(() => [
      (value) => !!value || 'This field is required.',  // Checks if the value is not empty
      (value) => (value && value.length >= 8) || 'Min 8 characters required.',  // Checks if the value is at least 8 characters
  ]);
  
  const submitPassword = async () => {
      // Clear any previous error message or flag
      errorMessage.value = '';
  
      try {
          // Call the verify-password API endpoint
          const response = await axios.post('https://free-food-api.onrender.com/api/users/verify-password', {
              username: user.value,
              password: password.value,
          });
  
          // If password verification is successful, navigate to the settings page
          if (response.status === 200) {
            localStorage.setItem('passwordVerified', 'true');
              router.push('/Settings'); // Navigate to settings page or wherever you want
          }
      } catch (error) {
          // Handle errors: invalid password, user not found, etc.
          console.error('Error during password verification:', error);
          if (error.response && error.response.data) {
              errorMessage.value = error.response.data.error || 'An error occurred during password verification.';
          } else {
              errorMessage.value = 'An unexpected error occurred. Please try again.';
          }
      }
  };
  
  onMounted(async () => {
    const uname = localStorage.getItem('user'); // Retrieve userId from localStorage
    user.value = uname || ''; // Ensure the username is set
  });
  </script>
  
  <style scoped>
  /* Optional: Add custom styles */
  </style>
  
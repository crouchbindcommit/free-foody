<template>
  <v-toolbar app :style="{ background: 'linear-gradient(83deg, #FF7201, #FF9A33)' }">
    <v-toolbar-title>Welcome, {{ fname }}!</v-toolbar-title>
    <v-spacer></v-spacer>

    <!-- Show these buttons only if the user is logged in -->
    <template v-if="isLoggedIn">
      <v-btn to="/Dashboard" text>Dashboard</v-btn>
    <!--   <v-btn to="/Help" text>Help</v-btn> -->
      <v-btn to="/Resources" text>Resources</v-btn>
      <v-btn to="/Settings" text>Settings</v-btn>
    </template>

    <!-- Show the Login button if the user is not logged in -->
    <template v-else>
      <v-btn to="/login" text>Login</v-btn>
      <v-btn to="/createAccount" text>Sign Up</v-btn>
    </template>
  </v-toolbar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const fname = ref('Guest'); // Default value if no user is logged in
const isLoggedIn = ref(false); // Keep track of whether the user is logged in

const fetchUserDetails = async (userId) => {
  try {
    const response = await axios.get(`https://free-food-api.onrender.com/api/users/${userId}`); // Your API endpoint
    fname.value = response.data.fname; // Assuming the API returns { fname: 'John' }
    isLoggedIn.value = true; // Set logged in status to true
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

onMounted(async () => {
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
  if (userId && userId !== '') {
    await fetchUserDetails(userId); // Wait for the fetch to complete before proceeding
  } else {
    isLoggedIn.value = false; // Set logged out status if no userId is found
  }
});

// Watch for changes in `isLoggedIn` to update localStorage
watch(isLoggedIn, (newVal) => {
  if (newVal) {
    // Store the logged-in userId into localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      localStorage.setItem('userId', userId); // Ensure it remains in localStorage
    }
  } else {
    localStorage.removeItem('userId'); // Clear the userId from localStorage when logged out
  }
});

</script>

<style scoped>
/* You can style your toolbar here */
</style>

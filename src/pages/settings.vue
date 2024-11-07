<template>
    <v-card class="pa-6">
      <v-card-title class="headline">User Settings</v-card-title>
  
      <!-- Log Out Button -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <v-btn @click="logOut" color="grey" class="pa-3 w-100">Log Out</v-btn>
        </v-col>
      </v-row>
  
      <v-divider class="my-6"></v-divider>
  
      <!-- Delete Account Button -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <v-btn @click="deleteUser" color="red" class="pa-3 w-100">Delete Account</v-btn>
        </v-col>
      </v-row>
  
      <v-divider class="my-6"></v-divider>
  
      <!-- Update Username Section -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newUsername"
            label="New Username"
            :rules="usernameRules"
            outlined
            dense
            clearable
            class="mb-4 w-100"
          />
        </v-col>
      </v-row>
  
      <v-divider class="my-6"></v-divider>
  
      <!-- Update Password Section -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newPassword"
            label="New Password"
            :rules="passwordRules"
            outlined
            dense
            clearable
            type="password"
            class="mb-4 w-100"
          />
        </v-col>
      </v-row>
  
      <v-divider class="my-6"></v-divider>
  
      <!-- Update Button -->
      <v-row justify="center" class="mt-5">
        <v-col cols="12" md="6">
          <v-btn @click="updateUser" color="primary" class="rounded-xl pa-4 w-100" large>Update</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const newUsername = ref('');
  const newPassword = ref('');
  const valid = ref(true);
  
  // Define validation rules for username and password
  const usernameRules = [(v) => !!v || 'Username is required'];
  const passwordRules = [
    (v) => !!v || 'Password is required',
    (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
  ];
  
  // Get the current user ID from local storage (assumed to be stored after login)
  const userId = localStorage.getItem('userId');
  const router = useRouter();
  
  // Function to update user details
  const updateUser = async () => {
    if (!valid.value) return; // Prevent submission if form is not valid
  
    try {
      // Prepare the request data
      const updatedData = {};
      if (newUsername.value) updatedData.username = newUsername.value;
      if (newPassword.value) updatedData.password = newPassword.value;
  
      // Make the API request to update user details
      const response = await axios.put(`http://localhost:8000/api/users/${userId}`, updatedData);
  
      if (response.status === 200) {
        alert('User details updated successfully');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating user details');
    }
  };
  
  // Function to delete the user's account
  const deleteUser = async () => {
    try {
      const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (!confirmDelete) return;
  
      const response = await axios.delete(`http://localhost:8000/api/users/${userId}`);
  
      if (response.status === 200) {
        localStorage.removeItem('userId'); // Clear localStorage
        router.push('/'); // Redirect to login page
        alert('Account deleted successfully');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting account');
    }
  };
  
  // Function to log out the user
  const logOut = () => {
    localStorage.removeItem('userId'); // Clear localStorage
    localStorage.removeItem('fname');
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('passwordVerified');    
    router.push('/'); // Redirect to login page
    alert('Logged out successfully');
  };
  </script>
  
  <style scoped>
  /* Style for the action buttons */
  .v-btn {
    font-weight: 500;
    text-transform: none;
    min-width: 120px;
  }
  
  /* Style for the update button */
  .v-btn.primary {
    background-color: #1976d2;
    color: white;
    transition: background-color 0.3s ease;
  }
  
  .v-btn.primary:hover {
    background-color: #1565c0;
  }
  
  /* Style for text fields */
  .v-text-field {
    background-color: #f5f5f521;
    border-radius: 8px;
    padding: 8px;
  }
  
  /* Form card padding */
  .pa-6 {
    padding: 32px !important;
  }
  
  .headline {
    font-weight: 700;
    font-size: 1.5rem;
  }
  
  /* Space out sections */
  .mb-4 {
    margin-bottom: 16px;
  }
  
  /* Divider style */
  .v-divider {
    margin: 24px 0;
    border-color: #e0e0e0;
  }
  
  /* Button width adjustment */
  .w-100 {
    width: 100%;
  }
  </style>
  
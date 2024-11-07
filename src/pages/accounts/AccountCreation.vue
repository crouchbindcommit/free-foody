<template>

  <v-card>
    <v-card-title> Thank you for making an account with Foodify! </v-card-title>
    <v-card-text> If you are not a new user, click to be redirected to the login page.
    </v-card-text>
    <v-btn @click="GoToLogin()">Go to Login Page</v-btn>
  </v-card>
  <br>
  <NewUserValidation @submit="setUserDetails" />
  
  <v-container>
    <!-- Message with clickable Terms of Service link -->
    <p>
      By creating an account, you are agreeing to our 
      <v-btn text @click="showDialog = true">Terms of Service</v-btn>.
    </p>

    <!-- Dialog for Terms of Service -->
    <v-dialog v-model="showDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <h1>Terms of Service for Free Food Finder</h1>
        </v-card-title>
        <v-card-subtitle>
          <p><strong>Effective Date:</strong> [Insert Date]</p>
        </v-card-subtitle>
        <v-card-text class="terms-content">
          <h3>1. Acceptance of Terms</h3>
          <p>By using the Free Food Finder app, you agree to these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use the Service.</p>

          <h3>2. Eligibility</h3>
          <p>To use Free Food Finder, you must:</p>
            <ul>
              <li>Be at least 18 years old, or have the consent of a parent or guardian if you are under 18.</li>
              <li>Be a current student, faculty, or staff member at the University of Tennessee, Knoxville (UTK) or meet other specific eligibility criteria as outlined in the Service.</li>
            </ul>

        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

</template>

<script setup>
import NewUserValidation from "@/components/accounts/newUserValidation.vue"
import { ref } from 'vue';
import axios from 'axios'; // Make sure you have axios installed

import { useRouter } from 'vue-router';
const router = useRouter();

const showDialog = ref(false);

const userDetails = ref({
  fname: '',
  lname: '',
  email: '',
  username: '',
  password: ''
});

function setUserDetails(details) {
  userDetails.value = { ...userDetails.value, ...details };
}

async function createAccount() {
  try {
    const response = await axios.post('https://free-food-api.onrender.com/api/users', userDetails.value);
  } catch (error) {
    console.error('Error creating account:', error);
    // Handle error (e.g., show an error message)
  }
}

function GoToLogin() {
  router.push('/login');
}
</script>

<style scoped>
.terms-content {
  max-height: 400px; /* Set a max height for scrollable content */
  overflow-y: auto; /* Enable vertical scrolling */
  padding-right: 10px; /* Ensure scrollbar doesn't hide text */
}

v-container {
  padding: 2rem;
}

v-card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

v-card-subtitle {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

v-card-text {
  font-size: 1rem;
}
</style>

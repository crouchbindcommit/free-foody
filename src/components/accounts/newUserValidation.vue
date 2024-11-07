<template>
  <v-card>
    <v-card-title> Start making your Account: </v-card-title>
    <v-card-text> Before getting into the fun stuff, we need some demographics to verify you're a real student at UTK. This information isn't shared with anyone else, and is only checked if you violate our terms and conditions. </v-card-text>
    <v-form ref="formRef" v-model="isValid">
      <!-- First Name -->
      <v-text-field 
        name="fname" 
        label="First Name" 
        v-model="fname"
        :rules="nameRules"
        hint="Enter your first name here."
        required
      ></v-text-field>
  
      <!-- Last Name -->
      <v-text-field 
        name="lname" 
        label="Last Name" 
        v-model="lname"
        :rules="nameRules"
        hint="Enter your last name here."
        required
      ></v-text-field>
  
      <!-- UTK E-mail -->
      <v-text-field 
        name="email" 
        label="UTK E-mail" 
        v-model="email"
        :rules="emailRules"
        hint="Enter your UTK e-mail here."
        required
      ></v-text-field>

      <v-card-title> Username and Password: </v-card-title>
      <v-card-text> Remember not to share your password with anyone else. It is your choice if your username is public or private. </v-card-text>
      <!-- Username -->
      <v-text-field 
        name="username" 
        label="Pick your username." 
        v-model="uname"
        :rules="uNameRules"
        hint="Enter your new username here."
        required
      ></v-text-field>
  
      <!-- Password -->
      <v-text-field 
        name="password" 
        label="Set your password." 
        v-model="pname"
        :rules="passRules"
        hint="Enter your new password here."
        required
        type="password"
      ></v-text-field>
  
      <!-- Confirm Password -->
      <v-text-field 
        name="password-confirm" 
        label="Confirm your password." 
        v-model="pname2"
        :rules="confirmPasswordRules"
        hint="Confirm your new password here."
        required
        type="password"
      ></v-text-field>
  
      <!-- Error message if form is invalid -->
      <v-alert v-if="showError" type="error" dismissible>
        Please correct the errors in the form before submitting.
      </v-alert>
      
      <!-- Submit Button -->
      <v-btn @click="submit()" color="#FF7201">Create Account</v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import axios from 'axios';  // Import Axios
import { useRouter } from 'vue-router';
const router = useRouter();

// Define emits
const emit = defineEmits<{
  (event: 'submit', details: { fname: string; lname: string; email: string, username: string; password: string; }): void;
}>();

// Form state and fields
const fname = ref('');
const lname = ref('');
const email = ref('');
const uname = ref(''); // Username
const pname = ref(''); // Password
const pname2 = ref(''); // Confirm Password
const isValid = ref(false);
const showError = ref(false);

const formRef = ref<HTMLFormElement | null>(null); // For a basic HTML form


// Validation rules
const nameRules = computed(() => [
  (value: string) => !!value || 'This field is required.',
  (value: string) => (value || '').length <= 15 || 'Max 15 characters.',
]);

const uNameRules = computed(() => [
  (value: string) => !!value || 'This field is required.',
  (value: string) => (value || '').length <= 15 || 'Max 15 characters.',
  (value: string) => value === value.toLowerCase() || 'Username must be lowercase.',
]);

const emailRules = computed(() => [
  (value: string) => !!value || 'UTK E-mail is required.',
  (value: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@vols\.utk\.edu$/;
    return pattern.test(value) || 'E-mail must be a valid @vols.utk.edu address.';
  }
]);

const passRules = computed(() => [
  (value: string) => !!value || 'This field is required.',
  (value: string) => (value || '').length <= 16 || 'Max 16 characters.',
  (value: string) => (value || '').length >= 8 || 'Min 8 characters.',
  (value: string) => /[A-Z]/.test(value) || 'Must contain at least one uppercase letter.',
  (value: string) => /[a-z]/.test(value) || 'Must contain at least one lowercase letter.',
  (value: string) => /[0-9]/.test(value) || 'Must contain at least one number.',
  (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Must contain at least one special character.',
]);

const confirmPasswordRules = computed(() => [
  (value: string) => value === pname.value || 'Passwords do not match.',
]);

const submit = async () => {
  await nextTick(); // Ensure the form is mounted and accessible

  if (formRef.value) {
    // Validate the form and log the result
    const result = await formRef.value.validate();
   
    if (result) {
      showError.value = false;

      // Check if the username is already taken
      try {
        const usernameCheckResponse = await fetch(`https://free-food-api.onrender.com/api/users/check-username/${uname.value}`);
        const usernameCheckData = await usernameCheckResponse.json();

        if (!usernameCheckData.available) {
          showError.value = true; // Show error message for username taken
          return; // Stop further processing
        }

        const formData = {
          fname: fname.value,
          lname: lname.value,
          email: email.value,
          username: uname.value,
          password: pname.value,
        };

        // Send data to create the user
        const response = await fetch('https://free-food-api.onrender.com/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to create user');
        }

        // Get the user data (e.g., username and password) after successful account creation
        const data = await response.json();

        // Immediately log the user in using the created username and password
        const loginResponse = await axios.post('https://free-food-api.onrender.com/api/login', {
          username: uname.value,
          password: pname.value,
        });

        if (loginResponse.status === 200) {
          // Store user data in localStorage after successful login
          localStorage.setItem('userId', loginResponse.data.userId);  // Assuming the API returns userId
          localStorage.setItem('user', loginResponse.data.username);  // Storing the username
          localStorage.setItem('email', data.email);  // Storing the email

          // Redirect to the Dashboard after successful login
          router.push('/Dashboard');
        } else {
          // Handle failed login attempt
          showError.value = true;
          console.error('Login failed:', loginResponse.data.message);
        }
      } catch (error) {
        console.error('Error creating user:', error);
        showError.value = true; // Show an error message if needed
      }
    } else {
      showError.value = true;
    }
  } else {
    console.error("Form reference is null or undefined");
  }
};

</script>

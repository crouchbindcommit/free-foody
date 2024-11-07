<template>
    <v-card>
        <v-card-title> Thank you for relying on Foodify. </v-card-title>
        <v-card-text> Don't have an account? Click to create one! </v-card-text>
        <v-btn @click="goToSignUp()"> Sign Up </v-btn>

        <!-- Username Field -->
        <v-text-field 
            name="username" 
            label="Enter your username." 
            v-model="uname" 
            :rules="usernameRules"
            hint="Enter your username here." 
            required
        ></v-text-field>

        <!-- Password Field -->
        <v-text-field 
            name="password" 
            label="Enter your password." 
            v-model="pname" 
            :rules="passwordRules"
            hint="Enter your password here." 
            required 
            type="password"
        ></v-text-field>

        <!-- Login Button and Feedback Message -->
        <v-row>
            <v-col>
                <v-btn @click="login">Log In</v-btn>
            </v-col>
        </v-row>
        <v-alert v-if="errorMessage" type="error" dismissible>{{ errorMessage }}</v-alert>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; 
import { AxiosError } from 'axios'; 
const router = useRouter();

function goToSignUp() {
    router.push('/createAccount');
}

const uname = ref('');
const pname = ref('');
const errorMessage = ref('');  // To store login error message

// Username validation rules
const usernameRules = computed(() => [
    (value: string) => !!value || 'This field is required.',
]);

// Password validation rules for login
const passwordRules = computed(() => [
    (value: string) => !!value || 'This field is required.',
    (value: string) => (value || '').length >= 8 || 'Min 8 characters required.',
]);

// Login function with API validation
const login = async () => {
    // Clear previous error message
    errorMessage.value = '';

    // Ensure both fields are valid before attempting to log in
    if (!uname.value || !pname.value) {
        errorMessage.value = 'Please fill out all required fields.';
        return;
    }

    try {
        // Send API request to verify login
        const response = await axios.post('https://free-food-api.onrender.com/api/login', {
            username: uname.value,
            password: pname.value,
        });

        // Check if the login was successful based on the response status
        if (response.status === 200) {
            localStorage.setItem('userId', response.data.userId); // Store userId here
            localStorage.setItem('user', response.data.username);
            // Redirect to the dashboard if login is successful
            router.push({ path: '/dashboard' });
        } else {
            errorMessage.value = response.data.message || 'Invalid username or password.';
        }
    } catch (error: unknown) {
        console.error('Login error:', error);
        if (error instanceof AxiosError) {
        // Handle Axios-specific errors
        if (error.response && error.response.data) {
            errorMessage.value = error.response.data.error || 'An error occurred while trying to log in.';
        } else {
            errorMessage.value = 'An unexpected error occurred during the login request.';
        }
    } else {
        // Handle other types of errors
        errorMessage.value = 'An unexpected error occurred. Please try again.';
    }
    }
};


</script>

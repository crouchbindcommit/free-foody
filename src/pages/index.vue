<template>
  <v-container class="text-center" fluid style="margin-top: 50px; padding: 0; position: relative;">
    <v-row no-gutters>
      <!-- Left Column - Taking Full Width -->
      <v-col cols="12" class="d-flex justify-center">
        <v-card class="elevation-12 mb-4" style="width: 100%; border-radius: 0; position: relative; z-index: 2;">
          <v-card-title class="headline mb-4" v-animate-on-scroll>
            Welcome to Foodify
          </v-card-title>
          <v-card-subtitle class="body-1 mb-6" v-animate-on-scroll>
            An app for students, by students, to track free food events around campus.
          </v-card-subtitle>
          <v-card-subtitle class="body-1 mb-6" v-animate-on-scroll>
            Completely Free, Everytime, Everyday.
          </v-card-subtitle>
          <v-row class="d-flex justify-center align-center">
            <!-- Left Card -->
            <v-col cols="12" sm="6" class="d-flex justify-center">
              <v-card class="elevation-10 mb-4" style="width: 100%; position: relative; z-index: 3;">
                <v-card-title>Getting Started</v-card-title>
                <v-btn large class="rounded-lg shadow-lg" color="#ff9f45" @click="GoToCreation" block v-animate-on-scroll>
                  <v-icon left>mdi-account-plus</v-icon>
                  Sign Up
                </v-btn>
              </v-card>
            </v-col>

            <!-- Right Card -->
            <v-col cols="12" sm="6" class="d-flex justify-center">
              <v-card class="elevation-10 mb-4" style="width: 100%; position: relative; z-index: 3;">
                <v-card-title>Returning User</v-card-title>
                <v-btn large class="rounded-lg shadow-lg" color="#ff9f45" @click="GoToLogin" block v-animate-on-scroll>
                  <v-icon left>mdi-login</v-icon>
                  Log In
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function GoToLogin() {
  router.push("/login");
}

function GoToCreation() {
  router.push("/createAccount");
}
</script>

<style scoped>
/* Scoped styles for content */
.v-card {
  color: #fff;
  box-shadow: none; /* Removed shadow for a cleaner, sleeker look */
  border-radius: 0; /* No rounded corners */
  padding: 20px; /* Adjust padding for a more uniform look */
  position: relative; /* Ensure it's above the background image */
  z-index: 3; /* Ensure cards are above the background image */
}

.v-card-title {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

.v-card-subtitle {
  font-weight: normal;
  color: #fff;
  margin-bottom: 20px;
}

.v-btn {
  font-weight: bold;
  text-transform: none;
  width: 100%;
  /* Full width for a more professional button layout */
  margin-bottom: 10px;
  /* Spacing between buttons */
}

.v-btn:hover {
  transform: none; /* Remove scaling effect for a professional feel */
  background-color: #ff9f45; /* Lighter shade of orange when hovered */
  transition: background-color 0.3s ease; /* Smooth background transition */
}

.v-icon {
  margin-right: 10px;
}

.v-container {
  padding: 0;
  max-width: 100%; /* Allow container to take up full width */
  position: relative; /* Container itself has relative positioning */
}

.v-row {
  margin-top: 20px;
}

.v-row .v-col {
  padding: 0; /* Remove padding inside columns for clean look */
}

[v-animate-on-scroll] {
  animation: none; /* Removed animation for a more straightforward approach */
}
</style>


<template>
    <div>
      <!-- Handle case when 'event' is a string (fallback message) -->
      <p v-if="typeof event === 'string'">{{ event }}</p>
      
      <!-- Render event details if 'event' is an object -->
      <v-card v-if="event && typeof event === 'object'">
        <v-card-title>{{ event.name }}</v-card-title>
        <v-card-subtitle>{{ event.location }}</v-card-subtitle>
        <v-card-text>
          <p><strong>Hosted by:</strong> {{ event.host }}</p>
          <p><strong>Date:</strong> {{ event.date }}</p>
          <p><strong>Duration:</strong> {{ event.duration }}</p>
        </v-card-text>
        <!-- Add a button to open event in Google Maps -->
        <v-btn 
          color="primary" 
          @click="openInGoogleMaps" 
          target="_blank"
        >
          Open in Google Maps
        </v-btn>
      </v-card>
    </div>
  </template>
  
  <script setup>
import { defineProps } from 'vue';

const props = defineProps({
  event: {
    type: Object,
    required: false,
    default: () => null, // Default to null if no event is passed
  },
});

// Method to open the event location in Google Maps
const openInGoogleMaps = () => {
  if (props.event && props.event.coordinates) {
    const [longitude, latitude] = props.event.coordinates;
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank'); // Open the URL in a new tab
  }
};
</script>

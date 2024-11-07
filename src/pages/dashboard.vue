<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="12" sm="8"> <!-- Main column for the map -->
          <v-sheet>
            <MapComponent @event-selected="updateEventDisplay"/>
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="4"> <!-- Side column for event list -->
          <v-sheet>
            <EventList />
          </v-sheet>
        </v-col>
      </v-row>
      <v-row> <br><br><br><br><br><br></v-row>
      <v-row>
          <v-sheet>
            <h2>Selected Event</h2>
            <EventDisplay :event="selectedEventDetails" />
          </v-sheet>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MapComponent from '@/components/MapComponent.vue';
import EventDisplay from '@/components/EventDisplay.vue'; 

// Local data
const selectedEventDetails = ref('Select an event to see details here.');



const updateEventDisplay = (eventData) => {
  selectedEventDetails.value = eventData;
};

</script>

<style scoped>
/* Optional: Add some styles if needed */
</style>

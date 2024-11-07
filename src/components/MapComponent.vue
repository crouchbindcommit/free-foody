<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- Button to activate marker mode -->
        <v-btn v-if="!isMarkerModeEnabled" @click="enableMarkerMode" color="#FF7201" class="mb-3">
          Add New Event
        </v-btn>
        <v-btn v-if="isMarkerModeEnabled" disabled color="#4B4B4C" class="mb-3">
          Adding Event
        </v-btn>

        <!-- The map view -->
        <div ref="mapView" style="height: 500px;"></div>

        <!-- Dialog for event information -->
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="headline">Add Event Details</v-card-title>
            <v-card-text>
              <v-text-field v-model="eventName" label="Event Name" required></v-text-field>
              <v-text-field v-model="eventLocation" label="Location" required></v-text-field>
              <v-text-field v-model="eventHost" label="Hosted By" required></v-text-field>
              <v-text-field v-model="eventDate" label="Event Date (YYYY-MM-DD)" required
                placeholder="Enter date manually"></v-text-field>
              <v-text-field v-model="eventDuration" label="Duration" placeholder="e.g., while supplies last"
                required></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="isSubmitting" @click="saveEvent" color="primary">Save</v-btn>
              <v-btn @click="cancelEvent" color="secondary">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import esriConfig from '@arcgis/core/config';

const emit = defineEmits(['event-selected']);
const mapView = ref(null);
let view;

const isMarkerModeEnabled = ref(false);
const dialog = ref(false); // Control dialog visibility
const eventName = ref('');
const eventLocation = ref('');
const eventHost = ref('');
const eventDate = ref(new Date().toISOString().substr(0, 10)); // Default to today's date in YYYY-MM-DD format
const eventDuration = ref('while supplies last'); // Default value for duration
const isSubmitting = ref(false); // To manage the submit button state
let pointGraphic; // Reference to the clicked point
const userId = ref(null); // Define userId as a ref
import EventDisplay from './EventDisplay.vue';

// Initialize the map
const initializeMap = () => {
  esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY;

  const map = new Map({ basemap: 'streets-vector' });

  view = new MapView({
    container: mapView.value,
    map: map,
    center: [-83.9275, 35.9551],
    zoom: 15,
  });

  // Add click event listener for placing markers
  view.on('click', (event) => {
    if (isMarkerModeEnabled.value) {
      addMarker(event.mapPoint);
      isMarkerModeEnabled.value = false; // Disable marker mode after placing
    } else {
      const clickedGraphic = view.hitTest(event).then((response) => {
        if (response.results.length) {
          const clickedEvent = response.results[0].graphic.attributes;
          emit('event-selected', clickedEvent);
        }
      });
    }

  });
  displayMarkers();
};

// Function to enable marker mode
const enableMarkerMode = () => {
  isMarkerModeEnabled.value = true;
};

// Function to add a marker at the given map point
const addMarker = (point) => {
  dialog.value = true; // Show the dialog to enter event details
  pointGraphic = point; // Keep a reference to the clicked point
};

// Function to save the event
const saveEvent = async () => {
  const userId = localStorage.getItem('userId'); // Retrieve userId from local storage

  if (!userId) {
    // Show error message if userId is invalid
    alert('You must log in to add an event.'); // You can replace this with a nicer alert dialog if desired
    return; // Exit the function to prevent saving
  }

  const eventData = {
    name: eventName.value,
    location: eventLocation.value,
    host: eventHost.value,
    date: eventDate.value,
    duration: eventDuration.value,
    coordinates: [pointGraphic.longitude, pointGraphic.latitude], // Ensure pointGraphic has the right properties
    userId: userId, // Use the valid userId
  };

  isSubmitting.value = true; // Disable the button during submission

  try {
    const response = await fetch('https://free-food-api.onrender.com/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorDetails = await response.text(); // Get more error information
      throw new Error(`Failed to save event: ${errorDetails}`);
    }

    const responseData = await response.json();
    console.log('Event saved:', responseData);

    // Refresh markers on the map
    displayMarkers();

    dialog.value = false; // Close the dialog after saving
    resetForm();
  } catch (error) {
    console.error('Error saving event:', error.message); // Print more specific error message
  } finally {
    isSubmitting.value = false; // Re-enable the button
  }
};


const displayMarkers = async () => {
  try {
    const response = await fetch('https://free-food-api.onrender.com/api/events');
    const events = await response.json();

    // Use userId.value here to compare
    events.forEach(event => {
      const point = new Point({
        longitude: event.coordinates[0],
        latitude: event.coordinates[1],
      });

      const color = event.userId === userId.value ? 'grey' : 'orange'; // Change color based on user ID
      const markerSymbol = {
        type: 'simple-marker',
        color: color,
        size: '10px',
      };

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: event,
      });

      view.graphics.add(pointGraphic);
    });
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};




// Function to reset the form fields
const resetForm = () => {
  eventName.value = '';
  eventLocation.value = '';
  eventHost.value = '';
  eventDate.value = ''; // Reset to an empty string
  eventDuration.value = 'while supplies last'; // Reset duration
};

// Function to cancel event creation
const cancelEvent = () => {
  dialog.value = false; // Close the dialog
  isMarkerModeEnabled.value = false; // Disable marker mode
  resetForm(); // Reset fields
};


// Initialize the map when the component is mounted
onMounted(() => {
  const userId = localStorage.getItem('userId');
  initializeMap();
  displayMarkers();
});
</script>

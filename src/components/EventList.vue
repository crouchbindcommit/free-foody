<template>
  <div>
    <h2>Today's Free Food</h2>

<div v-if="filteredEvents.length > 0">
    <!-- Today's Events -->
    <ul>
      <li v-for="event in paginatedEvents" :key="event._id">
        <v-card>
          <v-card-title>{{ event.name }}</v-card-title>
          <v-card-subtitle>{{ event.date }}</v-card-subtitle>
          <v-card-text>{{ event.location }}</v-card-text>
          <v-card-actions>
            <v-btn @click="selectEvent(event._id)">
              {{ selectedEventId === event._id ? 'Hide Comments' : 'View Comments' }}
            </v-btn>
          </v-card-actions>
          <v-divider></v-divider>
          <!-- Render Comments component conditionally -->
          <Comments v-if="selectedEventId === event._id" :eventId="event._id" />
        </v-card>
      </li>
    </ul>

    <!-- Pagination Controls for Today's Events -->
    <v-pagination
      v-model="page"
      :length="totalPages"
      circle
      @input="onPageChange"
    />

</div>
<div v-if="filteredEvents.length == 0">
  <v-card>
    <p> No Free Food events have been reported for today. Check back later or use the map to report an event. </p>
  </v-card>
</div>

    <!-- Button to open the dialog to view all events -->
    <v-btn color="primary" @click="dialog = true">View All Events</v-btn>

    <!-- Dialog for viewing all events -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="headline">All Events</v-card-title>
        <v-card-text>
          <!-- Search for all events -->
          <v-text-field
            v-model="searchAllEvents"
            label="Search Events"
            outlined
            @input="filterAllEvents"
          />

          <!-- Event list in popup (with search filter) -->
          <ul>
            <li v-for="event in filteredAllEvents" :key="event._id">
              <v-card>
                <v-card-title>{{ event.name }}</v-card-title>
                <v-card-subtitle>{{ event.date }}</v-card-subtitle>
                <v-card-text>{{ event.location }}</v-card-text>
                <v-card-actions>
                  <v-btn @click="selectEvent(event._id)">
                    {{ selectedEventId === event._id ? 'Hide Comments' : 'View Comments' }}
                  </v-btn>
                </v-card-actions>
                <v-divider></v-divider>
                <!-- Render Comments component conditionally -->
                <Comments v-if="selectedEventId === event._id" :eventId="event._id" />
              </v-card>
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false" color="secondary">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import Comments from '@/components/Comments.vue';

// Refs to hold event data and filters
const events = ref([]); // All events (for the popup search)
const filteredEvents = ref([]); // Filtered events for display
const filteredAllEvents = ref([]); // Filtered events for all events popup search
const searchDate = ref(''); // Search input for today's events
const searchAllEvents = ref(''); // Search input for all events
const selectedEventId = ref(null); // Selected event for comments view
const dialog = ref(false); // Dialog visibility for all events
const page = ref(1); // Page for today's events pagination
const perPage = 5; // Number of events per page

// Get today's date in YYYY-MM-DD format
const getToday = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

// Fetch all events and filter today's events
const fetchEvents = async () => {
  try {
    const response = await axios.get('https://free-food-api.onrender.com/api/events');
    events.value = response.data;
    filteredEvents.value = filterTodayEvents(events.value);
    filteredAllEvents.value = [...events.value]; // Initially all events are available for searching in popup
  } catch (error) {
    console.error('Error fetching events:', error.message || error);
  }
};


// Filter events that happen today
const filterTodayEvents = (eventsList) => {
  const today = getToday();
  return eventsList.filter((event) => {
    const eventDate = event.date.split('T')[0]; // Assuming event.date is in ISO format
    return eventDate === today;
  });
};


// Function to filter all events based on the search term in the popup
const filterAllEvents = () => {
  if (searchAllEvents.value) {
    filteredAllEvents.value = events.value.filter((event) =>
      event.name.toLowerCase().includes(searchAllEvents.value.toLowerCase())
    );
  } else {
    filteredAllEvents.value = [...events.value];
  }
};

// Computed property for paginated events (only today's events)
const paginatedEvents = computed(() => {
  const startIndex = (page.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return filteredEvents.value.slice(startIndex, endIndex);
});

// Total number of pages for today's events
const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / perPage);
});

// Function to toggle the visibility of comments for an event
const selectEvent = (eventId) => {
  selectedEventId.value = selectedEventId.value === eventId ? null : eventId;
};

// Handle page change for today's events pagination
const onPageChange = (newPage) => {
  page.value = newPage;
};

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped>
/* Optional styles for event list */
ul {
  list-style-type: none; /* Remove default list style */
  padding: 0; /* Remove padding */
}

li {
  margin-bottom: 16px; /* Add space between list items */
}

.v-card {
  transition: box-shadow 0.3s; /* Add transition for shadow on hover */
}

.v-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Add shadow effect on hover */
}
</style>

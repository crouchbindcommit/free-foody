<template>
    <div v-for="item in resources">
        <v-card>
            <v-card-title> {{ item.title }} <v-btn :href="item.link"
                    target="_blank"><v-icon>mdi-open-in-new</v-icon></v-btn></v-card-title>
            <v-card-text> {{ item.text }} </v-card-text>
        </v-card>
        <v-divider></v-divider>
    </div>

<v-card>
    <v-card-title> Are we forgetting your organization? </v-card-title>
    <v-card-text> Don't worry -- We're always looking to list resources!
        <br>
        <v-btn :href="'mailto:mmckin22@vols.utk.edu?subject=New%20Resource%20Submission&body=Please%20provide%20details%20about%20the%20new%20resource%20you%20would%20like%20to%20list.'">
      Send me an email to Report a New Resource
    </v-btn>
 </v-card-text>
</v-card>

</template>

<script setup lang="ts">
const resources = [
    {
        title: "Big Orange Pantry (BOP)",
        text: "The Big Orange Pantry is a student resource located on the 3rd floor of the Student Union. The have free frozen meals, canned goods, dairy, etc. You are allowed to visit once per day. They don't keep their website updated per year, but the hours rarely change. As of Fall 2024, they are open Monday-Friday from 11a to 6p, closed on Saturday, and open Sunday 12p to 4p.",
        link: "https://studentlife.utk.edu/blog/2023/01/31/how-to-access-big-orange-pantry/",
    },
    {
        title: "Baptist Collegiate Ministry (BCM) at UTK",
        text: "The BCM is a baptist christian organization that caters soul food from varying places every Monday from 11:30p to 1p. You do not have to be baptist, but they do a prayer and announcements of the organization before and occasionally after the meal. Signing up for their emailing list lets you know what is being catered ahead of time. ",
        link: "https://www.utbaptist.org/contact-us.html",
    },
    {
        title: "Knox CHOP (Campus House of Prayer)",
        text: "Knox CHOP is a mobile food pantry that is operational from 1p to 3p on Wednesdays. It is located at 1538 Highland Ave (directly across from Laurel Hall at the corner of 16th & Highland). They offer free (no strings attached) groceries!",
        link: "https://knoxchop.org/contact",
    },
]
</script>
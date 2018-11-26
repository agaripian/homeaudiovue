<template>
  <v-card
    color="red darken-2"
    class="white--text">
    <v-card-title
      primary-title
      class="d-block">
      <div class="headline">There was an Error!</div>
      <div class="subheading">{{ message }}</div>
    </v-card-title>
    <v-card-actions>
      <v-btn
        dark
        @click="$emit('retry')">
        Retry
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

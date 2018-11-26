<template>
  <v-card>
    <v-toolbar
      dark
      color="primary">
      <v-btn
        icon
        dark
        @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Controll All</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items>
        <v-btn
          dark
          flat
          @click="$emit('close')">Close</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <Zone
      :class="$style.marginTop"
      :zone="zone"
      :options-expanded="true"
      @zoneEvent="$emit('zoneEvent', $event)"/>
  </v-card>
</template>


<script>
import Zone from '~/components/Zone'

export default {
  components: {
    Zone
  },

  props: {
    zone: {
      type: Object,
      required: true
    }
  }
}
</script>

<style module type="scss">
.marginTop {
  margin-top: 15px;
}
</style>

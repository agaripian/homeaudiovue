<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <template v-for="zone in zones">
        <v-flex
          :key="zone.zone"
          xs10>
          {{ zone.zone }}
          <v-slider
            v-model="zone.vo"
            :max="38"
            :min="0"
            append-icon="volume_up"
            color="white"
            loading="true"
            prepend-icon="volume_down"
            thumb-color="green"
            thumb-label="true"
          />
        </v-flex>
        <v-flex
          :class="$style.buttonContainer"
          :key="zone.zone"
          xs2>
          <v-btn
            color="error"
            red>
            <slot>
              <font-awesome-icon
                :class="$style.muteIcon"
                icon="volume-mute"
              />
            </slot>
          </v-btn>
        </v-flex>
        {{ zone }}
      </template>
    </v-layout>
  </v-container>

</template>


<script>
export default {
  data() {
    return {
      volume: 0,
      zones: []
    }
  },

  async asyncData({ app }) {
    let { data } = await app.$axios.get('/zones')
    return { zones: data }
  }
}
</script>

<style module lang="scss">
.muteIcon {
  height: 20px;
}

.buttonContainer {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>

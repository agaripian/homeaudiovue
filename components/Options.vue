<template>
  <div>
    <v-layout
      v-for="(option, index) in options"
      :key="index"
      row
      wrap>
      <v-flex xs2/>
      <v-flex xs1>
        {{ option.key }}
      </v-flex>
      <v-flex
        v-if ="option.type === 'select'"
        xs3>
        <v-select
          :disabled="!isOn && !isAllZone"
          :items="option.items"
          v-model="zone[option.attr]"
          @change="$emit('zoneEvent', { attr: option.attr, value: $event, zone:zone.zone })"
        />
      </v-flex>
      <v-flex
        v-if ="option.type === 'input'"
        xs7>
        <v-text-field
          :disabled="!isOn && !isAllZone"
          v-model="zone[option.attr]"
          @change="$emit('zoneEvent', { attr: option.attr, value: $event, zone:zone.zone })"
        />
      </v-flex>
      <v-flex
        v-if ="option.type === 'slider'"
        xs7>
        <v-slider
          :disabled="!isOn && !isAllZone"
          v-model="zone[option.attr]"
          :max="option.max"
          :min="option.min"
          :thumb-label="true"
          append-icon="add"
          class="black-text"
          prepend-icon="remove"
          thumb-color="white"
          color="white"
          thumb-size="50"
          @change="$emit('zoneEvent', { attr: option.attr, value: $event, zone:zone.zone })"
        />
      </v-flex>
      <v-flex xs3/>
    </v-layout>
  </div>
</template>


<script>
export default {
  props: {
    zone: {
      type: Object,
      required: true
    }
  },

  computed: {
    isOn() {
      return this.zone.pr === '01'
    },
    isAllZone() {
      return this.zone.zone === 'all'
    },
    options() {
      /*eslint-disable */
      let allOptions = [
        { key: 'Source', attr: 'ch', value: this.zone.ch, type: 'select', items: ['01', '02', '03', '04', '05', '06'] },
        { key: 'Trebble', attr: 'tr', value: this.zone.tr, type: 'slider', min: 0, max: 14 },
        { key: 'Base', attr: 'bs', value: this.zone.bs, type: 'slider', min: 0, max: 14 },
        { key: 'Balance', attr: 'bl', value: this.zone.bl, type: 'slider', min: 0, max: 20 },
      ]

      if (!this.isAllZone) {
        const name = { key: 'Name', attr: 'name', value: this.zone.name, type: 'input' }
        allOptions.splice(1, 0, name)
      }

      return allOptions
      /*eslint-enable */
    }
  }
}
</script>

<style module lang="scss">
.icon {
  height: 20px;
}
</style>

<style>
.v-slider__thumb-label.white {
  color: black;
  font-size: 18px;
  font-weight: bold;
}
</style>

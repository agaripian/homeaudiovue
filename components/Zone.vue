<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      ref="zone"
      :class="$style.buttonContainer"
      xs2>
      <v-btn
        v-if="!isAllZone"
        v-model="zone.pr"
        :class="[isOn ? 'green' : 'grey', 'lighten-2 black--text']"
        fab
        red
        small
        @click="$emit('zoneEvent', { attr: 'pr', value: isOn ? '00':'01' , zone:zone.zone })">
        <slot>
          <font-awesome-icon
            :class="$style.icon"
            icon="power-off"
          />
        </slot>
      </v-btn>
      <v-btn
        v-if="isAllZone"
        class="grey black--text lighten-2"
        fab
        small
        @click="$emit('zoneEvent', { attr: 'pr', value: '00' , zone:zone.zone })">
        <v-icon> power_off </v-icon>
      </v-btn>
      <v-btn
        v-if="isAllZone"
        class="grey black--text lighten-2"
        fab
        small
        @click="$emit('zoneEvent', { attr: 'pr', value: '01' , zone:zone.zone })">
        <v-icon> power </v-icon>
      </v-btn>
    </v-flex>
    <v-flex
      xs8>
      <span
        v-if="zone.name"
      > {{ zone.name }} </span>
      <v-slider
        :disabled="!isOn && !isAllZone || isMuted"
        v-model="zone.vo"
        :color="sliderColor"
        :max="38"
        :min="0"
        :thumb-label="true"
        thumb-color="white"
        thumb-size="50"
        @contextmenu.native="selectEvent"
        @change="$emit('zoneEvent', { attr: 'vo', value: $event, zone:zone.zone })">
        <v-icon
          slot="prepend"
          @click="zone.vo = (Number(zone.vo) - 3); $emit('zoneEvent', { attr: 'vo', value: zone.vo.toString(), zone:zone.zone })"
        >
          volume_down
        </v-icon>
        <v-icon
          slot="append"
          @click="zone.vo = (Number(zone.vo) + 3); $emit('zoneEvent', { attr: 'vo', value: zone.vo.toString(), zone:zone.zone })"
        >
          volume_up
        </v-icon>
      </v-slider>
    </v-flex>
    <v-flex
      v-if="!isAllZone"
      :class="$style.buttonContainer"
      xs2>
      <v-btn
        :disabled="!isOn"
        :class="[isExpanded ? 'green' : 'grey  black--text lighten-2']"
        fab
        red
        small
        @click="isExpanded = !isExpanded">
        <v-icon> settings </v-icon>
      </v-btn>
    </v-flex>
    <!--<v-flex
      :class="$style.buttonContainer"
      xs2>
      <v-btn
        v-if="!isAllZone"
        :disabled="!isOn"
        :class="[isMuted ? 'error' : 'grey  black--text lighten-2']"
        fab
        red
        small
        @click="$emit('zoneEvent', { attr: 'mu', value: isMuted ? '00':'01' , zone:zone.zone })">
        <slot>
          <font-awesome-icon
            :class="$style.icon"
            icon="volume-mute"
          />
        </slot>
      </v-btn>
      <v-btn
        v-if="isAllZone"
        class="grey black--text lighten-2"
        fab
        red
        small
        @click="$emit('zoneEvent', { attr: 'mu', value: '01' , zone:zone.zone })">
        <slot>
          <font-awesome-icon
            :class="$style.icon"
            icon="volume-mute"
          />
        </slot>
      </v-btn>
      <v-btn
        v-if="isAllZone"
        class="grey black--text lighten-2"
        fab
        red
        small
        @click="$emit('zoneEvent', { attr: 'mu', value: '00' , zone:zone.zone })">
        <slot>
          <font-awesome-icon
            :class="$style.icon"
            icon="volume-up"
          />
        </slot>
      </v-btn>
    </v-flex> -->
    <v-flex
      v-if="isExpanded"
      xs12>
      <Options
        :zone="zone"
        @zoneEvent="$emit('zoneEvent', $event)"/>
    </v-flex>
  </v-layout>
</template>


<script>
import Options from '~/components/Options'

export default {
  components: {
    Options
  },
  props: {
    zone: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      optionsExpanded: false
    }
  },
  computed: {
    isExpanded: {
      get() {
        return this.optionsExpanded && this.isOn
      },
      set(val) {
        this.optionsExpanded = val
      }
    },
    isOn() {
      return this.zone.pr === '01'
    },
    isAllZone() {
      return this.zone.zone === 'all'
    },
    isMuted() {
      return this.zone.mu === '01'
    },
    sliderColor() {
      let val = this.zone.vo || 1
      const red = (val / 38) * 1.05
      return `rgb(255, 0, 0, ${red})`
    }
  },

  methods: {
    selectEvent(e) {
      e.preventDefault()
      return
    }
  }
}
</script>

<style module lang="scss">
.icon {
  height: 18px;
}

.buttonContainer {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>

<style>
.v-slider__thumb-label.white {
  color: black;
  font-size: 18px;
  font-weight: bold;
}
.v-slider > input {
  user-select: none;
}
</style>

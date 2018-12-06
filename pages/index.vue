<template>
  <div>
    <v-toolbar
      fixed
      app
    >
      <v-toolbar-title v-text="title"/>
      <v-btn
        icon
        @click.stop="isSettingsDialogOpen = true"
      >
        <v-icon>settings</v-icon>
      </v-btn>
      <v-btn
        flat
        @click.stop="isControlAllDialogOpen = true"
      >
        <v-icon left>equalizer</v-icon>
        Control All
      </v-btn>
      <v-btn
        flat
        @click.stop="allZoneCall({ attr: 'pr', value: '00' })"
      >
        <v-icon left>power_off</v-icon>
        All Off
      </v-btn>
    </v-toolbar>
    <v-container
      fluid
      grid-list-lg
    >
      <Error
        v-if = "error"
        :message = "error"
        @retry="reload"
      />
      <Zone
        v-for="zone in zones"
        v-if="zone"
        :key="zone.zone"
        :zone="zone"
        @zoneEvent="zoneCall($event)"
      />
    </v-container>
    <v-dialog
      v-model="isSettingsDialogOpen"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition">
      <Settings
        :amp-count="ampCount"
        :zones="zones"
        @close="isSettingsDialogOpen=false"
        @saveOrder="saveZonesOrder"
        @ampCountChange="setAmpCount"/>
    </v-dialog>
    <v-dialog
      v-model="isControlAllDialogOpen"
      hide-overlay
      transition="dialog-transition">
      <ControlAll
        :zone="masterZone"
        @zoneEvent="allZoneCall($event)"
        @close="isControlAllDialogOpen=false"/>
    </v-dialog>
  </div>
</template>


<script>
import Zone from '~/components/Zone'
import Error from '~/components/Error'
import Settings from '~/components/Settings'
import ControlAll from '~/components/ControlAll'

function pad2(val) {
  if (typeof val === 'string') {
    val = Number(val)
  }
  console.log('val', val)
  return (val < 10 ? '0' : '') + val
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export default {
  components: {
    Zone,
    Error,
    Settings,
    ControlAll
  },

  data() {
    return {
      zones: [],
      ampCount: 1,
      error: '',
      title: 'HomeAudio',
      isSettingsDialogOpen: false,
      isControlAllDialogOpen: false,
      // eslint-disable-next-line
      masterZone: { 'zone': 'all', 'pa': '00', 'pr': '00', 'mu': '00', 'dt': '00', 'vo': '15', 'tr': '07', 'bs': '07', 'bl': '10', 'ch': '01', 'ls': '00' }
    }
  },

  computed: {
    // sortedZones() {
    //   const sortedZones = [...this.zones]
    //   sortedZones.sort((a, b) => {
    //     const aNum = Number(a.order)
    //     const bNum = Number(b.order)
    //     if (aNum < bNum) {
    //       return -1
    //     }
    //     if (aNum > bNum) {
    //       return 1
    //     }
    //     return 0
    //   })
    //   console.log('sortedZones computed :', sortedZones)
    //   return sortedZones
    // }
  },

  async asyncData({ app }) {
    try {
      let { data } = await app.$axios.get('/zones')
      console.log('Getting /Zone calls success!')
      return { zones: data }
    } catch (error) {
      console.log('error in async data!, Is the Raspberry Pi Working?')
      console.log('Error Code: ', error)
      return {
        error:
          'Please check your network connection and make sure the Raspberry Pi is on and connected to the network!'
      }
    }
  },

  mounted() {
    this.getAmpCount()
  },

  methods: {
    async getZones() {
      try {
        let { data } = await this.$axios.get('/zones')
        console.log('Getting /Zone calls success!')
        this.zones = data
      } catch (error) {
        this.showError(`There was an error getting zone information: ${error}`)
      }
    },

    async zoneCall({ attr, value, zone }) {
      try {
        const formattedVal = (isNumeric(value) && pad2(value)) || value
        const result = await this.$axios.post(
          `/zones/${zone}/${attr}`,
          formattedVal,
          {
            headers: { 'Content-Type': 'text/plain' }
          }
        )
        this.zones.find((item, index) => {
          if (item.zone === zone) {
            this.$set(this.zones, index, result.data)
          }
        })
      } catch (error) {
        this.showError(`There was an error setting ${attr}`)
      }
    },

    async allZoneCall({ attr, value }) {
      try {
        this.masterZone[attr] = value
        const formattedVal = pad2(value)
        const result = await this.$axios.post(
          `/allzones/${attr}`,
          formattedVal,
          {
            headers: { 'Content-Type': 'text/plain' }
          }
        )
        this.zones = result.data
      } catch (error) {
        this.showError(`There was an error setting allZones ${attr}`)
      }
    },

    saveZonesOrder({ oldIndex, newIndex }) {
      console.log('saveZonesOrder called')
      console.log('oldIndex: ', oldIndex)
      console.log('newIndex: ', newIndex)
      const movedItem = this.zones.splice(oldIndex, 1)[0]
      console.log('movedItem :', movedItem)
      this.zones.splice(newIndex, 0, movedItem)
      const zonesOrder = {}
      this.zones.forEach((item, index) => {
        item.order = index
        zonesOrder[item.zone] = item.order
      })
      this.$axios.post(`/sortOrder`, zonesOrder)
      console.log(zonesOrder)
    },

    async getAmpCount() {
      try {
        const result = await this.$axios.get('/ampCount')
        this.ampCount = result.data.AmpCount
      } catch (error) {
        this.showError(`There was an error getting ampCount: ${error}`)
      }
    },

    async setAmpCount(count) {
      try {
        await this.$axios.post('/ampCount', count, {
          headers: { 'Content-Type': 'text/plain' }
        })
        this.getZones()
      } catch (error) {
        this.showError(`There was an error setting ampCount: ${error}`)
      }
    },

    updateMasterZone(zones) {
      // let masterValues = { pr: '00', mu: '00', ch: '01' }
      // let { pr, mu, ch } = zonez[0]
      // let prMatch = true
      // let muMatch = true
      // zones.every(zone => {
      //   if (zone.pr !== pr) {
      //     prMatch = false
      //   }
      //   if (zone.mu !== mu) {
      //     prMatch = false
      //   }
      // })
      // newValue.forEach(zone => {
      //   console.log('zone', zone.zone)
      //   Object.keys(zone).forEach(key => {
      //     if (!masterValues[key]) {
      //       return
      //     }
      //     if (!masterPower) {
      //       masterPower = masterValues['pr']
      //     } else {
      //       if ( masterPower !== masterValues['pr'])
      //     }
      //     masterValues[key] = zone[key]
      //   })
      // })
      // Object.assign(this.masterZone, masterValues)
      console.log('masterZone', this.masterZone)
    },

    reload() {
      window.location.reload(true)
    },

    showError(message) {
      this.error = message
      setTimeout(() => {
        this.error = ''
      }, 3000)
    }
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

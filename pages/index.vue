<template>
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

</template>


<script>
import Zone from '~/components/Zone'
import Error from '~/components/Error'

function pad2(val) {
  if (typeof val === 'string') {
    val = Number(val)
  }
  console.log('val', val)
  return (val < 10 ? '0' : '') + val
}

export default {
  components: {
    Zone,
    Error
  },

  data() {
    return {
      zones: [],
      error: ''
    }
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

  methods: {
    // async volChange(val, zone) {
    //   const formattedVal = pad2(val)
    //   console.log('volChange', formattedVal)
    //   await this.zoneCall('vo', val, zone)
    // },

    async zoneCall({ attr, value, zone }) {
      try {
        const formattedVal = pad2(value)
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
        showError(`There was an error setting ${attr}`)
      }
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

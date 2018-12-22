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
      <v-toolbar-title>Settings</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items>
        <v-btn
          dark
          flat
          @click="$emit('close')">Save</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-subheader>Sort Order</v-subheader>
    <v-data-table
      v-sortable-table
      ref="sortableTable"
      :items="zones"
      hide-actions
      hide-headers
      class="elevation-1"
      @sorted="saveOrder">
      <template
        slot="items"
        slot-scope="props">
        <tr :key="props.item.zone">
          <td
            class="px-1"
            style="width: 0.1%">
            <v-btn
              style="cursor: move"
              icon
              class="sortHandle">
              <v-icon>drag_handle</v-icon>
            </v-btn>
          </td>
          <td>{{ props.item.name }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-divider/>
    <v-subheader>Amp Count</v-subheader>
    <v-flex
      xs1
      pl-4>
      <v-select
        :items="[1,2,3]"
        :value="ampCount"
        @change="$emit('ampCountChange', $event)"
      />
    </v-flex>
    <v-divider/>
  </v-card>
</template>


<script>
export default {
  props: {
    zones: {
      type: Array,
      required: true
    },
    ampCount: {
      type: Number,
      required: true
    }
  },

  methods: {
    saveOrder({ oldIndex, newIndex }) {
      this.$emit('saveOrder', { oldIndex, newIndex })
    }
  }
}
</script>

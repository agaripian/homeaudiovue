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
    {{ zones }}
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
    <v-list
      three-line
      subheader>
      <v-subheader>General</v-subheader>
      <v-list-tile avatar>
        <v-list-tile-action>
          test
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Notifications</v-list-tile-title>
          <v-list-tile-sub-title>Notify me about updates to apps or games that I downloaded</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile avatar>
        <v-list-tile-action>
          test2
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Sound</v-list-tile-title>
          <v-list-tile-sub-title>Auto-update apps at any time. Data charges may apply</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile avatar>
        <v-list-tile-action>
          test3
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Auto-add widgets</v-list-tile-title>
          <v-list-tile-sub-title>Automatically add home screen widgets</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>


<script>
export default {
  props: {
    zones: {
      type: Array,
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

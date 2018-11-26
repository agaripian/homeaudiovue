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
    <v-list
      three-line
      subheader>
      <v-subheader>User Controls</v-subheader>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Content filtering</v-list-tile-title>
          <v-list-tile-sub-title>Set the content filtering level to restrict apps that can be downloaded</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Password</v-list-tile-title>
          <v-list-tile-sub-title>Require password for purchase or use password to restrict purchase</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
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
  }
}
</script>

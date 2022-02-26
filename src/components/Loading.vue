<template>
  <v-overlay
      :absolute="absolute"
      :opacity="0.6"
      :value="value"
      color="white"
  >
    <v-container fluid>
      <v-row justify="center">
        <v-progress-circular
            color="primary"
            size="64"
            indeterminate
        />
      </v-row>
    </v-container>
  </v-overlay>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    absolute: {
      type: Boolean,
      default: false
    }
  }
}
</script>
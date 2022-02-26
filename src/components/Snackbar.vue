<template>
  <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="color"
      multi-line
  >
    <span class="font-weight-bold">{{ text }}</span>
    <template v-if="errors">
      <br/>
      <div v-html="errors" />
    </template>

    <template v-slot:action="{ attrs }">
      <v-btn
          text
          v-bind="attrs"
          @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "Snackbar",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    errors: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    timeout: 5000
  }),
  computed: {
    snackbar: {
      get: function () {
        return this.value
      },
      set: function (newVal) {
        this.$emit('input', newVal)
      }
    }
  }
}
</script>
<template>
  <v-dialog
      v-model="dialog"
      max-width="500"
      persistent
  >
    <v-card
        class="text-center"
    >
      <loading
          v-model="loading"
          absolute
      />
      <v-container>
        <v-icon
            size="80"
            color="error"
        >
          mdi-delete-forever
        </v-icon>
        <h2 class="mb-3">Borrar registro de usuario</h2>
        <p class="mb-3 text-h6" v-if="item">
          ¿Está seguro de borrar el registro del usuario <strong>{{item.nombres}}</strong>
        </p>
      </v-container>
      <v-card-actions class="justify-center">
        <v-btn
            @click="cancel"
            :loading="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
            color="error"
            :loading="loading"
            @click="deleteItem"
        >
          Si, Borrar
        </v-btn>
      </v-card-actions>
    </v-card>
    <snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :text="snackbar.text"
    />
  </v-dialog>
</template>

<script>
import axios from '../plugins/axios'
import Loading from './Loading'
import Snackbar from './Snackbar'
export default {
  name: 'DeleteConfirm',
  components: {
    Loading,
    Snackbar
  },
  props: {
    item: {
      type: Object,
      default: null
    },
    dialog: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    loading: false,
    snackbar: {
      show: false,
      color: '',
      text: ''
    }
  }),
  methods: {
    close() {
      this.$emit('update:dialog', false)
    },
    success(value) {
      this.loading = false
      this.$emit('success', value)
      this.close()
    },
    cancel() {
      this.close()
      this.$emit('cancel')
    },
    async deleteItem() {
      this.loading = true
      axios.delete(`users/${this.item.id}`)
          .then(() => {
            this.success()
          })
          .catch(() => {
            this.snackbar.color = 'error'
            this.snackbar.text = `error al borrar el registro del usuario ${this.item.nombres}`
            this.snackbar.show = true
            this.loading = false
          })
    }
  }
}
</script>
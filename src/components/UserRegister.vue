<template>
  <v-dialog
      v-model="dialog"
      max-width="800"
      persistent
  >
    <v-card>
      <loading
          v-model="loading"
          absolute
      />
      <v-list
          v-if="item"
          color="primary"
          dark
      >
        <v-list-item>
          <v-list-item-avatar
              color="primary darken-4"
              size="40"
          >
            <v-icon>
              mdi-account-{{ item.id ? 'edit' : 'plus' }}
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ item.id ? 'Edición de' : 'Nuevo' }} usuario
            </v-list-item-title>
            <p
                v-if="item.id"
                class="ma-0 subtitle-2"
            >
              Registro No. {{ item.id }}
            </p>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
                icon
                @click="close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <ValidationObserver ref="formValid">
        <v-container fluid>
          <v-row dense>
            <v-col cols="6">
              <ValidationProvider
                  name="categoría"
                  rules="required"
                  v-slot="{ errors }"
              >
                <v-select
                    v-model="item.categoria_id"
                    :items="categories"
                    outlined
                    dense
                    clearable
                    label="Categoría"
                    item-text="descripcion"
                    item-value="id"
                    :error-messages="errors"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="6">
              <ValidationProvider
                  name="país"
                  rules="required"
                  v-slot="{ errors }"
              >
                <v-autocomplete
                    v-model="item.pais"
                    :items="countries"
                    outlined
                    dense
                    clearable
                    label="País"
                    :error-messages="errors"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="6">
              <ValidationProvider
                  name="nombres"
                  rules="required|alpha_spaces|minlength:5|maxlength:100"
                  v-slot="{ errors }"
              >
                <v-text-field
                    label="Nombres"
                    v-model="item.nombres"
                    outlined
                    dense
                    clearable
                    :error-messages="errors"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="6">
              <ValidationProvider
                  name="apellidos"
                  rules="required|alpha_spaces|maxlength:100"
                  v-slot="{ errors }"
              >
                <v-text-field
                    label="Apellidos"
                    v-model="item.apellidos"
                    outlined
                    dense
                    clearable
                    :error-messages="errors"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="6">
              <ValidationProvider
                  name="cédula"
                  rules="required|numeric"
                  v-slot="{ errors }"
              >
                <v-text-field
                    label="Cédula"
                    v-model="item.cedula"
                    outlined
                    dense
                    clearable
                    :error-messages="errors"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="6">
              <ValidationProvider
                  name="correo electrónico"
                  rules="required|email|maxlength:150"
                  v-slot="{ errors }"
              >
                <v-text-field
                    label="Correo Electrónico"
                    type="email"
                    v-model="item.email"
                    outlined
                    dense
                    clearable
                    :error-messages="errors"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="6">
              <ValidationProvider
                  name="dirección"
                  rules="required|maxlength:180"
                  v-slot="{ errors }"
              >
                <v-text-field
                    label="Dirección"
                    v-model="item.direccion"
                    outlined
                    dense
                    clearable
                    :error-messages="errors"
                />
              </ValidationProvider>
            </v-col>

            <v-col cols="6">
              <ValidationProvider
                  name="celular"
                  rules="required|numeric|length:10"
                  v-slot="{ errors }"
              >
                <v-text-field
                    label="Celular"
                    type="tel"
                    v-model="item.celular"
                    outlined
                    dense
                    clearable
                    :error-messages="errors"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="6" v-if="!item.id">
              <ValidationProvider
                  name="contraseña"
                  rules="required"
                  v-slot="{ errors }"
              >
                <v-text-field
                    label="Contraseña"
                    type="password"
                    v-model="item.password"
                    outlined
                    dense
                    clearable
                    :error-messages="errors"
                />
              </ValidationProvider>
            </v-col>
          </v-row>
        </v-container>
      </ValidationObserver>
      <v-card-actions>
        <v-spacer/>
        <v-btn
            @click="close"
            :loading="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
            color="primary"
            :loading="loading"
            @click="save"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
    <snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :text="snackbar.text"
        :errors="snackbar.errors"
    />
  </v-dialog>
</template>

<script>
import axios from '../plugins/axios'
import Loading from './Loading'
import Snackbar from './Snackbar'
import User from '../models/User'

export default {
  name: 'UserRegister',
  components: {
    Loading,
    Snackbar
  },
  props: {
    value: {
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
    item: null,
    countries: [],
    categories: [],
    snackbar: {
      show: false,
      color: '',
      text: '',
      errors: ''
    }
  }),
  watch: {
    dialog: {
      handler(val) {
        if (val) {
          if (this.value) {
            this.getItem(this.value)
          }
          this.getCountries()
          this.getCategories()
        }
      },
      immediate: false
    }
  },
  created() {
    this.item = User.create()
  },
  methods: {
    close() {
      this.$refs.formValid.reset()
      this.$emit('update:dialog', false)
      setTimeout(() => {
        this.item = User.create()
      }, 400)
    },
    saved() {
      this.$emit('saved')
      this.close()
    },
    getItem(param) {
      this.loading = true
      axios.get(`users/${param.id}`)
          .then(({data}) => this.item = data)
          .catch(() => {
            this.snackbar.color = 'error'
            this.snackbar.text = `error al recuperar el registro del usuario ${param.nombres}`
            this.snackbar.show = true
          })
          .finally(() => this.loading = false)
    },
    async save() {
      const validate = await this.$refs.formValid.validate()
      if (validate) {
        this.loading = true
        const request = this.item.id ? axios.put(`users/${this.item.id}`, this.item) : axios.post('users', this.item)
        request
            .then(() => this.saved())
            .catch(error => {
              console.log('error', Object.values(error?.response?.data?.errors).join('<br/>'))
              this.snackbar.errors = Object.values(error?.response?.data?.errors).join('<br/>')
              this.snackbar.color = 'error'
              this.snackbar.text = `error al ${this.item.id ? 'actualizar' : 'guardar'} el registro del usuario`
              this.snackbar.show = true
            })
            .finally(() => this.loading = false)
      }
    },
    getCountries() {
      axios.get('https://api.first.org/data/v1/countries?region=South America')
          .then(({data}) => this.countries = Object.values(data?.data).map(x => x.country)) || []
          .catch(() => {
            this.snackbar.color = 'error'
            this.snackbar.text = 'error al recuperar los registros de los paises'
            this.snackbar.show = true
          })
    },
    getCategories() {
      axios.get('categorias')
          .then(({data}) => this.categories = data || [])
          .catch(() => {
            this.snackbar.color = 'error'
            this.snackbar.text = 'error al recuperar los registros de las categorías'
            this.snackbar.show = true
          })
    }
  }
}
</script>
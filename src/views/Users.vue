<template>
  <div>
    <v-app-bar class="mb-4">
      <v-icon class="mr-2">mdi-account-group</v-icon>
      <span class="title">Usuarios</span>
      <v-spacer/>
      <v-btn
          color="primary"
          @click="createItem"
      >
        <v-icon>mdi-plus</v-icon>
        Crear Usuario
      </v-btn>
    </v-app-bar>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-autocomplete
              v-model="country"
              :items="countries"
              outlined
              dense
              clearable
              hide-details
              label="País"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
              v-model="category"
              :items="categories"
              outlined
              dense
              clearable
              hide-details
              label="Categoría"
              item-text="descripcion"
              item-value="id"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6" class="mx-auto">
          <v-text-field
              placeholder="Buscar"
              append-icon="mdi-magnify"
              class="searchRows mt-2 mb-1"
              filled
              rounded
              dense
              clearable
              hide-details
              v-model="search"
              @keyup.enter="reloadCurrentPage"
          >
            <template v-slot:prepend>
              <v-btn
                  icon
                  large
                  color="primary"
                  @click="reloadCurrentPage"
              >
                <v-icon large>mdi-sync</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="12">
          <v-card flat>
            <div class="text-center mt-1 pb-2">
              <v-pagination
                  v-model="dataPagination.currentPage"
                  :total-visible="5"
                  :length="dataPagination.lastPage"
                  @input="getUsers"
              />
              <span class="title grey--text text--darken-1 text-center caption pa-1">
                {{ `Registros del ${dataPagination.from} al ${dataPagination.to} de ${dataPagination.itemsLength}` }}
              </span>
            </div>
            <v-data-table
                :headers="headers"
                :items="items"
                :loading="loading"
                loading-text="Cargando... por favor espere"
                class="elevation-1"
                hide-default-footer
                disable-pagination
            >
              <template v-slot:item.nombres="{item}">
                <v-list-item-content>
                  <v-list-item-title class="body-1">{{ item.nombres }} {{item.apellidos}}</v-list-item-title>
                  <v-list-item-title class="body-2">CC {{ item.cedula }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <template v-slot:item.ubicacion="{item}">
                <span class="body-1">{{ item.pais }}</span>
                <br/>
                <span class="caption">CC {{ item.direccion }}</span>
              </template>
              <template v-slot:item.options="{item}">
                <div class="optionsButtons">
                  <v-toolbar>
                    <v-btn
                        class="ma-1"
                        color="orange"
                        depressed
                        fab
                        dark
                        x-small
                        @click="editItem(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                        class="ma-1"
                        color="error"
                        depressed
                        fab
                        dark
                        x-small
                        @click="predeleteItem(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-toolbar>
                </div>
              </template>
            </v-data-table>
            <div class="text-center mt-1">
              <span class="title grey--text text--darken-1 text-center caption pa-1">
                {{ `Registros del ${dataPagination.from} al ${dataPagination.to} de ${dataPagination.itemsLength}` }}
              </span>
              <v-pagination
                  v-model="dataPagination.currentPage"
                  :total-visible="5"
                  :length="dataPagination.lastPage"
                  @input="getUsers"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
      <delete-confirm
          :dialog.sync="dialogDelete"
          :item="selected"
          @success="deleted"
      />
      <snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :text="snackbar.text"
      />
      <user-register
          v-model="selected"
          :dialog.sync="showRegister"
          @saved="getUsers"
      />
    </v-container>
  </div>
</template>

<script>
import axios from '../plugins/axios'
import DeleteConfirm from '../components/DeleteConfirm'
import Snackbar from '../components/Snackbar'
import UserRegister from '../components/UserRegister'
import {userTableHeaders} from "./userTableHeaders";
export default {
  name: 'Users',
  components: {
    UserRegister,
    DeleteConfirm,
    Snackbar
  },
  data: () => ({
    country: null,
    category: null,
    countries: [],
    categories: [],
    showRegister: false,
    loading: false,
    dialogDelete: false,
    selected: null,
    search: '',
    items: [],
    snackbar: {
      show: false,
      color: '',
      text: ''
    },
    headers: userTableHeaders,
    dataPagination: {
      currentPage: 1,
      itemsLength: null,
      itemsPerPage: null,
      lastPage: null,
      from: null,
      to: null,
    }
  }),
  watch: {
    search: {
      handler(val) {
        if (!val) this.getUsers()
      },
      immediate: false,
    },
    category: {
      handler() {
        this.reloadCurrentPage()
      },
      immediate: false,
    },
    country: {
      handler() {
        this.reloadCurrentPage()
      },
      immediate: false,
    }
  },
  created() {
    this.getUsers()
    this.getCountries()
    this.getCategories()
  },
  methods: {
    createItem() {
      this.selected = null
      this.showRegister = true
    },
    editItem(item) {
      this.selected = item
      this.showRegister = true
    },
    predeleteItem(item) {
      this.dialogDelete = true
      this.selected = item
    },
    deleted() {
      this.snackbar.color = 'success'
      this.snackbar.text = `Se ha borrado el registro del usuario ${this.selected.nombres}`
      this.snackbar.show = true
      this.getUsers()
    },
    async reloadCurrentPage() {
      this.dataPagination.currentPage = 1
      await this.getUsers()
    },
    async makeUrl() {
      return `users?page=${this.dataPagination.currentPage}&filter[search]=${this.search || ''}${this.category ? `&filter[categoria_id]=${this.category}` : ''}${this.country ? `&filter[pais]=${this.country}` : ''}`
    },
    async getUsers() {
      this.loading = true
      const urlString = await this.makeUrl()
      axios.get(urlString)
          .then(({data}) => {
            this.dataPagination.itemsLength = data.total
            this.dataPagination.itemsPerPage = parseInt(data.per_page, 10)
            this.dataPagination.lastPage = data.last_page
            this.dataPagination.from = data.from
            this.dataPagination.to = data.to
            this.items = Object.freeze(data.data)
          })
          .catch(() => {
            this.snackbar.color = 'error'
            this.snackbar.text = 'error al recuperar los registros de los usuarios'
            this.snackbar.show = true
          })
          .finally(() => this.loading = false)
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

<style>
.searchRows .v-input__prepend-outer {
  margin-top: 0 !important;
}

.searchRows .v-input__append-outer {
  margin-top: 2px !important;
}

.optionsButtons > header {
  position: absolute !important;
  right: 8px !important;
  height: 0 !important;
}

.optionsButtons > header .v-toolbar__content, .v-toolbar__extension {
  padding: 0 !important;
}

.v-data-table tr .optionsButtons {
  align-content: center;
  margin-top: -2.2em;
  display: none;
}

.v-data-table tr:hover .optionsButtons {
  display: block;
}
</style>

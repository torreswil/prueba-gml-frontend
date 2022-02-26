import Vue from 'vue'
import { extend } from 'vee-validate'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { required, email, numeric, alpha_spaces } from 'vee-validate/dist/rules'

Vue.use({
    install (Vue) {
        Vue.component('ValidationProvider', ValidationProvider)
        Vue.component('ValidationObserver', ValidationObserver)
    }
})

extend('required', {
    ...required,
    message: 'El campo {_field_} es requerido'
})

extend('alpha_spaces', {
    ...alpha_spaces,
    message: 'El campo {_field_} solo acepta caracteres alfabéticos y espacios'
})

extend('email', {
    ...email,
    message: 'El correo no es valido'
})

extend('numeric', {
    ...numeric,
    message: 'El campo {_field_} solo acepta caracteres numéricos'
})

extend('minlength', {
    params: ['length'],
    validate(value, { length }) {
        return String(value).length >= length
    },
    message: 'El campo {_field_} debe tener como mínimo {length} caracteres'
})

extend('maxlength', {
    params: ['length'],
    validate(value, { length }) {
        return String(value).length <= length
    },
    message: 'El campo {_field_} debe tener como maximo {length} caracteres'
})
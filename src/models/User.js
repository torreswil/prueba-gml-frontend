export default class User {
    static create(IUser = null) {
        if (IUser) {
            const {
                id = null,
                nombres = null,
                apellidos = null,
                cedula = null,
                email = null,
                pais = null,
                direccion = null,
                celular = null,
                categoria_id = null,
                password = null,
            } = IUser

            return new this(id, nombres, apellidos, cedula, email, pais, direccion, celular, categoria_id, password)
        }

        return new this(null, null, null, null, null, null, null, null, null, null)
    }

    constructor(id, nombres, apellidos, cedula, email, pais, direccion, celular, categoria_id, password) {
        this.id = id
        this.nombres = nombres
        this.apellidos = apellidos
        this.cedula = cedula
        this.email = email
        this.pais = pais
        this.direccion = direccion
        this.celular = celular
        this.categoria_id = categoria_id
        this.password = password
    }
}

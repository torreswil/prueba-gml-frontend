// axios
import axios from 'axios'

const axiosIns = axios.create({
    baseURL: `${window.location.protocol}//${window.location.hostname}:8000/api`,
})

export default axiosIns

import axios from "axios"
import { PHP_API, NODE_API } from "./config"
import auth from "./auth"
import user from "./user"
import schedule from "./schedule"

axios.defaults.withCredentials = true

export default { PHP_API, NODE_API, auth, user, schedule }

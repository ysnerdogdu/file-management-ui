import axios from 'axios'

export default axios.create({
  baseURL: 'https://simple-server-file-management.herokuapp.com/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json'
  }
})

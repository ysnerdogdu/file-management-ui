import http from '../http-common'

class FileDataService {
  getFile (id) {
    return http.get(`/files?id=${id}`)
  }

  createFile (data) {
    return http.post('/files', data)
  }

  updateFile (id, data) {
    return http.put(`/files?id=${id}`, data)
  }

  deleteFile (id) {
    return http.delete(`/files?id=${id}`)
  }
}

export default new FileDataService()

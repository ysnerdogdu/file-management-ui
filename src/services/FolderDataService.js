import http from '../http-common'

class FolderDataService {
  getFolder (id) {
    return http.get(`/folders?id=${id}`)
  }

  createFolder (data) {
    return http.post('/folders', data)
  }

  updateFolder (id, name, parentFolderId) {
    return http.put(`/folders?id=${id}&name=${name}&parentFolderId=${parentFolderId}`)
  }

  deleteFolder (id) {
    return http.delete(`/folders?id=${id}`)
  }
}

export default new FolderDataService()

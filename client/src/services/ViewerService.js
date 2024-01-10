import { AppState } from '../AppState.js'
import { api } from './AxiosService'
class ViewerService {
  async getStream(id) {
    const res = await api.get(`/api/streaming/${id}`)
    AppState.channel = res.data
  }

}

export const viewerService = new ViewerService()
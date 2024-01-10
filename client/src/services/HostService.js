import { api } from "./AxiosService.js";
import { AppState } from '../AppState.js';


class HostService {
  async createStream(channel = { name: 'test' }) {
    const res = await api.post("/api/streaming", channel)
    AppState.channel = res.data
  }

  async getAllStreams() {
    const res = await api.get("/api/streaming")
    AppState.channels = res.data
  }

  async startStream(id) {
    const res = await api.put(`/api/streaming/${id}/start`)
    AppState.channel.stream.State = 'RUNNING'
  }

  async stopStream(id) {
    const res = await api.put(`/api/streaming/${id}/stop`)
    AppState.channel.stream.State = 'STOPPED'
  }

  async deleteStream(id) {
    const res = await api.delete(`/api/streaming/${id}`)
  }

  async getStream(id) {
    const res = await api.get(`/api/streaming/${id}`)
    AppState.channel = res.data
  }

}

export const hostService = new HostService();
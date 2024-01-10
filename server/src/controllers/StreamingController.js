import { Auth0Provider } from '@bcwdev/auth0provider';
import { streamingService } from '../services/StreamingService.js';
import BaseController from '../utils/BaseController';



export class StreamingController extends BaseController {
  constructor() {
    super('api/streaming');
    this.router
      .get('', this.getAll)
      .get('/:id', this.getOne)
      .use(Auth0Provider.hasPermissions('manage:streams'))
      .post('', this.create)
      .put('/:id/start', this.startChannel)
      .put('/:id/stop', this.stopChannel)
      .delete('/:id', this.delete)
  }
  async getAll(req, res, next) {
    try {
      const channels = await streamingService.getAllChannels()
      res.send(channels)
    } catch (error) {
      next(error)
    }
  }

  async getOne(req, res, next) {
    try {
      const channel = await streamingService.getChannel(req.params.id)
      res.send(channel)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      // const channel = await streamingService.createChannel(req.body)
      // res.send(channel)
      throw new Error('Not Implemented')
    } catch (error) {
      next(error)
    }
  }

  async startChannel(req, res, next) {
    try {
      const channel = await streamingService.startChannel(req.params.id)
      res.send(channel)
    } catch (error) {
      next(error)
    }
  }

  async stopChannel(req, res, next) {
    try {
      const channel = await streamingService.stopChannel(req.params.id)
      res.send(channel)
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      await streamingService.deleteChannel(req.params.id)
      res.send('deleted')
    } catch (error) {
      next(error)
    }
  }

}

import eventbus from "../libs/eventbus";
import { SocketService } from "../libs/mqtt/socket.service";
export const EVENT_ACTION_ON_POST = "action_on_post";

export class PostEvent {
  static register() {
    eventbus.on(EVENT_ACTION_ON_POST, PostEvent.actionOnPostHandler);
  }

  static async actionOnPostHandler(post, userId) {
    await SocketService.actionPostHandle(post, userId);
  }
}

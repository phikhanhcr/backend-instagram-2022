import { MqttService } from "./MqttService";

export class SocketService {
  static async actionPostHandle(post, userId) {
    const data = {
      post_id: post.id,
      user_action: userId,
      action: "like",
    };

    await MqttService.actionPostUser(post.userId, data);
  }
}

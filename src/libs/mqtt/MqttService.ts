import { MQTTAdapter } from "./MqttAdapter";
import { TOPIC_USER_GLOBAL } from "./mqtt.topic";

export class MqttService {
  static async actionPostUser(userId, data): Promise<void> {
    const topicName = TOPIC_USER_GLOBAL({ user_id: userId });
    await MQTTAdapter.pushMessage(topicName, data, { retain: false, qos: 1 });
  }
}

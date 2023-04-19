import {
  AsyncClient,
  connectAsync,
  IClientPublishOptions,
  IClientSubscribeOptions,
} from "async-mqtt";

import uuid from "uuid-random";

export interface MQTTClientConnection {
  connected: boolean;
}

export interface EMQXListResponse<T> {
  data: T[];
}

/**
 * Singleton MQTT client
 */
export class MQTTAdapter {
  private static client: AsyncClient;

  static async getClient(): Promise<AsyncClient> {
    try {
      if (!MQTTAdapter.client) {
        MQTTAdapter.client = await connectAsync(
          "ws://localhost:9083/mqtt",
          {
            clientId: uuid(),
            username: "backend",
            password: "backend",
            protocolVersion: 5,
          },
          true
        );
        console.log("Connect to EMQ X successfully!");
      }
      return MQTTAdapter.client;
    } catch (err) {
      process.exit(1);
    }
  }

  static async pushMessage(
    topic: string,
    message: object,
    opts: IClientPublishOptions
  ): Promise<void> {
    try {
      await (
        await MQTTAdapter.getClient()
      ).publish(topic, JSON.stringify(message), opts);
      console.log("Push message into EMQ X successfully!", { topic, message });
    } catch (err) {
      console.log(`Push message into EMQ X topic ${topic} error!`, err);
    }
  }

  static async subcribeTopic(
    topic: string,
    opts: IClientSubscribeOptions
  ): Promise<void> {
    try {
      await (await MQTTAdapter.getClient()).subscribe(topic, opts);
      console.log(`Subcribe topic ${topic} from EMQ X successfully!`);
    } catch (err) {
      console.log(`Subcribe topic ${topic} from EMQ X error!`, err);
    }
  }

  static async unsubcribeTopic(topic: string): Promise<void> {
    try {
      await (await MQTTAdapter.getClient()).unsubscribe(topic);
      console.log(`Unsubcribe topic ${topic} from EMQ X successfully!`);
    } catch (err) {
      console.log(`Unsubcribe topic ${topic} from EMQ X error!`, err);
    }
  }

  static async end(force: boolean): Promise<void> {
    try {
      await (await MQTTAdapter.getClient()).end(force);
      console.log(`Close connection to EMQ X successfully!`);
    } catch (err) {
      console.log(`Close connection to EMQ X error!`, err);
    }
  }

  // static async getMQTTClientInformation(user: IAuthUser): Promise<MQTTClientConnection[]> {
  //     if (EMQX_URI.includes('v4')) {
  //         const url = `${EMQX_URI}/clients/username/${user.type}:${user.id}:${user.device_id}`;

  //         const { data } = await axios.get<EMQXListResponse<MQTTClientConnection>>(url, {
  //             auth: {
  //                 username: EMQX_USERNAME,
  //                 password: EMQX_PASSWORD,
  //             },
  //         });
  //         if (data !== null) {
  //             return data.data;
  //         }
  //     } else {
  //         const url = `${EMQX_URI}/clients`;

  //         const { data } = await axios.get<EMQXListResponse<MQTTClientConnection>>(url, {
  //             auth: {
  //                 username: EMQX_USERNAME,
  //                 password: EMQX_PASSWORD,
  //             },
  //             params: {
  //                 username: `${user.type}:${user.id}:${user.device_id}`,
  //                 conn_state: 'connected',
  //             },
  //         });
  //         if (data !== null) {
  //             return data.data;
  //         }
  //     }

  //     return [];
  // }
}

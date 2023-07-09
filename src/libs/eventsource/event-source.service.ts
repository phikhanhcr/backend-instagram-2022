import { UserType } from "../../db/models/User/UserModel";
import { EventData, EventObjectType } from "./EventData";
import { KafkaAdapter } from "./KafkaAdapter";

export class EventSourceService {
  static async handleActionPostUser() {
    const eventData = new EventData({
      event: "liked_post",
      topic: "User",
      key: `post_id`,
      subject: {
        // doi tuong gay ra hanh dong
        type: UserType.USER,
        id: `1`,
      },
      di_obj: {
        // doi tuong chiu tac dong cua hanh dong
        type: EventObjectType.POST,
        id: "63f20ce68d619df52aaddcd9",
        data: {
          _id: "63f20ce68d619df52aaddcd9",
          title: "ahihi",
          image: "http://localhost:3000",
        },
      },
      // doi tuong phu chiu tac dong
      pr_obj: {
        type: EventObjectType.USER,
        id: `123`,
        data: {
          id: 123,
          name: "Phi Khanh",
        },
      },
      context: {
        req: {
          like_count: 10,
        },
      },
    });
    await KafkaAdapter.publish(eventData);
  }
}

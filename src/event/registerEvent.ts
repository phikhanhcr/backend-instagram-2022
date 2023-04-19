import { PostEvent } from "./../event/PostEvent";
export class RegisterEvent {
  static register() {
    PostEvent.register();
  }
}

import { Model } from '@vuex-orm/core';

export interface IEventType {
  id: string;
  type: string;
  color: string;
}

export default class EventType extends Model {
  public static entity = 'event_types';

  public static fields() {
    return {
      id: this.attr(''),
      type: this.attr(''),
      color: this.attr('')
    };
  }
}

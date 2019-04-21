import { Model } from '@vuex-orm/core';

export interface IEvent {
  id: string;
  name: string;
  room: string;
  frequency: number;
  startDate: string;
  endDate: string;
  duration: number;
  isFullDay: boolean;
  isNotifiable: boolean;
}

export default class Event extends Model {
  public static entity = 'events';

  public static fields() {
    return {
      id: this.attr(''),
      room: this.attr(''),
      interval: this.attr(0),
      frequency: this.attr(''),
      startDate: this.attr(''),
      endDate: this.attr(''),
      duration: this.attr(0),
      isFullDay: this.attr(false),
      isNotifiable: this.attr(false)
    };
  }
}

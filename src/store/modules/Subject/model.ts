import { Model } from '@vuex-orm/core';

import Event from '../Event/model';

export interface ISubject {
  id: string;
  name: string;
  credits: number;
}

export default class Subject extends Model {
  public static entity = 'subjects';

  public static fields() {
    return {
      id: this.attr(''),
      name: this.attr(''),
      credits: this.attr(0),
      events: this.hasMany(Event, 'subjectId')
    };
  }
}

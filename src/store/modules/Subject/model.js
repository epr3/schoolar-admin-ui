import { Model } from '@vuex-orm/core';

import Event from '../Event/model';

export default class Subject extends Model {
  static entity = 'subjects';

  static fields() {
    return {
      id: this.attr(''),
      name: this.attr(''),
      credits: this.attr(0),
      events: this.hasMany(Event, 'subjectId')
    };
  }
}

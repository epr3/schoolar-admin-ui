import { Model } from '@vuex-orm/core';

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
      credits: this.attr(0)
    };
  }
}

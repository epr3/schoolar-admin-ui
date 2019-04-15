import { Model } from '@vuex-orm/core';

export interface IGroup {
  id: string;
  number: string;
  year: string;
}

export default class Group extends Model {
  public static entity = 'groups';

  public static fields() {
    return {
      id: this.attr(''),
      number: this.attr(''),
      year: this.attr('')
    };
  }
}

import { Model } from '@vuex-orm/core';

export interface IFaculty {
  id: string;
  name: string;
}

export default class Faculty extends Model {
  public static entity = 'faculties';

  public static fields() {
    return {
      id: this.attr(''),
      name: this.attr('')
    };
  }
}
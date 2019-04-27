import { Model } from '@vuex-orm/core';

export interface IProfessor {
  id: string;
  name: string;
  surname: string;
  title: string;
  email: string;
  telephone: string;
}

export default class Professor extends Model {
  public static entity = 'professors';

  public static fields() {
    return {
      id: this.attr(''),
      name: this.attr(''),
      surname: this.attr(''),
      email: this.attr(''),
      title: this.attr(''),
      telephone: this.attr('')
    };
  }
}

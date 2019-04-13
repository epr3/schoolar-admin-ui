import { Model } from '@vuex-orm/core';

export default class User extends Model {
  public static entity = 'user';

  public static fields() {
    return {
      id: this.attr(''),
      email: this.attr('')
    };
  }
}

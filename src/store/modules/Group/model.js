import { Model } from '@vuex-orm/core';

import Faculty from '../Faculty/model';

export default class Group extends Model {
  static entity = 'groups';

  static fields() {
    return {
      id: this.attr(''),
      number: this.attr(''),
      year: this.attr(''),
      faculty: this.belongsTo(Faculty, 'facultyId')
    };
  }
}

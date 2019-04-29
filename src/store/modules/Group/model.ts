import { Model, Fields } from '@vuex-orm/core';

import Faculty from '../Faculty/model';

export interface IGroup {
  id: string;
  number: string;
  year: string;
}

export default class Group extends Model {
  public static entity = 'groups';

  public static fields(): Fields {
    return {
      id: this.attr(''),
      number: this.attr(''),
      year: this.attr(''),
      faculty: this.belongsTo(Faculty, 'facultyId')
    };
  }
}

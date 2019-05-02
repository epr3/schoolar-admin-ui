import { Model } from '@vuex-orm/core';
import Group from '../Group/model';
import Subject from '../Subject/model';

export default class Faculty extends Model {
  static entity = 'faculties';

  static fields() {
    return {
      id: this.attr(''),
      name: this.attr(''),
      groups: this.hasMany(Group, 'facultyId'),
      subjects: this.hasMany(Subject, 'facultyId')
    };
  }
}
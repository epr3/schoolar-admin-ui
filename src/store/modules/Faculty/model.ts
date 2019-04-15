import { Model } from '@vuex-orm/core';
import Group from '../Group/model';
import Subject from '../Subject/model';

export interface IFaculty {
  id: string;
  name: string;
}

export default class Faculty extends Model {
  public static entity = 'faculties';

  public static fields() {
    return {
      id: this.attr(''),
      name: this.attr(''),
      groups: this.hasMany(Group, 'faculty_id'),
      subjects: this.hasMany(Subject, 'faculty_id')
    };
  }
}
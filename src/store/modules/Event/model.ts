import { IGroup } from './../Group/model';
import { IProfessor } from './../Professor/model';
import { ISubject } from './../Subject/model';
import { IEventType } from './../EventType/model';
import { Model, Fields } from '@vuex-orm/core';
import EventType from '../EventType/model';
import Subject from '../Subject/model';
import Professor from '../Professor/model';
import Group from '../Group/model';

export interface IEvent {
  id: string;
  name: string;
  room: string;
  frequency: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isFullDay: boolean;
  isNotifiable: boolean;
  eventTypeId: string;
  groupId: string;
  professorId: string;
  subjectId: string;
  event_type: IEventType;
  subject: ISubject;
  professor: IProfessor;
  group: IGroup;
}

export default class Event extends Model {
  public static entity = 'events';

  public static fields(): Fields {
    return {
      id: this.attr(''),
      room: this.attr(''),
      interval: this.attr(0),
      frequency: this.attr(''),
      startDate: this.attr(''),
      endDate: this.attr(''),
      startTime: this.attr(''),
      endTime: this.attr(''),
      isFullDay: this.attr(false),
      isNotifiable: this.attr(false),
      eventTypeId: this.attr(''),
      groupId: this.attr(''),
      professorId: this.attr(''),
      subjectId: this.attr(''),
      event_type: this.belongsTo(EventType, 'eventTypeId'),
      group: this.belongsTo(Group, 'groupId'),
      subject: this.belongsTo(Subject, 'subjectId'),
      professor: this.belongsTo(Professor, 'professorId')
    };
  }
}

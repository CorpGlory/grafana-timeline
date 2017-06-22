
const ANNOTATIONS_TYPES = [
  'point',
  'ray',
  'segment'
];

export class Annotation {
  constructor(type, timeFrom, timeTo) {
    if(!~ANNOTATIONS_TYPES.indexOf(type)) {
      throw new Error('unknown type' + type);
    }
    this._type = type;
  }

  get type() { return this._type; }
}

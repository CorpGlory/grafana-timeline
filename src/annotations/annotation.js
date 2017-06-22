
const ANNOTATIONS_TYPES = [
  'point',
  'ray',
  'segment'
];

export class Annotation {
  constructor(id, type, start, end) {
    if(!~ANNOTATIONS_TYPES.indexOf(type)) {
      throw new Error('unknown type' + type);
    }
    this._id = id;
    this._type = type;
    this._start = start;
    this._end = end;
  }

  get type() { return this._type; }

  getVisObject() {
    return {
      id: this._id,
      type: this._type,
      start: this._start,
      end: this._end
    };
  }
}

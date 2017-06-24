
const ANNOTATIONS_TYPES = [
  'segment',
  'point',
  'ray',
];

export class Annotation {
  constructor(annotationType, id, type, start, end) {
    if(!~ANNOTATIONS_TYPES.indexOf(type)) {
      throw new Error('unknown type' + type);
    }
    this._annotationType = annotationType;
    this._id = id;
    this._type = type;
    this._start = start;
    this._end = end;
  }

  get annotationType() { return this._annotationType; }
  get id() { return this._id; }
  get type() { return this._type; }
  get start() { return this._start; }
  get end() { return this._end; }

  get _visType() {
    if(this._type === 'point') {
      return 'ponit';
    }
    if(this._type === 'range') {
      return 'range';
    }
    if(this._type === 'ray') {
      return 'range';
    }
  }

}

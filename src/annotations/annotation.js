
const ANNOTATIONS_TYPES = [
  'segment',
  'point',
  'ray',
];

export class Annotation {
  constructor(annotationType, id, content, type, start, end) {
    if(!~ANNOTATIONS_TYPES.indexOf(type)) {
      throw new Error('unknown type' + type);
    }
    this._annotationType = annotationType;
    this._content = content === undefined ? '' : content;
    this._id = id;
    this._type = type;
    this._start = start;
    this._end = end;
  }

  get annotationType() { return this._annotationType; }
  get content() { return this._content; }
  get id() { return this._id; }
  get type() { return this._type; }
  get start() { return this._start; }
  get end() { return this._end; }

}


const ANNOTATIONS_TYPES = [
  'segment',
  'point',
  'ray',
];

export class Annotation {
  constructor(annotationType, id, options) {
    if(!~ANNOTATIONS_TYPES.indexOf(options.type)) {
      throw new Error('unknown type' + type);
    }
    this._annotationType = annotationType;
    this._id = id;
    // r.content, r.type, r.start, r.end
    this._content = options.content === undefined ? 
                    '' : options.content;
    this._type = options.type;
    this._start = options.start;
    this._end = options.end;
    this._title = options.title;
    this._options = options;
  }

  get annotationType() { return this._annotationType; }
  get content() { return this._content; }
  get id() { return this._id; }
  set id(value) { this._id = value; }
  get type() { return this._type; }
  get start() { return this._start; }
  get end() { return this._end; }
  get title() { return this._title; }
  get options() { return this._options; }

}

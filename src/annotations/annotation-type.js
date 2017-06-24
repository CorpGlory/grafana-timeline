import { Annotation } from './annotation.js';


const DEFAULT_MAPPING = function(seriesListItem) {
  /*
  Should return:
  [{
    type: ('point' | 'segment' | 'ray')
    start: (timestamp),
    end: [timestamp],
  }]
  */
  console.log(seriesListItem);
  var res = [];
  for(var i = 0; i < seriesListItem.length; i++) {

  }
  res.push({
    type: 'point',
    start: 12321312
  });

  return res;
}

export class AnnotationType {
  static getDefaultOptions(marticsTarget) {
    return {
       name: 'AnnotationsLayer ' + marticsTarget.refId,
       mappingFunctionSource: (DEFAULT_MAPPING + "$")
        .replace('function DEFAULT_MAPPING(', 'function(')
        .replace(new RegExp('        ', 'g'), '  ')
        .replace('      }$', '}')
    }
  }

  constructor(target, options) {
    this._target = target;
    this._options = options;
  }

  get refId() { return this._target.refId; }

  get name() { return this._options.name; }
  set name(value) { this._options.name = value; }

  get mappingFunctionSource() {
    return this._options.mappingFunctionSource;
  }

  set mappingFunctionSource(value) {
    this._options.mappingFunctionSource = value;
    delete this._mappingFunction;
  }

  get mappingFunction() {
    if(this._mappingFunction === undefined) {
      /* jshint ignore:start */
      var src = '(' + this.mappingFunctionSource +')';
      try {
        this._mappingFunction = eval(src);
      } catch(e) {
        e = 'Mapping function execution error: ' + e;
        return e;
      }
      /* jshint ignore:end */
    }
    return this._mappingFunction;
  }

  mapSeriesToAnnotations(seriesListItem) {
    var raws = this.mappingFunction(seriesListItem);
    return raws.map((r, i) => new Annotation(
      this, i, r.type, r.start, r.end
    ));
  }


}

import { Annotation } from './annotation.js';


const DEFAULT_MAPPING = function(seriesListItem) {
  /*
  Should return:
  [{
    content: [String],
    type: ('point' | 'segment' | 'ray'),
    start: (timestamp),
    end: [timestamp],
    title: [String]
  }]
  */

  var points = seriesListItem.datapoints;
  var fromTime = points[0][1];
  var toTime = points[points.length - 1][1];

  var THRESHOLD = points[0][0] + 1;

  var res = [];
  var currentSpan = undefined;
  for (let i = 0; i < points.length; i++) {
    var val = points[i][0];
    var timestamp = points[i][1];

    if (val > THRESHOLD) {
      if (currentSpan === undefined) {
        currentSpan = { 
          type: 'segment', 
          start: timestamp,
          startIndex: i
        };
        currentSpan.maxValue = val;
      } else {
        currentSpan.maxValue = Math.max(currentSpan.maxValue, val);
      }
    } else {
      if (currentSpan !== undefined) {
        currentSpan.end = timestamp;
        currentSpan.content = 'Max ' + currentSpan.maxValue;
        currentSpan.title = "Max: " + currentSpan.maxValue +
          "<br/>" +
          "Items length:" + currentSpan.startIndex
        res.push(currentSpan);
        currentSpan = undefined;
      }
    }
  }

  if (currentSpan !== undefined) {
    currentSpan.type = 'ray';
    currentSpan.content = 'Max ' + currentSpan.maxValue;
    res.push(currentSpan);
  }

  if (res.length === 0) {
    res.push({
      type: 'segment',
      start: Math.round(fromTime + (toTime - fromTime) * 0.1),
      end: Math.round(fromTime + (toTime - fromTime) * 0.9),
      title: fromTime + ' oh no ' + toTime,
      content: '--longest--'
    });
  }

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
    return raws.map((r, i) => new Annotation(this, i, r));
  }

}

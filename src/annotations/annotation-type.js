export class AnnotationType {
  static getDefaultOptions(marticsTarget) {
     return {
       name: 'AnnotationsLayer ' + marticsTarget.refId,
       mappingFunctionSource: `/*
Should return:
[{
  typeIndex: (Number),
  time: (Number),
  lat: (Float),
  lng: (Float),
  icon: [String]
}]
*/
function(seriesListItem) {
  // expecting that seriesListItem.type == 'table';
  var res = [];
  for(var i = 0; i < seriesListItem.rows.length; i++) {
    var r = seriesListItem.rows[i];
    var jsTime = new Date(r[0]);
    var typeIndex = jsTime.getTime() % 3;
    var icon = undefined;
    if(typeIndex == 1) {
      icon = 'fa-unlink';
    }
    if(typeIndex == 2) {
      icon = 'fa-ra';
    }
    var lat = r[1];
    var lng = r[2];
    res.push({
      typeIndex: typeIndex,
      time: r[0],
      lat: lat,
      lng: lng,
      icon: icon
    });
  }
  return res;
}`
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
    return this.mappingFunction(seriesListItem);
  }


}

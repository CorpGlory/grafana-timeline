import { Annotation } from './annotation';


export class AnnotationsManager {
  static getDefaultOption() {
     return {
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

  constructor(options) {
    this._options = options;
  }

  get mappingFunctionSource() {
    console.log('shit!');
    console.log(this._options);
    return this._options.annotations.mappingFunctionSource;
  }

  set mappingFunctionSource(value) {
    this._options.annotations.mappingFunctionSource = value;
  }

  setMeasures() {

  }
}

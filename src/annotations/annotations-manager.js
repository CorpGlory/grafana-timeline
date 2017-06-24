import { AnnotationType } from './annotation-type.js';


export class AnnotationsManager {

  constructor(options) {
    this._options = options;
    this._adjustOptions();
    this._updateTypes();
  }

  mapSeriesToAnnotations(seriesList) {
    // a small hack: if it is an object, than consider it as a 1 - array
    if(!Array.isArray(seriesList)) {
      seriesList = [seriesList];
    }
    console.log('seriesList');
    console.log(seriesList);
    return seriesList.map(
      (sl, i) => this._types[i].mapSeriesToAnnotations(sl)
    );
  }

  get types() { return this._types; }

  _updateTypes() {
    this._types = this._options.targets.map(
      (t, i) => new AnnotationType(t, this._options.annotationTypes[i])
    );
  }

  _adjustOptions() {
    _(this._options.targets)
      .drop(this._options.annotationTypes.length)
      .each(t => {
        this._options.annotationTypes.push(
          AnnotationType.getDefaultOptions(t)
        );
      });
  }
}

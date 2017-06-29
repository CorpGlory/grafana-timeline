import { AnnotationType } from './annotation-type.js';


export class AnnotationsManager {

  constructor(options) {
    this._options = options;
    this._adjustTypesOptions();
  }

  mapSeriesToAnnotations(seriesList) {
    // a small hack: if it is an object, than consider it as a 1 - array
    if(!Array.isArray(seriesList)) {
      seriesList = [seriesList];
    }
    return seriesList.map(
      (sl, i) => this.types[i].mapSeriesToAnnotations(sl)
    );
  }

  get types() { 
    if(this._options.targets.length > this._types.length) {
      this._adjustTypesOptions();
    }
    return this._types; 
  }

  _adjustTypesOptions() {
    _(this._options.targets)
      .drop(this._options.annotationTypes.length)
      .each(t => {
        this._options.annotationTypes.push(
          AnnotationType.getDefaultOptions(t)
        );
      });
    this._types = this._options.targets.map(
      (t, i) => new AnnotationType(t, this._options.annotationTypes[i])
    );
  }
}

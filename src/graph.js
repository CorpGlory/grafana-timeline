import * as vis from './external/vis.min';


export class Graph {
  constructor($holder, height) {
    if($holder.length !== 1) {
      throw new Error('Can`t find holder for graph in DOM');
    }

    var container = $holder.get()[0];

    var items = new vis.DataSet([]);
    // Configuration for the Timeline
    var options = {};
    if(height !== undefined) {
      options.height = height + 'px';
    }
    // Create a Timeline
    this._timeline = new vis.Timeline(container, items, options);
  }

  set height(value) {
    if(!$.isNumeric(value)) {
      throw new Error('height is not numberic');
    }
    this._timeline.setOptions({ height: value + 'px' });
  }

  set range(range) {
    this._timeline.setWindow(range.from, range.to)
  }

  annotationToVisObject(annotation) {
    return {
      id: annotation.id,
      type: annotation.type,
      start: annotation.start,
      end: annotation.end,
      content: 'no content'
    };
  }

  setAnnotations(annotations) {
    var ans = _(annotations)
      .map(as => as.map(this.annotationToVisObject))
      .flatten()
      .value();
    var items = new vis.DataSet(ans);
    this._timeline.setItems(items);
  }

}


import './external/vis.min.css!';

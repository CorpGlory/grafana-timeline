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

  setAnnotations(annotations) {
    var ans = annotations.map(a => a.getVisObject());
    var items = new vis.DataSet(ans);
    this._timeline.setItems(items);
  }

}


import './external/vis.min.css!';

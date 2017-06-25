import * as vis from './external/vis.min';


export class Graph {
  constructor($holder, height, onRangeChange) {
    if($holder.length !== 1) {
      throw new Error('Can`t find holder for graph in DOM');
    }

    var container = $holder.get()[0];

    var items = new vis.DataSet([]);

    var options = {};
    if(height !== undefined) {
      options.height = height + 'px';
    }

    this._timeline = new vis.Timeline(container, items, options);

    this._timeline.on('rangechanged', props => {
      if(props.byUser && onRangeChange !== undefined) {
        onRangeChange(props.start, props.end);
      }
    });
  }

  set height(value) {
    if(!$.isNumeric(value)) {
      throw new Error('height is not numberic');
    }
    this._timeline.setOptions({ height: value + 'px' });
  }

  set range(range) {
    this._range = range;
    this._timeline.setWindow(range.from, range.to)
  }

  _getVisType(annotation) {
    if(annotation.type === 'point') {
      return 'ponit';
    }
    if(annotation.type === 'range') {
      return 'range';
    }
    if(annotation.type === 'ray') {
      return 'range';
    }
  }

  _annotationToVisObject(annotation) {
    return {
      id: annotation.id,
      type: this._getVisType(annotation),
      start: annotation.start,
      end: annotation.end === undefined ? this._range.to : annotation.end,
      content: annotation.content
    };
  }

  setAnnotations(annotations) {
    var ans = _(annotations)
      .map(as => as.map(this._annotationToVisObject.bind(this)))
      .flatten()
      .value();
    var items = new vis.DataSet(ans);
    this._timeline.setItems(items);
  }

}


import './external/vis.min.css!';

import * as vis from './external/vis.min';


export class Graph {
  constructor($holder, height, groupLayers, onRangeChange) {
    if($holder.length !== 1) {
      throw new Error('Can`t find holder for graph in DOM');
    }

    if(typeof(groupLayers) !== "boolean"){
      throw new Error('groupLayers should be boolean');
    }

    var container = $holder.get()[0];

    var items = new vis.DataSet([]);

    var options = {
    };

    var tooltipOptions = {
      tooltip: {
        followMouse: true,
        overflowMethod: 'cap'
      }
    }

    _.defaults(options, tooltipOptions);
    console.log(options);
    
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
    this._timeline.setOptions({ 
      height: value + 'px',
      maxHeight: value
    });
  }

  set groupLayers(value) { this._groupLayers = value; }

  set range(range) {
    this._range = range;
    this._timeline.setWindow(range.from, range.to)
  }

  _getVisType(annotation) {
    if(annotation.type === 'point') {
      return 'point';
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
      content: annotation.content,
      annotation: annotation,
      title: annotation.title,
      option: annotation.option
    };
  }


  setAnnotations(annotations) {
    var ans = [];
    for (var i = 0; i < annotations.length; i++) {
      var as = annotations[i];
      for (var j = 0; j < as.length; j++) {
        var an = as[j];
        an.id = ans.length;
        var vobj = this._annotationToVisObject(an);
        if(this._groupLayers) {
          vobj.group = i;
        }
        ans.push(vobj);
      }
    }

    var items = new vis.DataSet(ans);
    this._timeline.setItems(items);
  }

}


import './external/vis.min.css!';

import { GraphCrosshair } from './graph-crosshair';

import * as vis from './external/vis.min';


export class Graph {
  constructor($holder, height, onRangeChange, onHover, onHoverClean) {
    if($holder.length !== 1) {
      throw new Error('Can`t find holder for graph in DOM');
    }

    var container = $holder.get()[0];
    $holder.mouseout(onHoverClean);

    var items = new vis.DataSet([]);

    var options = {
      editable: false
    };

    var tooltipOptions = {
      tooltip: {
        followMouse: true,
        overflowMethod: 'cap'
      }
    };

    _.defaults(options, tooltipOptions);
    
    if(height !== undefined) {
      options.height = height + 'px';
    }

    this._timeline = new vis.Timeline(container, items, options);
    this._crossHair = new GraphCrosshair(
      this._timeline, onHover, onHoverClean
    );

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

  setHover(date, sharedTooltip) {
    this._crossHair.show(date, sharedTooltip);
  }

  removeHover() {
    this._crossHair.hide();
  }

  setTypes(types) {
    this._groupLayers = true;
    this._groups = new vis.DataSet();
    _.each(types, (t, i) => {
      this._groups.add({ id: i, content: t.name });
    });
    this._timeline.setGroups(this._groups);
  }

  removeTypes() {
    this._groupLayers = false;
    this._timeline.setGroups(undefined);
  }

  setAnnotations(range, annotations) {
    this._range = range;
    var ans = [];
    
    for (let i = 0; i < annotations.length; i++) {
      var as = annotations[i];

      for (let j = 0; j < as.length; j++) {
        var an = as[j];
        an.id = ans.length;
        var vobj = this._annotationToVisObject(an);
        vobj.group = i;
        ans.push(vobj);
      }
    }

    var items = new vis.DataSet(ans);
    this._timeline.setItems(ans);
    this._crossHair.setItems(ans);

    this._timeline.setWindow(range.from, range.to, { animation: false });

  }

}


import './external/vis.min.css!';

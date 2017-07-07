export class GraphCrosshair {
  constructor(timeline, onHover, onHoverClean) {
    this._timeline = timeline;
    this._id = 0;
    this._visible = false;

    this._onHover = onHover;
    this._onHoverClean = onHoverClean;

    this._sharedTooltip = undefined;

    this._timeline.on('mouseOver', this._onMouseHover.bind(this));
    this._timeline.on('mouseMove', this._onMouseHover.bind(this));
  }

  show(date, sharedTooltip) {
    if(!this._visible) {
      this._rebuildCustomTime();
    }
    this._timeline.setCustomTime(date, this._id);
    this._sharedTooltip = sharedTooltip;
    if(sharedTooltip) {
      this._hoverTime = date;
      this._hoverElements();
    }
  }

  hide() {
    this._timeline.removeCustomTime(this._id);
    this._visible = false;
    if(this._sharedTooltip) {
      this._unhoverElements();
    }
  }

  setItems(items) {
    this._items = items;
  }

  _hoverElements() {
    var res = []; // list of ids to select
    var time = this._hoverTime.getTime();

    for(var i = 0; i < this._items.length; i++) {
      var item = this._items[i];
      var start = item.start;
      var end = item.end;
      if(start <= time && time <= end) {
        res.push(item.id);
      }
    }

    this._timeline.setSelection(res);
  }

  _unhoverElements() {
    this._timeline.setSelection([]);
  }

  _rebuildCustomTime() {
    this._timeline.addCustomTime(new Date(), this._id);
    this._visible = true;
  }

  _onMouseHover(evt) {
    if(this._onHover !== undefined) {
      this._onHover(evt.time);
    }
  }

  _onMouseOut() {
    if(this._onHoverClean !== undefined) {
      this._onHoverClean(evt.time);
    }
  }
}
export class GraphCrosshair {
  constructor(timeline) {
    this._timeline = timeline;
    this._id = 0;
    this._visible = false;
  }

  show(date) {
    if(!this._visible) {
      this._rebuildCustomTime();
    }
    this._timeline.setCustomTime(date, this._id);
  }

  hide() {
    this._timeline.removeCustomTime(this._id);
    this._visible = false;
  }

  _rebuildCustomTime() {
    this._timeline.addCustomTime(new Date(), this._id);
    this._visible = true;
  }
}
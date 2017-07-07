import { Graph } from './graph';
import { AnnotationsManager } from './annotations/annotations-manager.js';

import { MetricsPanelCtrl } from 'app/plugins/sdk';
import * as core from 'app/core/core';

import moment from 'moment';


const PANEL_DEFAULTS = {
  annotationTypes: [],
  display: {
    groupLayers: true
  }
};


export class Ctrl extends MetricsPanelCtrl {
  constructor($scope, $injector, timeSrv) {
    super($scope, $injector);

    _.defaults(this.panel, PANEL_DEFAULTS);
    $scope.dashboard = this.dashboard;
    this.timeSrv = timeSrv;

    this.events.on('render', this._onRender.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('panel-initialized', this._onRender.bind(this));

    core.appEvents.on('graph-hover', this._onGraphHover.bind(this));
    core.appEvents.on('graph-hover-clear', this._onGraphHoverClear.bind(this));

    this._initStyles();

    this.annotationsManager = new AnnotationsManager(this.panel);
  }

  link(scope, elem, attrs, ctrl) {
    this.$mainholder = $(elem[0]).find('.timeline-holder');
    this.$visHolder = this.$mainholder.find('.vis-holder');

    this._initGraph();
  }

  _onRender() {
    if(this._graph !== undefined) {
      this._graph.height = this.height;
    }
  }

  _onInitEditMode() {
    var thisPartialPath = this.panelPath + 'partials/';
    this.addEditorTab(
      'Data Mapping', thisPartialPath + 'editor.mapping.html', 2
    );
    this.addEditorTab(
      'Display', thisPartialPath + 'editor.display.html', 3
    );
  }

  _onDataReceived(seriesList) {
    if(this._graph === undefined) {
      throw new Error('Get data before graph');
    }
    var annotations = this.annotationsManager
                          .mapSeriesToAnnotations(seriesList);
    this._graph.range = this.range;
    this._graph.setAnnotations(annotations);
    this.render(this.seriesList);
  }

  _initStyles() {
    System.import(this.panelPath + 'css/panel.base.css!');
    if (grafanaBootData.user.lightTheme) {
      System.import(this.panelPath + 'css/panel.light.css!');
    } else {
      System.import(this.panelPath + 'css/panel.dark.css!');
    }
  }

  _initGraph() {
    this._graph = new Graph(
      this.$visHolder, this.height,
      this._onGraphRangeChange.bind(this),
      this._onTimelineHover.bind(this),
      this._onTimelineHoverClear.bind(this)
    );
    this.updateGraphLayers();
  }

  _onGraphRangeChange(start, end) {
    this.timeSrv.setTime({
      from : moment.utc(start),
      to : moment.utc(end),
    });
    this.range.start = start;
  }

  _onGraphHover(evt) {
    // ignore other graph hover events if shared tooltip is disabled
    if(
      !this.dashboard.sharedTooltipModeEnabled() || 
      this.otherPanelInFullscreenMode()
    ) {
      return;
    }
    if(this._graph === undefined) {
      return;
    }
    this._graph.setHover(
      new Date(evt.pos.x), 
      this.dashboard.graphTooltip == 2 // where 2 means "Shared tooltip"
    );
  }

  _onGraphHoverClear(evt) {
    this._graph.removeHover();
  }

  _onTimelineHover(date) {
    core.appEvents.emit('graph-hover', {
      pos: {
        x: date.getTime(),
        panelRelY: 0.3 // TODO: investigate better UX
      },
      panel: this.panel
    });
  }

  _onTimelineHoverClear() {
    
  }

  updateGraphLayers() {
    if(this.panel.display.groupLayers) {
      this._graph.setTypes(this.annotationsManager.types);
    } else {
      this._graph.removeTypes();
    }
  }

  get panelPath() {
    if(this._panelPath === undefined) {
      var panels = grafanaBootData.settings.panels;
      var thisPanel = panels[this.pluginId];
      // the system loader preprends publib to the url,
      // add a .. to go back one level
      this._panelPath = '../' + thisPanel.baseUrl + '/';
    }
    return this._panelPath;
  }

}

Ctrl.templateUrl = 'partials/template.html';

export { Ctrl as PanelCtrl };

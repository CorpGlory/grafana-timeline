import { Graph } from './graph';
import { AnnotationsManager } from './annotations/annotations-manager.js';

import { MetricsPanelCtrl } from 'app/plugins/sdk';


const PANEL_DEFAULTS = {
  annotationTypes: []
};


export class Ctrl extends MetricsPanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);

    _.defaults(this.panel, PANEL_DEFAULTS);
    $scope.dashboard = this.dashboard;

    this.events.on('render', this._onRender.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('panel-initialized', this._onRender.bind(this));

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
    this._graph = new Graph(this.$visHolder, this.height);
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

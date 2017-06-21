import { Graph } from './graph';

import { PanelCtrl } from 'app/plugins/sdk';
import config from 'app/core/config';


const MIN_HIGHT = 40;
const TITLE_HIGHT = 25;


export class Ctrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    $scope.dashboard = this.dashboard;

    this.events.on('render', this.onRender.bind(this));
    this.events.on('panel-initialized', this.onRender.bind(this));
  }

  onRender() {
  }

  link(scope, elem, attrs, ctrl) {
    this.$mainholder = $(elem[0]).find('.timelineHolder');
    this.$visHolder = this.$mainholder.find('.visHolder');

    this._initGraph();
  }


  _initGraph() {
    this.graph = new Graph(this.$visHolder);
  }

}

Ctrl.templateUrl = 'module.html';

export { Ctrl as PanelCtrl };

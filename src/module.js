import { PanelCtrl } from 'app/plugins/sdk';
import config from 'app/core/config';

const MIN_HIGHT = 40;
const TITLE_HIGHT = 25;

export class Ctrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    this.setDefaults();
    $scope.dashboard = this.dashboard;

    this.events.on('render', this.onRender.bind(this));
    this.events.on('panel-initialized', this.onRender.bind(this));
  }

  setDefaults() {
    this.panel.title = '!!!';
    if(this.row.isNew && this.row.panels.length === 1) {
      this.row.height = MIN_HIGHT;
    }
  }

  onRender() {
    var height = this.containerHeight - TITLE_HIGHT;
    if(height < 25) {
      height = 25;
    }
    this.$holder.css('height', height + 'px');
  }

  link(scope, elem, attrs, ctrl) {
    this.$holder = $(elem[0]).find('.tagsline')
  }

}

Ctrl.templateUrl = 'module.html';

export { Ctrl as PanelCtrl };

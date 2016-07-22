/* @ngInject */

import angular from 'angular';

import {projects} from './app/grid/projects';
import 'angular-ui-router';
import routesConfig from './routes';

import './index.scss';
export const app = 'app';

angular
  .module(app, ['ui.router'])
  .config(routesConfig)
  .component('app', projects);

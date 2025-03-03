// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {NgModule} from '@angular/core';
import {ConfirmDialog} from '@common/dialogs/config/dialog';

import {SharedModule} from '../../shared.module';
import {ComponentsModule} from '../components/module';

import {AlertDialog} from './alert/dialog';
import {DeleteResourceDialog} from './deleteresource/dialog';
import {UninstallResourceDialog} from './uninstallresource/dialog';
import {TraceDetailResourceDialog} from './tracedetailresource/dialog';
import {InstallResourceDialog} from './installresource/dialog';
import {LogsDownloadDialog} from './download/dialog';
import {EditResourceDialog} from './editresource/dialog';
import {RestartResourceDialog} from './restartresource/dialog';
import {ScaleResourceDialog} from './scaleresource/dialog';
import {TriggerResourceDialog} from './triggerresource/dialog';
import {PreviewDeploymentDialog} from './previewdeployment/dialog';
import {DialogFormModule} from './installresource/form/module';

@NgModule({
  imports: [SharedModule, ComponentsModule, DialogFormModule],
  declarations: [
    AlertDialog,
    EditResourceDialog,
    DeleteResourceDialog,
		UninstallResourceDialog,
		InstallResourceDialog,
    LogsDownloadDialog,
    RestartResourceDialog,
    ScaleResourceDialog,
    TriggerResourceDialog,
		TraceDetailResourceDialog,
    ConfirmDialog,
    PreviewDeploymentDialog,
  ],
  exports: [
    AlertDialog,
    EditResourceDialog,
    DeleteResourceDialog,
		UninstallResourceDialog,
		InstallResourceDialog,
    LogsDownloadDialog,
    RestartResourceDialog,
    ScaleResourceDialog,
		TraceDetailResourceDialog,
    TriggerResourceDialog,
    PreviewDeploymentDialog,
  ],
  entryComponents: [
    AlertDialog,
    EditResourceDialog,
    DeleteResourceDialog,
		UninstallResourceDialog,
		InstallResourceDialog,
    LogsDownloadDialog,
    RestartResourceDialog,
		TraceDetailResourceDialog,
    ScaleResourceDialog,
    TriggerResourceDialog,
    PreviewDeploymentDialog,
  ],
})
export class DialogsModule {}

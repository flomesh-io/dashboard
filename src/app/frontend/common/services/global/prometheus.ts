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

import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {EventEmitter, Injectable, Inject} from '@angular/core';
import {ObjectMeta, TypeMeta} from '@api/root.api';
import {GlobalSettingsService} from '../global/globalsettings';
import {publishReplay, refCount, switchMap, switchMapTo} from 'rxjs/operators';
import {timer, Subject} from 'rxjs';

import {PrometheusResource} from '../../resources/prometheusresource';


@Injectable()
export class PrometheusService {
  onPrometheusChange = new Subject<void>();
  onMetricChange = new Subject<void>();

  constructor(
		private readonly http_: HttpClient,
		private readonly settings_: GlobalSettingsService
		// private readonly csrfToken_: CsrfTokenService,
	) {}

	doPrometheusChange(): void {
		this.onPrometheusChange.next();
	}
	doMetricChange(): void {
		this.onMetricChange.next();
	}
	//(osm_request_duration_ms_bucket{destination_name="bookwarehouse",destination_namespace="bookwarehouse",source_name="bookstore",source_namespace="bookstore"}[1m]
	getTPS(typeMeta: TypeMeta, objectMeta: ObjectMeta,isInit: boolean) {
		const cond = typeMeta.kind == 'service'?`source_name="${objectMeta.name}",source_namespace="${objectMeta.name}"`:'';
		const query = `topk(2, sum(irate(sidecar_cluster_upstream_rq_xx{${cond}}[1m])) by (source_namespace, source_service, sidecar_cluster_name))`;
		const url = PrometheusResource.getUrl(typeMeta, objectMeta, query,isInit);
		return this.http_.get(url, {responseType: 'text'});
	}
	getER(typeMeta: TypeMeta, objectMeta: ObjectMeta,isInit: boolean) {
		const cond = typeMeta.kind == 'service'?`source_name="${objectMeta.name}",source_namespace="${objectMeta.name},sidecar_response_code_class!="2""`:'sidecar_response_code_class!="2"';
		const query = `topk(2, sum(irate(sidecar_cluster_upstream_rq_xx{${cond}}[1m])) by (source_namespace, source_service, sidecar_cluster_name))`;
		const url = PrometheusResource.getUrl(typeMeta, objectMeta, query,isInit);
		return this.http_.get(url, {responseType: 'text'});
	}
	getLatency(typeMeta: TypeMeta, objectMeta: ObjectMeta,isInit: boolean) {
		const cond = typeMeta.kind == 'service'?`destination_name="${objectMeta.name}"`:'';
		const query = `topk(2, histogram_quantile(0.99,sum(irate(osm_request_duration_ms_bucket{${cond}}[1m])) by (le, source_namespace, source_name, destination_namespace, destination_name)))`;
		const url = PrometheusResource.getUrl(typeMeta, objectMeta, query,isInit);
		return this.http_.get(url, {responseType: 'text'});
	}

  getHttpHeaders_(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  }
}

export const meshOptionYaml: string = `
# Default values for osm-edge.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.
osm:

  #
  # -- OSM control plane image parameters
  image:
    # -- Container image registry for control plane images
    registry: flomesh
    # -- Container image pull policy for control plane containers
    pullPolicy: IfNotPresent
    # -- Container image tag for control plane images
    tag: "1.1.0"
    # -- Image name defaults
    name:
      # -- osm-controller's image name
      osmController: osm-edge-controller
      # -- osm-injector's image name
      osmInjector: osm-edge-injector
      # -- Sidecar init container's image name
      osmSidecarInit: osm-edge-sidecar-init
      # -- osm-boostrap's image name
      osmBootstrap: osm-edge-bootstrap
      # -- osm-crds' image name
      osmCRDs: osm-edge-crds
      # -- osm-preinstall's image name
      osmPreinstall: osm-edge-preinstall
      # -- osm-healthcheck's image name
      osmHealthcheck: osm-edge-healthcheck
    # -- Image digest (defaults to latest compatible tag)
    digest:
      # -- osm-controller's image digest
      osmController: ""
      # -- osm-injector's image digest
      osmInjector: ""
      # -- Sidecar init container's image digest
      osmSidecarInit: ""
      # -- osm-crds' image digest
      osmCRDs: ""
      # -- osm-boostrap's image digest
      osmBootstrap: ""
      # -- osm-preinstall's image digest
      osmPreinstall: ""
      # -- osm-healthcheck's image digest
      osmHealthcheck: ""


  # -- 'osm-controller' image pull secret
  imagePullSecrets: []
  # -- The class of the OSM Sidecar Driver
  sidecarClass: pipy
  # -- Sidecar image for Linux workloads
  sidecarImage: ""
  # -- Sidecar drivers supported by osm-edge
  sidecarDrivers:
    - sidecarName: pipy
      # -- Sidecar image for Linux workloads
      sidecarImage: flomesh/pipy:0.50.0-25
      # -- Remote destination port on which the Discovery Service listens for new connections from Sidecars.
      proxyServerPort: 6060
    - sidecarName: envoy
      # -- Sidecar image for Linux workloads
      sidecarImage: envoyproxy/envoy:v1.19.3
      # -- Sidecar image for Windows workloads
      sidecarWindowsImage: envoyproxy/envoy-windows:latest
      # -- Remote destination port on which the Discovery Service listens for new connections from Sidecars.
      proxyServerPort: 15128
  # -- Curl image for control plane init container
  curlImage: curlimages/curl
  # -- Pipy repo image for Pipy sidecar's proxy control plane container
  pipyRepoImage: flomesh/pipy:0.50.0-25
  #
  # -- OSM controller parameters
  osmController:
    # -- OSM controller's replica count (ignored when autoscale.enable is true)
    replicaCount: 1
    # -- OSM controller's container resource parameters. See https://docs.openservicemesh.io/docs/guides/ha_scale/scale/ for more details.
    resource:
      limits:
        cpu: "1.5"
        memory: "1G"
      requests:
        cpu: "0.5"
        memory: "128M"
    # -- OSM controller's pod labels
    podLabels: {}
    # -- Enable Pod Disruption Budget
    enablePodDisruptionBudget: false
    # -- Auto scale configuration
    autoScale:
      # -- Enable Autoscale
      enable: false
      # -- Minimum replicas for autoscale
      minReplicas: 1
      # -- Maximum replicas for autoscale
      maxReplicas: 5
      cpu:
        # -- Average target CPU utilization (%)
        targetAverageUtilization: 80
      memory:
        # -- Average target memory utilization (%)
        targetAverageUtilization: 80

  #
  # -- Prometheus parameters
  prometheus:
    # -- Prometheus's container resource parameters
    resources:
      limits:
        cpu: "1"
        memory: "2G"
      requests:
        cpu: "0.5"
        memory: "512M"
    # -- Prometheus service's port
    port: 7070
    # -- Prometheus data rentention configuration
    retention:
      # -- Prometheus data retention time
      time: 15d
    # -- Image used for Prometheus
    image: prom/prometheus:v2.18.1

  certificateProvider:
    # -- The Certificate manager type: 'tresor', 'vault' or 'cert-manager'
    kind: tresor
    # -- Service certificate validity duration for certificate issued to workloads to communicate over mTLS
    serviceCertValidityDuration: 24h
    # -- Certificate key bit size for data plane certificates issued to workloads to communicate over mTLS
    certKeyBitSize: 2048

  #
  # -- Hashicorp Vault configuration
  vault:
    # --  Hashicorp Vault host/service - where Vault is installed
    host: ""
    # -- protocol to use to connect to Vault
    protocol: http
    # -- token that should be used to connect to Vault
    token: ""
    # -- Vault role to be used by Open Service Mesh
    role: openservicemesh

  #
  # -- cert-manager.io configuration
  certmanager:
    # --  cert-manager issuer namecert-manager issuer name
    issuerName: osm-ca
    # -- cert-manager issuer kind
    issuerKind: Issuer
    # -- cert-manager issuer group
    issuerGroup: cert-manager.io

  # -- The Kubernetes secret name to store CA bundle for the root CA used in OSM
  caBundleSecretName: osm-ca-bundle

  #
  # -- Grafana parameters
  grafana:
    # -- Grafana service's port
    port: 3000
    # -- Enable Remote Rendering in Grafana
    enableRemoteRendering: false
    # -- Image used for Grafana
    image: grafana/grafana:8.2.2
    # -- Image used for Grafana Renderer
    rendererImage: grafana/grafana-image-renderer:3.2.1

  # -- Enable the debug HTTP server on OSM controller
  enableDebugServer: false

  # -- Enable permissive traffic policy mode
  enablePermissiveTrafficPolicy: false

  # -- Enable egress in the mesh
  enableEgress: false

  # -- Enable reconciler for OSM's CRDs and mutating webhook
  enableReconciler: false

  # -- Deploy Prometheus with OSM installation
  deployPrometheus: false

  # -- Deploy Grafana with OSM installation
  deployGrafana: false

  # -- Enable Fluent Bit sidecar deployment on OSM controller's pod
  enableFluentbit: false

  #
  # -- FluentBit parameters
  fluentBit:
    # -- Fluent Bit sidecar container name
    name: fluentbit-logger
    # -- Registry for Fluent Bit sidecar container
    registry: fluent
    # -- Fluent Bit sidecar image tag
    tag: 1.6.4
    # -- PullPolicy for Fluent Bit sidecar container
    pullPolicy: IfNotPresent
    # -- Fluent Bit output plugin
    outputPlugin: stdout
    # -- WorkspaceId for Fluent Bit output plugin to Log Analytics
    workspaceId: ""
    # -- Primary Key for Fluent Bit output plugin to Log Analytics
    primaryKey: ""
    # -- Enable proxy support toggle for Fluent Bit
    enableProxySupport: false
    # -- Optional HTTP proxy endpoint for Fluent Bit
    httpProxy: ""
    # -- Optional HTTPS proxy endpoint for Fluent Bit
    httpsProxy: ""

  # -- Identifier for the instance of a service mesh within a cluster
  meshName: osm

  # -- Log level for the proxy sidecar. Non developers should generally never set this value. In production environments the LogLevel should be set to 'error'
  sidecarLogLevel: error

  # -- Sets the max data plane connections allowed for an instance of osm-controller, set to 0 to not enforce limits
  maxDataPlaneConnections: 0

   # -- Sets the resync interval for regular proxy broadcast updates, set to 0s to not enforce any resync
  configResyncInterval: "0s"

  # -- Controller log verbosity
  controllerLogLevel: info

  # -- Enforce only deploying one mesh in the cluster
  enforceSingleMesh: true

  # -- Prefix used in name of the webhook configuration resources
  webhookConfigNamePrefix: osm-webhook

  # -- Namespace to deploy OSM in. If not specified, the Helm release namespace is used.
  osmNamespace: ""

  nodeSelector:
    arch: amd64
    os: linux

  # -- Deploy Jaeger during OSM installation
  deployJaeger: false

  #
  # -- Tracing parameters
  #
  # The following section configures a destination collector where tracing
  # data is sent to. Current implementation supports only Zipkin format
  # backends (https://github.com/openservicemesh/osm/issues/1596)
  tracing:
    # -- Toggles Sidecar's tracing functionality on/off for all sidecar proxies in the mesh
    enable: false
    # -- Address of the tracing collector service (must contain the namespace). When left empty, this is computed in helper template to "jaeger.<osm-namespace>.svc.cluster.local". Please override for BYO-tracing as documented in tracing.md
    address: ""
    # -- Port of the tracing collector service
    port: 9411
    # -- Tracing collector's API path where the spans will be sent to
    endpoint: "/api/v2/spans"
    # -- Image used for tracing
    image: jaegertracing/all-in-one

  # -- Specifies a global list of IP ranges to exclude from outbound traffic interception by the sidecar proxy.
  # If specified, must be a list of IP ranges of the form a.b.c.d/x.
  outboundIPRangeExclusionList: []

  # -- Specifies a global list of IP ranges to include for outbound traffic interception by the sidecar proxy.
  # If specified, must be a list of IP ranges of the form a.b.c.d/x.
  outboundIPRangeInclusionList: []

  # -- Specifies a global list of ports to exclude from outbound traffic interception by the sidecar proxy.
  # If specified, must be a list of positive integers.
  outboundPortExclusionList: []

  # -- Specifies a global list of ports to exclude from inbound traffic interception by the sidecar proxy.
  # If specified, must be a list of positive integers.
  inboundPortExclusionList: []

  #
  # -- OSM's sidecar injector parameters
  injector:
    # -- Sidecar injector's replica count (ignored when autoscale.enable is true)
    replicaCount: 1
    # -- Sidecar injector's container resource parameters
    resource:
      limits:
        cpu: "0.5"
        memory: "64M"
      requests:
        cpu: "0.3"
        memory: "64M"
    # -- Sidecar injector's pod labels
    podLabels: {}
    # -- Enable Pod Disruption Budget
    enablePodDisruptionBudget: false
    # -- Auto scale configuration
    autoScale:
      # -- Enable Autoscale
      enable: false
      # -- Minimum replicas for autoscale
      minReplicas: 1
      # -- Maximum replicas for autoscale
      maxReplicas: 5
      cpu:
        # -- Average target CPU utilization (%)
        targetAverageUtilization: 80
      memory:
      # -- Average target memory utilization (%)
        targetAverageUtilization: 80
    # -- Mutating webhook timeout
    webhookTimeoutSeconds: 20

  # -- Run init container in privileged mode
  enablePrivilegedInitContainer: false

  #
  # -- Feature flags for experimental features
  featureFlags:
    # -- Enable extra Sidecar statistics generated by a custom WASM extension
    enableWASMStats: false
    # -- Enable OSM's Egress policy API.
    # When enabled, fine grained control over Egress (external) traffic is enforced
    enableEgressPolicy: true
    # -- Enable Multicluster mode.
    # When enabled, multicluster mode will be enabled in OSM
    enableMulticlusterMode: false
    # -- Enable async proxy-service mapping
    enableAsyncProxyServiceMapping: false
    # -- Enables OSM's IngressBackend policy API.
    # When enabled, OSM will use the IngressBackend API allow ingress traffic to mesh backends
    enableIngressBackendPolicy: true
    # -- Enable Sidecar active health checks
    enableSidecarActiveHealthChecks: false
    # -- Enables SnapshotCache feature for Sidecar xDS server.
    enableSnapshotCacheMode: false
    # -- Enable Retry Policy for automatic request retries
    enableRetryPolicy: false

  # -- OSM multicluster feature configuration
  multicluster:
    # -- Log level for the multicluster gateway
    gatewayLogLevel: error

  # -- Node tolerations applied to control plane pods.
  # The specified tolerations allow pods to schedule onto nodes with matching taints.
  controlPlaneTolerations: []

  #
  # -- OSM bootstrap parameters
  osmBootstrap:
    # -- OSM bootstrap's replica count
    replicaCount: 1
    # -- OSM bootstrap's container resource parameters
    resource:
      limits:
        cpu: "0.5"
        memory: "128M"
      requests:
        cpu: "0.3"
        memory: "128M"
    # -- OSM bootstrap's pod labels
    podLabels: {}

  #
  # -- OSM resource validator webhook configuration
  validatorWebhook:
    # -- Name of the ValidatingWebhookConfiguration
    webhookConfigurationName: ""

#
# -- Contour configuration
contour:
  # -- Enables deployment of Contour control plane and gateway
  enabled: false
  # -- Contour controller configuration
  contour:
    image:
      registry: docker.io
      repository: projectcontour/contour
      tag: v1.18.0
  # -- Contour sidecar edge proxy configuration
  sidecar:
    image:
      registry: docker.io
      repository: envoyproxy/envoy-alpine
      tag: v1.19.3

#
# -- SMI configuration
smi:
  # -- Enables validation of SMI Traffic Target
  validateTrafficTarget: true

#
# -- FSM configuration
fsm:
  # -- Enables deployment of fsm control plane and gateway
  enabled: false
`
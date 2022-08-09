package tcproute

import (
	"context"
	"log"

	"github.com/kubernetes/dashboard/src/app/backend/api"

	smispecsv1alpha4 "github.com/servicemeshinterface/smi-sdk-go/pkg/apis/specs/v1alpha4"
	smispecsclientset "github.com/servicemeshinterface/smi-sdk-go/pkg/gen/client/specs/clientset/versioned"

	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	client "k8s.io/client-go/kubernetes"
)

// TCPRouteDetail API resource provides mechanisms to inject containers with configuration data while keeping
// containers agnostic of Kubernetes
type TCPRouteDetail struct {
	ObjectMeta api.ObjectMeta `json:"objectMeta"`
	TypeMeta   api.TypeMeta   `json:"typeMeta"`
	// Spec is the MeshConfig specification.
	// +optional
	Spec     smispecsv1alpha4.TCPRouteSpec 	`json:"spec,omitempty"`
	MeshName string                         `json:"meshName"`
	Option   string                         `json:"option"`
}

// GetTCPRouteDetail returns detailed information about an meshconfig
func GetTCPRouteDetail(smiSpecsClient smispecsclientset.Interface, client client.Interface, namespace, name string) (*TCPRouteDetail, error) {
	log.Printf("Getting details of %s tcproute in %s namespace", name, namespace)

	rawTCPRoute, err := smiSpecsClient.SpecsV1alpha4().TCPRoutes(namespace).Get(context.TODO(), name, metaV1.GetOptions{})

	if err != nil {
		return nil, err
	}

	return getTCPRouteDetail(rawTCPRoute, client), nil
}

func getTCPRouteDetail(tcpRoute *smispecsv1alpha4.TCPRoute, client client.Interface) *TCPRouteDetail {
	meshName := ""
	deployment, err := client.AppsV1().Deployments(tcpRoute.ObjectMeta.Namespace).Get(context.TODO(), "osm-controller", metaV1.GetOptions{})
	if err == nil {
		meshName = deployment.ObjectMeta.Labels["meshName"]
	}

	return &TCPRouteDetail{
		ObjectMeta: api.NewObjectMeta(tcpRoute.ObjectMeta),
		TypeMeta:   api.NewTypeMeta(api.ResourceKindTCPRoute),
		Spec:       tcpRoute.Spec,
		MeshName:   meshName,
	}
}

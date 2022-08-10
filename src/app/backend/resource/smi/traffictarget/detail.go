package traffictarget

import (
	"context"
	"log"

	"github.com/kubernetes/dashboard/src/app/backend/api"

	smiaccessv1alpha3 "github.com/servicemeshinterface/smi-sdk-go/pkg/apis/access/v1alpha3"
	smiaccessclientset "github.com/servicemeshinterface/smi-sdk-go/pkg/gen/client/access/clientset/versioned"

	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	client "k8s.io/client-go/kubernetes"
)

// TrafficTargetDetail API resource provides mechanisms to inject containers with configuration data while keeping
// containers agnostic of Kubernetes
type TrafficTargetDetail struct {
	ObjectMeta api.ObjectMeta `json:"objectMeta"`
	TypeMeta   api.TypeMeta   `json:"typeMeta"`
	// Spec is the TrafficTarget specification.
	// +optional
	Spec     smiaccessv1alpha3.TrafficTargetSpec	`json:"spec,omitempty"`
	MeshName string                         		`json:"meshName"`
	Option   string                         		`json:"option"`
}

// GetTrafficTargetDetail returns detailed information about an traffictarget
func GetTrafficTargetDetail(smiAccessClient smiaccessclientset.Interface, client client.Interface, namespace, name string) (*TrafficTargetDetail, error) {
	log.Printf("Getting details of %s tcproute in %s namespace", name, namespace)

	rawTrafficTarget, err := smiAccessClient.AccessV1alpha3().TrafficTargets(namespace).Get(context.TODO(), name, metaV1.GetOptions{})

	if err != nil {
		return nil, err
	}

	return getTrafficTargetDetail(rawTrafficTarget, client), nil
}

func getTrafficTargetDetail(trafficTarget *smiaccessv1alpha3.TrafficTarget, client client.Interface) *TrafficTargetDetail {
	meshName := ""
	deployment, err := client.AppsV1().Deployments(trafficTarget.ObjectMeta.Namespace).Get(context.TODO(), "osm-controller", metaV1.GetOptions{})
	if err == nil {
		meshName = deployment.ObjectMeta.Labels["meshName"]
	}

	return &TrafficTargetDetail{
		ObjectMeta: api.NewObjectMeta(trafficTarget.ObjectMeta),
		TypeMeta:   api.NewTypeMeta(api.ResourceKindTrafficTarget),
		Spec:       trafficTarget.Spec,
		MeshName:   meshName,
	}
}

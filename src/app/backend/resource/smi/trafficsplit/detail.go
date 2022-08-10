package trafficsplit

import (
	"context"
	"log"

	"github.com/kubernetes/dashboard/src/app/backend/api"

	smisplitv1alpha2 "github.com/servicemeshinterface/smi-sdk-go/pkg/apis/split/v1alpha2"
	smisplitclientset "github.com/servicemeshinterface/smi-sdk-go/pkg/gen/client/split/clientset/versioned"

	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	client "k8s.io/client-go/kubernetes"
)

// TrafficSplitDetail API resource provides mechanisms to inject containers with configuration data while keeping
// containers agnostic of Kubernetes
type TrafficSplitDetail struct {
	ObjectMeta api.ObjectMeta `json:"objectMeta"`
	TypeMeta   api.TypeMeta   `json:"typeMeta"`
	// Spec is the TrafficSplit specification.
	// +optional
	Spec     smisplitv1alpha2.TrafficSplitSpec	`json:"spec,omitempty"`
	MeshName string                         	`json:"meshName"`
	Option   string                         	`json:"option"`
}

// GetTrafficSplitDetail returns detailed information about an trafficsplit
func GetTrafficSplitDetail(smiSplitClient smisplitclientset.Interface, client client.Interface, namespace, name string) (*TrafficSplitDetail, error) {
	log.Printf("Getting details of %s tcproute in %s namespace", name, namespace)

	rawTrafficSplit, err := smiSplitClient.SplitV1alpha2().TrafficSplits(namespace).Get(context.TODO(), name, metaV1.GetOptions{})

	if err != nil {
		return nil, err
	}

	return getTrafficSplitDetail(rawTrafficSplit, client), nil
}

func getTrafficSplitDetail(trafficSplit *smisplitv1alpha2.TrafficSplit, client client.Interface) *TrafficSplitDetail {
	meshName := ""
	deployment, err := client.AppsV1().Deployments(trafficSplit.ObjectMeta.Namespace).Get(context.TODO(), "osm-controller", metaV1.GetOptions{})
	if err == nil {
		meshName = deployment.ObjectMeta.Labels["meshName"]
	}

	return &TrafficSplitDetail{
		ObjectMeta: api.NewObjectMeta(trafficSplit.ObjectMeta),
		TypeMeta:   api.NewTypeMeta(api.ResourceKindTrafficSplit),
		Spec:       trafficSplit.Spec,
		MeshName:   meshName,
	}
}

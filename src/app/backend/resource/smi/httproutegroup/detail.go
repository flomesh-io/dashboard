package httproutegroup

import (
	"context"
	"log"

	"github.com/kubernetes/dashboard/src/app/backend/api"

	smispecsv1alpha4 "github.com/servicemeshinterface/smi-sdk-go/pkg/apis/specs/v1alpha4"
	smispecsclientset "github.com/servicemeshinterface/smi-sdk-go/pkg/gen/client/specs/clientset/versioned"

	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	client "k8s.io/client-go/kubernetes"
)

// HTTPRouteGroupDetail API resource provides mechanisms to inject containers with configuration data while keeping
// containers agnostic of Kubernetes
type HTTPRouteGroupDetail struct {
	ObjectMeta api.ObjectMeta `json:"objectMeta"`
	TypeMeta   api.TypeMeta   `json:"typeMeta"`
	// Spec is the HTTPRouteGroup specification.
	// +optional
	Spec     smispecsv1alpha4.HTTPRouteGroupSpec 	`json:"spec,omitempty"`
	MeshName string                          		`json:"meshName"`
	Option   string                          		`json:"option"`
}

// GetHTTPRouteGroupDetail returns detailed information about an httproutegroup
func GetHTTPRouteGroupDetail(smiSpecsClient smispecsclientset.Interface, client client.Interface, namespace, name string) (*HTTPRouteGroupDetail, error) {
	log.Printf("Getting details of %s httproutegroup in %s namespace", name, namespace)

	rawHTTPRouteGroup, err := smiSpecsClient.SpecsV1alpha4().HTTPRouteGroups(namespace).Get(context.TODO(), name, metaV1.GetOptions{})

	if err != nil {
		return nil, err
	}

	return getHTTPRouteGroupDetail(rawHTTPRouteGroup, client), nil
}

func getHTTPRouteGroupDetail(httpRouteGroup *smispecsv1alpha4.HTTPRouteGroup, client client.Interface) *HTTPRouteGroupDetail {
	meshName := ""
	deployment, err := client.AppsV1().Deployments(httpRouteGroup.ObjectMeta.Namespace).Get(context.TODO(), "osm-controller", metaV1.GetOptions{})
	if err == nil {
		meshName = deployment.ObjectMeta.Labels["meshName"]
	}

	return &HTTPRouteGroupDetail{
		ObjectMeta: api.NewObjectMeta(httpRouteGroup.ObjectMeta),
		TypeMeta:   api.NewTypeMeta(api.ResourceKindHTTPRouteGroup),
		Spec:       httpRouteGroup.Spec,
		MeshName:   meshName,
	}
}

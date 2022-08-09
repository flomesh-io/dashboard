package tcproute

import (
	"log"

	smispecsv1alpha4 "github.com/servicemeshinterface/smi-sdk-go/pkg/apis/specs/v1alpha4"
	smispecsclientset "github.com/servicemeshinterface/smi-sdk-go/pkg/gen/client/specs/clientset/versioned"

	"github.com/kubernetes/dashboard/src/app/backend/api"
	"github.com/kubernetes/dashboard/src/app/backend/errors"
	"github.com/kubernetes/dashboard/src/app/backend/resource/common"
	"github.com/kubernetes/dashboard/src/app/backend/resource/dataselect"
)

// TCPRoute is a representation of a httpgroup.
type TCPRoute struct {
	ObjectMeta api.ObjectMeta `json:"objectMeta"`
	TypeMeta   api.TypeMeta   `json:"typeMeta"`
}

// TCPRouteList contains a list of services in the cluster.
type TCPRouteList struct {
	ListMeta api.ListMeta `json:"listMeta"`

	// Unordered list of tcpRoutes.
	TCPRoutes []TCPRoute `json:"tcpRoutes"`

	// List of non-critical errors, that occurred during resource retrieval.
	Errors []error `json:"errors"`
}

// GetServiceList returns a list of all services in the cluster.
func GetTCPRouteList(smiSpecsClient smispecsclientset.Interface, nsQuery *common.NamespaceQuery,
	dsQuery *dataselect.DataSelectQuery) (*TCPRouteList, error) {
	log.Print("Getting list of all http route group in the cluster")

	channels := &common.ResourceChannels{
		TCPRouteList: common.GetTCPRouteListChannel(smiSpecsClient, nsQuery, 1),
	}

	return GetTCPRouteListFromChannels(channels, dsQuery)
}

// GetTCPRouteListFromChannels returns a list of all services in the cluster.
func GetTCPRouteListFromChannels(channels *common.ResourceChannels,
	dsQuery *dataselect.DataSelectQuery) (*TCPRouteList, error) {
	tcpRoutes := <-channels.TCPRouteList.List
	err := <-channels.TCPRouteList.Error
	nonCriticalErrors, criticalError := errors.HandleError(err)
	if criticalError != nil {
		return nil, criticalError
	}

	return CreateTCPRouteList(tcpRoutes.Items, nonCriticalErrors, dsQuery), nil
}

func toTCPRoute(tcpRoute *smispecsv1alpha4.TCPRoute) TCPRoute {
	return TCPRoute{
		ObjectMeta: api.NewObjectMeta(tcpRoute.ObjectMeta),
		TypeMeta:   api.NewTypeMeta(api.ResourceKindTCPRoute),
	}
}

// CreateTCPRouteList returns paginated httpgroup list based on given httpgroup array and pagination query.
func CreateTCPRouteList(tcpRoutes []smispecsv1alpha4.TCPRoute, nonCriticalErrors []error, dsQuery *dataselect.DataSelectQuery) *TCPRouteList {
	tcpRoutesList := &TCPRouteList{
		TCPRoutes: make([]TCPRoute, 0),
		ListMeta:        api.ListMeta{TotalItems: len(tcpRoutes)},
		Errors:          nonCriticalErrors,
	}

	tcpRouteCells, filteredTotal := dataselect.GenericDataSelectWithFilter(toCells(tcpRoutes), dsQuery)
	tcpRoutes = fromCells(tcpRouteCells)
	tcpRoutesList.ListMeta = api.ListMeta{TotalItems: filteredTotal}

	for _, tcpRoute := range tcpRoutes {
		tcpRoutesList.TCPRoutes = append(tcpRoutesList.TCPRoutes, toTCPRoute(&tcpRoute))
	}

	return tcpRoutesList
}

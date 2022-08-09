package httproutegroup

import (
	"log"

	smispecsv1alpha4 "github.com/servicemeshinterface/smi-sdk-go/pkg/apis/specs/v1alpha4"
	smispecsclientset "github.com/servicemeshinterface/smi-sdk-go/pkg/gen/client/specs/clientset/versioned"

	"github.com/kubernetes/dashboard/src/app/backend/api"
	"github.com/kubernetes/dashboard/src/app/backend/errors"
	"github.com/kubernetes/dashboard/src/app/backend/resource/common"
	"github.com/kubernetes/dashboard/src/app/backend/resource/dataselect"
)

// HTTPRouteGroup is a representation of a httpgroup.
type HTTPRouteGroup struct {
	ObjectMeta api.ObjectMeta `json:"objectMeta"`
	TypeMeta   api.TypeMeta   `json:"typeMeta"`
}

// HTTPRouteGroupList contains a list of services in the cluster.
type HTTPRouteGroupList struct {
	ListMeta api.ListMeta `json:"listMeta"`

	// Unordered list of httpRouteGroups.
	HTTPRouteGroups []HTTPRouteGroup `json:"httpRouteGroups"`

	// List of non-critical errors, that occurred during resource retrieval.
	Errors []error `json:"errors"`
}

// GetServiceList returns a list of all services in the cluster.
func GetHTTPRouteGroupList(smiSpecsClient smispecsclientset.Interface, nsQuery *common.NamespaceQuery,
	dsQuery *dataselect.DataSelectQuery) (*HTTPRouteGroupList, error) {
	log.Print("Getting list of all http route group in the cluster")

	channels := &common.ResourceChannels{
		HTTPRouteGroupList: common.GetHTTPRouteGroupListChannel(smiSpecsClient, nsQuery, 1),
	}

	return GetHTTPRouteGroupListFromChannels(channels, dsQuery)
}

// GetHTTPRouteGroupListFromChannels returns a list of all services in the cluster.
func GetHTTPRouteGroupListFromChannels(channels *common.ResourceChannels,
	dsQuery *dataselect.DataSelectQuery) (*HTTPRouteGroupList, error) {
	httpRouteGroups := <-channels.HTTPRouteGroupList.List
	err := <-channels.HTTPRouteGroupList.Error
	nonCriticalErrors, criticalError := errors.HandleError(err)
	if criticalError != nil {
		return nil, criticalError
	}

	return CreateHTTPRouteGroupList(httpRouteGroups.Items, nonCriticalErrors, dsQuery), nil
}

func toHTTPRouteGroup(httpRouteGroup *smispecsv1alpha4.HTTPRouteGroup) HTTPRouteGroup {
	return HTTPRouteGroup{
		ObjectMeta: api.NewObjectMeta(httpRouteGroup.ObjectMeta),
		TypeMeta:   api.NewTypeMeta(api.ResourceKindHTTPRouteGroup),
	}
}

// CreateHTTPRouteGroupList returns paginated httpgroup list based on given httpgroup array and pagination query.
func CreateHTTPRouteGroupList(httpRouteGroups []smispecsv1alpha4.HTTPRouteGroup, nonCriticalErrors []error, dsQuery *dataselect.DataSelectQuery) *HTTPRouteGroupList {
	httpRouteGroupsList := &HTTPRouteGroupList{
		HTTPRouteGroups: make([]HTTPRouteGroup, 0),
		ListMeta:        api.ListMeta{TotalItems: len(httpRouteGroups)},
		Errors:          nonCriticalErrors,
	}

	httpRouteGroupCells, filteredTotal := dataselect.GenericDataSelectWithFilter(toCells(httpRouteGroups), dsQuery)
	httpRouteGroups = fromCells(httpRouteGroupCells)
	httpRouteGroupsList.ListMeta = api.ListMeta{TotalItems: filteredTotal}

	for _, httpRouteGroup := range httpRouteGroups {
		httpRouteGroupsList.HTTPRouteGroups = append(httpRouteGroupsList.HTTPRouteGroups, toHTTPRouteGroup(&httpRouteGroup))
	}

	return httpRouteGroupsList
}

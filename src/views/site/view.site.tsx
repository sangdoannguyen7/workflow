import {Button, Empty, Layout, notification, Tooltip} from 'antd';
import {useRef, useState} from "react";
import {
    ActionType,
    ModalForm,
    ProColumns, ProForm, ProFormSelect, ProFormText, ProFormTextArea, ProFormUploadButton,
    ProTable
} from "@ant-design/pro-components";
import {
    DownOutlined,
    EditOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    UpOutlined,
} from "@ant-design/icons";
import StatusLabel from "../../shared/components/label/status.label.component.tsx";
import {INotification} from "../../interface/notification.interface.ts";
import {EStatusType, MStatusType} from "../../common/common.status.type.ts";
import {
    IPermissionRequest,
    IPermissionResponse,
} from "../../apis/permisison/api.permission.interface.ts";
import {updatePermission} from "../../apis/permisison/api.permission.ts";
import {ISiteRequest, ISiteSearchCriteria} from "../../apis/site/api.site.interface.ts";
import {createSite, getSites} from "../../apis/site/api.site.ts";

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const SitePage = () => {
    const actionRef = useRef<ActionType>();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    const successNotification = (placement: INotification) => {
        api.success({
            message: 'Thông báo',
            description: placement.description
        });
    };

    const errorNotification = (placement: INotification) => {
        api.error({
            message: 'Thông báo',
            description: placement.description
        });
    };

    const userColumns: ProColumns[] = [
        {
            title:'STT',
            align: 'center',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title:'ID',
            key: 'siteId',
            align: 'center',
            dataIndex: 'siteId',
            hideInTable: true,
            hideInSearch: true
        },
        {
            align: 'center',
            dataIndex: 'avatar',
            valueType: 'avatar',
            hideInSearch: true
        },
        {
            title: 'Tìm kiếm',
            align: 'center',
            dataIndex: 'search',
            fieldProps: {
                name: 'Tìm kiếm',
                placeholder: 'Nhập nội dung tìm kiếm ...',
            },
            hideInTable: true
        },
        {
            title: 'Mã địa danh',
            align: 'center',
            dataIndex: 'siteCode',
            hideInSearch: true,
        },
        {
            title: 'Tên địa danh',
            align: 'center',
            dataIndex: 'siteName',
            hideInSearch: true,
        },
        {
            title: 'Địa chỉ',
            align: 'center',
            dataIndex: 'address',
            hideInSearch: true,
        },
        {
            title: 'Trạng thái',
            align: 'center',
            dataIndex: 'statusType',
            valueType: 'text',
            hideInSearch: true,
            render: (_, row: IPermissionResponse) => {
                return (<StatusLabel code={row.statusType} name={MStatusType[row.statusType]}/>)
            }
        },
        {
            title: 'Trạng thái',
            align: 'center',
            dataIndex: 'statuses',
            hideInTable: true,
            fieldProps: {
                placeholder: 'Trạng thái',
            },
            valueEnum: EStatusType,
        },
        {
            title: 'Thao tác',
            align: 'center',
            dataIndex: 'action',
            hideInSearch: true,
            render: (_, row: IPermissionResponse) => {
                return(
                    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                        {modalDetail(row)}
                        {modalUpdate(row)}
                    </div>
                );
            },
            fieldProps: {
                name: 'Thao tác'
            }
        },
    ];

    const modalCreate = () => {
        return (
            <ModalForm<ISiteRequest>
                title='Thêm mới địa danh'
                trigger={
                    <Button type="primary">
                        <PlusOutlined />
                        Thêm mới
                    </Button>
                }
                autoFocusFirstInput
                modalProps={{
                    destroyOnClose: true,
                }}
                submitter={{
                    searchConfig: {
                        submitText: 'Thêm mới',
                    },
                }}
                // submitTimeout={1000}
                onFinish={async (site) => {
                    await waitTime(1000);
                    console.log(site);
                    return  createSite(site)
                        .then(() => {
                            successNotification({
                                message: 'Thông báo',
                                description: 'Tạo mới thành công.'
                            });
                            actionRef?.current?.reload();
                            return true;
                        })
                        .catch(err => {
                            errorNotification({
                                message: 'Thông báo',
                                description: err.response.data.message
                            });
                            return false;
                        });
                }}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="siteCode"
                        label="Mã địa danh"
                        placeholder="Nhập mã địa danh"
                    />
                    <ProFormText
                        width="md"
                        name="siteName"
                        label="Tên địa danh"
                        placeholder="Nhập tên địa danh"
                    />
                    <ProFormText
                        width="lg"
                        name="address"
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                    />
                    <ProFormSelect
                        width="sm"
                        options={[
                            {
                                value: 'ACTIVE',
                                label: 'Kích hoạt',
                            },
                            {
                                value: 'INACTIVE',
                                label: 'Chưa kích hoạt',
                            },
                        ]}
                        name="statusType"
                        label="Trạng thái"
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormUploadButton
                        title='Chọn ảnh'
                        name="avatar"
                        label="Hình đại diện"
                        max={1}
                        accept=".jpg,.jpeg,.png,"
                        // fieldProps={{
                        //     name: 'image',
                        //     listType: 'picture-card',
                        // }}
                        listType='picture-card'
                        action="/upload.do"
                        // extra="longgggggggggggggggggggggggggggggggggg"
                    />
                    <ProFormTextArea
                        width="xl"
                        name="description"
                        label="Mô tả"
                        placeholder="Nhập mô tả"
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormUploadButton
                        title='Chọn ảnh/video'
                        name="media"
                        label="Danh sách ảnh/video"
                        max={6}
                        accept=".jpg,.jpeg,.png,.mp4,"
                        fieldProps={{
                            listType: 'picture-card',
                        }}
                        action="/upload.do"
                        // extra="longgggggggggggggggggggggggggggggggggg"
                    />
                </ProForm.Group>
            </ModalForm>
        );
    }

    const modalDetail = (permission: IPermissionResponse) => {
        return (
            <ModalForm<IPermissionResponse>
                // readonly
                disabled
                title='Thông tin chi tiết'
                trigger={
                    <Tooltip title='Thông tin chi tiết'>
                        <Button type="primary">
                            <InfoCircleOutlined/>
                        </Button>
                    </Tooltip>
                }
                submitter={false}
                modalProps={{
                    destroyOnClose: true,
                }}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="permissionCode"
                        label="Mã địa danh"
                        placeholder="Nhập mã địa danh"
                        initialValue={permission.permissionCode}
                    />
                    <ProFormText
                        width="md"
                        name="permissionName"
                        label="Tên địa danh"
                        placeholder="Nhập tên địa danh"
                        initialValue={permission.permissionName}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        width="md"
                        options={[
                            {
                                value: 'CREATE',
                                label: 'Thêm mới',
                            },
                            {
                                value: 'READ',
                                label: 'Xem',
                            },
                            {
                                value: 'UPDATE',
                                label: 'Cập nhật',
                            },
                            {
                                value: 'DELETE',
                                label: 'Xóa',
                            },
                        ]}
                        name="actionType"
                        label="Hành động"
                        initialValue={permission.actionType}
                    />
                    <ProFormSelect
                        width="md"
                        options={[
                            {
                                value: 'ACTIVE',
                                label: 'Kích hoạt',
                            },
                            {
                                value: 'INACTIVE',
                                label: 'Chưa kích hoạt',
                            },
                        ]}
                        name="statusType"
                        label="Trạng thái"
                        initialValue={permission.statusType}
                    />
                </ProForm.Group>
            </ModalForm>
        );
    }

    const modalUpdate = (permission: IPermissionResponse) => {

        return (
            <ModalForm<IPermissionResponse>
                title='Cập nhật thông tin'
                trigger={
                    <Tooltip title='Cập nhật'>
                        <Button type="default">
                            <EditOutlined />
                        </Button>
                    </Tooltip>
                }
                modalProps={{
                    destroyOnClose: true,
                }}
                submitter={{
                    searchConfig: {
                        submitText: 'Cập nhật',
                    },
                }}
                onFinish={async (value) => {
                    await waitTime(1000);
                    return  updatePermission(value as IPermissionRequest)
                        .then(() => {
                            successNotification({
                                message: 'Thông báo',
                                description: 'Cập nhật thành công.'
                            });
                            actionRef?.current?.reload();
                            return true;
                        })
                        .catch(err => {
                            errorNotification({
                                message: 'Thông báo',
                                description: err.response.data.message
                            });
                            return false;
                        });
                }}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="permissionCode"
                        label="Mã địa danh"
                        placeholder="Nhập mã địa danh"
                        initialValue={permission.permissionCode}
                        disabled
                    />
                    <ProFormText
                        width="md"
                        name="permissionName"
                        label="Tên địa danh"
                        placeholder="Nhập tên địa danh"
                        initialValue={permission.permissionName}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        width="md"
                        options={[
                            {
                                value: 'CREATE',
                                label: 'Thêm mới',
                            },
                            {
                                value: 'READ',
                                label: 'Xem',
                            },
                            {
                                value: 'UPDATE',
                                label: 'Cập nhật',
                            },
                            {
                                value: 'DELETE',
                                label: 'Xóa',
                            },
                        ]}
                        name="actionType"
                        label="Hành động"
                        initialValue={permission.actionType}
                    />
                    <ProFormSelect
                        width="md"
                        options={[
                            {
                                value: 'ACTIVE',
                                label: 'Kích hoạt',
                            },
                            {
                                value: 'INACTIVE',
                                label: 'Chưa kích hoạt',
                            },
                        ]}
                        name="statusType"
                        label="Trạng thái"
                        initialValue={permission.statusType}
                    />
                </ProForm.Group>
                <ProFormText
                    width="md"
                    name="permissionId"
                    initialValue={permission.permissionId}
                    hidden
                />
            </ModalForm>
        );
    }

    return (
        <Layout.Content
            style={{
                padding: 12,
                borderRadius: 8
            }}
        >
            {contextHolder}
            <ProTable
                columns={userColumns}
                actionRef={actionRef}
                cardBordered
                editable={{
                    type: 'multiple',
                }}
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                }}
                request={async params => {
                    const { search, statuses } = params;
                    const searchCriteria: ISiteSearchCriteria = {
                        search: search,
                        statuses: statuses,
                    }
                    return getSites(searchCriteria);
                }}
                // rowKey="order-admin-id"
                rowKey={() => Math.random()}
                search={{
                    labelWidth: 'auto',
                    searchText: 'Tìm kiếm',
                    resetText: 'Làm lại',
                    collapseRender: () => ((
                            <Button type='link'
                                    icon={isCollapsed ? <DownOutlined/> : <UpOutlined/>}
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                            >
                                {isCollapsed ? 'Mở rộng': 'Thu gọn'}
                            </Button>)
                    ),
                }}
                options={{
                    setting: false,
                    densityIcon: false,
                    reload: false,
                    fullScreen: true,
                }}
                expandable={{
                    expandRowByClick: true,
                    showExpandColumn: true,
                }}
                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu'/>
                }}
                pagination={{
                    showSizeChanger: true,
                    defaultCurrent: 1,
                    defaultPageSize: 10,
                    pageSizeOptions: [1, 10, 20, 50],
                    // current: 1,
                    // total: total,
                    showTitle: false,
                    locale: {
                        items_per_page: 'đơn / trang'
                    },
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total} đơn`,
                }}
                rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                dateFormatter="string"
                // headerTitle="Đơn đặt phòng"
                toolBarRender={() => [
                    modalCreate(),
                ]}
            />
        </Layout.Content>
    )
}

export default SitePage;
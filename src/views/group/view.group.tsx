import {
    Button, Col,
    Empty,
    Layout, Modal,
    notification, Row,
    Tooltip, Transfer, TransferProps,
} from 'antd';
import {useEffect, useRef, useState} from "react";
import {
    ActionType,
    ModalForm,
    ProColumns, ProFormSelect, ProFormText,
    ProTable
} from "@ant-design/pro-components";
import {DownOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, UpOutlined, UnorderedListOutlined} from "@ant-design/icons";
import StatusLabel from "../../shared/components/label/status.label.component.tsx";
import {INotification} from "../../interface/notification.interface.ts";
import {EStatusType, MStatusType} from "../../common/common.status.type.ts";
import {createGroup, getGroups, updateGroup} from "../../apis/group/api.group.ts";
import {IGroupRequest, IGroupResponse, IGroupSearchCriteria} from "../../apis/group/api.group.interface.ts";
import {IPermissionResponse, IPermissionSearchCriteria} from "../../apis/permisison/api.permission.interface.ts";
import {getPermissions} from "../../apis/permisison/api.permission.ts";
import {MActionType} from "../../common/common.action.type.ts";
import ActionLabel from "../../shared/components/label/action.label.component.tsx";
import {getPermissionGroup, updatePermissionGroup} from "../../apis/group/permission/api.permission.group.ts";
import {
    IPermissionGroupRequest,
    IPermissionGroupSearchCriteria, permissionGroupRequestInit
} from "../../apis/group/permission/api.permission.group.interface.ts";

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const GroupPage = () => {
    const actionRef = useRef<ActionType>();
    const [isCollapsed, setIsCollapsed] = useState(true);
    // const [form] = Form.useForm<{ name: string; company: string }>();
    const [api, contextHolder] = notification.useNotification();
    const [isOpenModalPermission, setIsOpenModalPermission] = useState(false);
    const [transferPermission, setTransferPermission] = useState<IPermissionResponse[]>([]);
    const [transferTarget, setTransferTarget] = useState<IPermissionGroupRequest>(permissionGroupRequestInit);
    const [transferSelected, setTransferSelected] = useState<string[]>([]);

    const onOpenModalPermission = async (group: IGroupResponse) => {
        const searchCriteria: IPermissionGroupSearchCriteria = {
            groupId: group.groupId
        }
        const permissionGroups = await getPermissionGroup(searchCriteria)
        const newTransferTarget: IPermissionGroupRequest = {
            groupId: group.groupId,
            permissionCodes: permissionGroups.data.map(permissionGroup => permissionGroup.permissionCode)
        }
        setTransferTarget(newTransferTarget);
        setIsOpenModalPermission(true);
    }

    const onOkModalPermission = async () => {
        await updatePermissionGroup(transferTarget)
            .then(() => {
                successNotification({
                    message: '',
                    description: 'Cập nhật thành công'
                })
                setIsOpenModalPermission(false);
            })
            .catch(err => {
                errorNotification({
                    message: '',
                    description: err.response.data.message
                })
            })
    }

    const onChangeTransfer: TransferProps<IPermissionResponse>['onChange'] = (newTargetKeys, direction, moveKeys) => {
        setTransferTarget({...transferTarget, permissionCodes: newTargetKeys});

        console.log('targetKeys: ', newTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };

    const onSelectChangeTransfer: TransferProps<IPermissionResponse>['onSelectChange'] = (
        sourceSelectedKeys,
        targetSelectedKeys,
    ) => {
        setTransferSelected([...sourceSelectedKeys, ...targetSelectedKeys]);

        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };

    const onScroll: TransferProps<IPermissionResponse>['onScroll'] = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };

    useEffect( () => {
        const fetchPermissions = async () => {
            const searchCriteria: IPermissionSearchCriteria = {
                search: '',
                statuses: '',
                actions: ''
            }
            const permissions = await getPermissions(searchCriteria);
            setTransferPermission(permissions.data);
        }

        fetchPermissions().catch(err => {
            errorNotification({
                message: '',
                description: err.response.data.message
            })
        });
    }, [isOpenModalPermission])

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
            key: 'groupId',
            align: 'center',
            dataIndex: 'groupId',
            hideInTable: true,
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
            title: 'Mã nhóm',
            align: 'center',
            dataIndex: 'groupCode',
            hideInSearch: true,
        },
        {
            title: 'Tên nhóm',
            align: 'center',
            dataIndex: 'groupName',
            hideInSearch: true,
        },
        {
            title: 'Trạng thái',
            align: 'center',
            dataIndex: 'statusType',
            valueType: 'text',
            hideInSearch: true,
            render: (_, row: IGroupResponse) => {
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
            render: (_, row: IGroupResponse) => {
                return(
                    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                        {modalDetail(row)}
                        {modalUpdate(row)}
                        <Tooltip title='Danh sách quyền'>
                            <Button type="dashed" danger onClick={() => onOpenModalPermission(row)}>
                                <UnorderedListOutlined />
                            </Button>
                        </Tooltip>
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
            <ModalForm<{
                groupCode: string,
                groupName: string,
                statusType: string,
            }>
                title='Thêm mới Nhóm'
                trigger={
                    <Button type="primary">
                        <PlusOutlined />
                        Thêm mới
                    </Button>
                }
                // form={form}
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
                onFinish={async (value) => {
                    await waitTime(1000);
                    return  createGroup(value as IGroupRequest)
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
                <ProFormText
                    width="md"
                    name="groupCode"
                    label="Mã nhóm"
                    placeholder="Nhập mã nhóm"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mã nhóm',
                        }
                    ]}
                />
                <ProFormText
                    width="md"
                    name="groupName"
                    label="Tên nhóm"
                    placeholder="Nhập tên nhóm"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên nhóm',
                        }
                    ]}
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
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn trạng thái',
                        }
                    ]}
                />
            </ModalForm>
        );
    }

    const modalDetail = (group: IGroupResponse) => {
        return (
            <ModalForm<IGroupResponse>
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
                <ProFormText
                    width="md"
                    name="groupCode"
                    label="Mã nhóm"
                    initialValue={group.groupCode}
                    placeholder="Nhập mã nhóm"
                />
                <ProFormText
                    width="md"
                    name="groupName"
                    label="Tên nhóm"
                    initialValue={group.groupName}
                    placeholder="Nhập tên nhóm"
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
                    initialValue={group.statusType}
                />
            </ModalForm>
        );
    }

    const modalUpdate = (group: IGroupResponse) => {
        return (
            <ModalForm<IGroupResponse>
                title='Cập nhật thông tin'
                trigger={
                    <Tooltip title='Cập nhật'>
                        <Button type="default">
                            <EditOutlined />
                        </Button>
                    </Tooltip>
                }
                // form={user}
                // autoFocusFirstInput
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
                    return  updateGroup(value as IGroupRequest)
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
                <ProFormText
                    width="md"
                    name="groupId"
                    initialValue={group.groupId}
                    hidden
                />
                <ProFormText
                    width="md"
                    name="groupCode"
                    label="Mã nhóm"
                    initialValue={group.groupCode}
                    placeholder="Nhập mã nhóm"
                    disabled
                />
                <ProFormText
                    width="md"
                    name="groupName"
                    label="Tên nhóm"
                    initialValue={group.groupName}
                    placeholder="Nhập tên nhóm"
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
                    initialValue={group.statusType}
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
                    const searchCriteria: IGroupSearchCriteria = {
                        search: search,
                        statuses: statuses,
                    }
                    return getGroups(searchCriteria);
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
                    showTitle: false,
                    locale: {
                        items_per_page: 'đơn / trang'
                    },
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total} đơn`,
                }}
                rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                dateFormatter="string"
                toolBarRender={() => [
                    modalCreate(),
                ]}
            />

            <Modal open={isOpenModalPermission}
                   onCancel={() => setIsOpenModalPermission(false)}
                   onOk={() => onOkModalPermission()}
                   closable={false}
                   width={1200}
                   title='Chỉnh sửa quyền trong nhóm'
            >
                <Transfer<IPermissionResponse>
                    dataSource={transferPermission.map(item => ({ ...item, key: item.permissionCode}))}
                    // showSearch
                    // style={{display: 'flex'}}
                    // titles={['Source', 'Target']}
                    listStyle={{
                        width: 1200,
                        height: 500,
                    }}
                    targetKeys={transferTarget?.permissionCodes}
                    selectedKeys={transferSelected}
                    onChange={onChangeTransfer}
                    onSelectChange={onSelectChangeTransfer}
                    onScroll={onScroll}
                    render={item=> (
                        <Row>
                            <Col span={4}>
                                <ActionLabel code={item.actionType} name={MActionType[item.actionType]}/>
                            </Col>
                            <Col span={10}>{item.permissionCode}</Col>
                            <Col span={10}>{item.permissionName}</Col>
                        </Row>
                    )}
                    // rowKey={item => item.permissionCode}
                />
            </Modal>
        </Layout.Content>
    )
}

export default GroupPage;
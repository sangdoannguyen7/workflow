import {Button, Empty, Layout, notification, Tooltip, Popconfirm, Modal, Transfer, TransferProps} from 'antd';
import {useEffect, useRef, useState} from "react";
import {
    ActionType,
    ModalForm,
    ProColumns, ProForm, ProFormSelect, ProFormText,
    ProTable
} from "@ant-design/pro-components";
import {DownOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, UpOutlined, RetweetOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {createUser, getUsers, resetPassword, updateUser} from "../../apis/user/api.user.ts";
import {IUserRequest, IUserResponse, IUserSearchCriteria} from "../../apis/user/api.user.interface.ts";
import StatusLabel from "../../shared/components/label/status.label.component.tsx";
import {INotification} from "../../interface/notification.interface.ts";
import {EStatusType, MStatusType} from "../../common/common.status.type.ts";
import {EUserType} from "../../common/common.gender.type.ts";
import { IUserGroupRequest, IUserGroupSearchCriteria, userGroupRequestInit } from '../../apis/user/group/api.user.group.interface.ts';
import { getUserGroup, updateUserGroup } from '../../apis/user/group/api.user.group.ts';
import { IGroupResponse, IGroupSearchCriteria } from '../../apis/group/api.group.interface.ts';
import { numberToString, stringToNumber } from '../../utils/parseVariable.ts';
import { getGroups } from '../../apis/group/api.group.ts';

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const UserPage = () => {
    const actionRef = useRef<ActionType>();
    const [isCollapsed, setIsCollapsed] = useState(true);
    // const [form] = Form.useForm<{ name: string; company: string }>();
    const [api, contextHolder] = notification.useNotification();
    const [isOpenModalGroup, setIsOpenModalGroup] = useState(false);
    const [transferGroup, setTransGroup] = useState<IGroupResponse[]>([]);
    const [transferTarget, setTransferTarget] = useState<IUserGroupRequest>(userGroupRequestInit);
    const [transferSelected, setTransferSelected] = useState<string[]>([]);


    const successNotification = (placement: INotification) => {
        api.success({
            message: placement.message,
            description: placement.description
        });
    };

    const errorNotification = (placement: INotification) => {
        api.error({
            message: placement.message,
            description: placement.description
        });
    };

    const onOpenModalGroup = async (user: IUserResponse) => {
        const searchCriteria: IUserGroupSearchCriteria = {
            userId: user.userId,
            groupName: ''
        }
        const userGroups = await getUserGroup(searchCriteria)
        const newTransferTarget: IUserGroupRequest = {
            userId: user.userId,
            groupIds: userGroups.data.map(userGroup => userGroup.groupId)
        }
        console.log("user group", userGroups);
        setTransferTarget(newTransferTarget);
        setIsOpenModalGroup(true);
    }

    const onOkModalPermission = async () => {
        await updateUserGroup(transferTarget)
            .then(() => {
                successNotification({
                    message: '',
                    description: 'Cập nhật thành công'
                })
                setIsOpenModalGroup(false);
            })
            .catch(err => {
                errorNotification({
                    message: '',
                    description: err.response.data.message
                })
            })
    }

    const onChangeTransfer: TransferProps<IGroupResponse>['onChange'] = (newTargetKeys, direction, moveKeys) => {
        setTransferTarget({...transferTarget, groupIds: newTargetKeys.map(groupId => stringToNumber(groupId))});

        console.log('targetKeys: ', newTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };

    const onSelectChangeTransfer: TransferProps<IGroupResponse>['onSelectChange'] = (
        sourceSelectedKeys,
        targetSelectedKeys,
    ) => {
        setTransferSelected([...sourceSelectedKeys, ...targetSelectedKeys]);

        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };

    const onScroll: TransferProps<IGroupResponse>['onScroll'] = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };

    useEffect( () => {
        const fetchGroups = async () => {
            const searchCriteria: IGroupSearchCriteria = {
                search: '',
                statuses: ''
            }
            const groups = await getGroups(searchCriteria);
            setTransGroup(groups.data);
        }

        fetchGroups().catch(err => {
            errorNotification({
                message: '',
                description: err.response.data.message
            })
        });
    }, [isOpenModalGroup])

    const userColumns: ProColumns[] = [
        {
            title:'STT',
            align: 'center',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title:'ID',
            key: 'hotelId',
            align: 'center',
            dataIndex: 'hotelId',
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
            title: 'Tên tài khoản',
            align: 'center',
            dataIndex: 'username',
            hideInSearch: true,
        },
        {
            title: 'Tên',
            align: 'center',
            dataIndex: 'name',
            hideInSearch: true,
        },
        {
            title: 'Email',
            align: 'center',
            dataIndex: 'email',
            hideInSearch: true
        },
        {
            title: 'SĐT',
            align: 'center',
            dataIndex: 'phone',
            valueType: 'text',
            hideInSearch: true,
        },
        // {
        //     dataIndex: 'statusType',
        //     valueType: 'select',
        //     fieldProps: {
        //         placeholder: 'Trạng thái',
        //         // defaultValue: EBookingStatus.PENDING,
        //         mode: 'multiple',
        //     },
        //     valueEnum: EStatusType,
        //     render: (_, row) => {
        //         return <Switch checked={row.status}/>;
        //     },
        // },
        {
            title: 'Trạng thái',
            align: 'center',
            dataIndex: 'statusType',
            valueType: 'text',
            hideInSearch: true,
            render: (_, row: IUserResponse) => {
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
                // defaultValue: EBookingStatus.PENDING,
                // mode: 'multiple',
            },
            valueEnum: EStatusType,
        },
        {
            title: 'Loại tài khoản',
            align: 'center',
            dataIndex: 'types',
            hideInTable: true,
            fieldProps: {
                placeholder: 'Loại tài khoản',
                // defaultValue: EBookingStatus.PENDING,
                // mode: 'multiple',
            },
            valueEnum: EUserType,
        },
        {
            title: 'Thao tác',
            align: 'center',
            dataIndex: 'action',
            hideInSearch: true,
            render: (_, row: IUserResponse) => {
                return(
                    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                        {/*<Button style={{marginRight: 8}}*/}
                        {/*        type='primary'*/}
                        {/*        icon={<InfoCircleOutlined />}*/}
                        {/*        onClick={() => console.log("onClick")} >*/}
                        {/*    Chi tiết*/}
                        {/*</Button>*/}
                        {modalDetail(row)}
                        {modalUpdate(row)}
                        {modalResetPassword(row)}
                        <Tooltip title='Danh sách nhóm'>
                            <Button type="default" danger onClick={() => onOpenModalGroup(row)}>
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
            <ModalForm<IUserRequest>
                title='Thêm mới tài khoản'
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
                onFinish={async (user) => {
                    await waitTime(1000);
                    return  createUser(user)
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
                        name="username"
                        label="Tên tài khoản"
                        // tooltip="Tên tài kho"
                        placeholder="Nhập tên tài khoản"
                    />
                    <ProFormText
                        width="md"
                        name="password"
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        fieldProps={{
                            type: 'password'
                        }}
                    />
                    <ProFormText
                        width="md"
                        name="name"
                        label="Họ tên"
                        placeholder="Nhập họ tên"
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="email"
                        label="Email"
                        placeholder="Nhập email"
                    />
                    <ProFormText
                        width="md"
                        name="phone"
                        label="Số điện thoại"
                        placeholder="Nhập Số điện thoại"
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        width="md"
                        options={[
                            {
                                value: 'MALE',
                                label: 'Nữ',
                            },
                            {
                                value: 'FEMALE',
                                label: 'Nam',
                            },
                        ]}
                        name="gender"
                        label="Giới tính"
                        // onChange={(value) => {
                        //     form.setFieldValue("genderCode", value);
                        // }}
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
                        // onChange={(value) => {
                        //     form.setFieldValue("statusCode", value);
                        // }}
                    />
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="genderName"
                            hidden
                        />
                        <ProFormText
                            width="md"
                            name="statusName"
                            hidden
                        />
                    </ProForm.Group>
                </ProForm.Group>
            </ModalForm>
        );
    }

    const modalDetail = (user: IUserResponse) => {
        return (
            <ModalForm<IUserResponse>
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
                        name="username"
                        label="Tên tài khoản"
                        initialValue={user.username}
                        // tooltip="Tên tài kho"
                        placeholder="Nhập tên tài khoản"
                    />
                    <ProFormText
                        width="md"
                        name="name"
                        label="Họ tên"
                        initialValue={user.name}
                        placeholder="Nhập họ tên"
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="email"
                        label="Email"
                        initialValue={user.email}
                        placeholder="Nhập email"
                    />
                    <ProFormText
                        width="md"
                        name="phone"
                        label="Số điện thoại"
                        initialValue={user.phone}
                        placeholder="Nhập Số điện thoại"
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        width="md"
                        options={[
                            {
                                value: 'MALE',
                                label: 'Nữ',
                            },
                            {
                                value: 'FEMALE',
                                label: 'Nam',
                            },
                        ]}
                        name="gender"
                        label="Giới tính"
                        initialValue={user.gender}
                        // onChange={(value) => {
                        //     form.setFieldValue("genderCode", value);
                        // }}
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
                        initialValue={user.statusType}
                        // onChange={(value) => {
                        //     form.setFieldValue("statusCode", value);
                        // }}
                    />
                </ProForm.Group>
            </ModalForm>
        );
    }

    const modalUpdate = (user: IUserResponse) => {
        return (
            <ModalForm<IUserResponse>
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
                    return  updateUser(value as IUserRequest)
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
                        name="username"
                        label="Tên tài khoản"
                        initialValue={user.username}
                        placeholder="Nhập tên tài khoản"
                        disabled
                    />
                    <ProFormText
                        width="md"
                        name="name"
                        label="Họ tên"
                        initialValue={user.name}
                        placeholder="Nhập họ tên"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập họ tên',
                            }
                        ]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="email"
                        label="Email"
                        initialValue={user.email}
                        placeholder="Nhập email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email',
                            },
                            {
                                type: 'email',
                                message: 'Email không hợp lệ',
                            },
                        ]}
                    />
                    <ProFormText
                        width="md"
                        name="phone"
                        label="Số điện thoại"
                        initialValue={user.phone}
                        placeholder="Nhập Số điện thoại"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại',
                            },
                            {
                                type: 'regexp',
                                message: 'số điện thoại không hợp lệ',
                            },
                        ]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        width="md"
                        options={[
                            {
                                value: 'MALE',
                                label: 'Nữ',
                            },
                            {
                                value: 'FEMALE',
                                label: 'Nam',
                            },
                        ]}
                        name="gender"
                        label="Giới tính"
                        initialValue={user.gender}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn giới tính',
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
                        initialValue={user.statusType}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn Trạng thái',
                            }
                        ]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        width="md"
                        name="userId"
                        initialValue={user.userId}
                        hidden
                    />
                </ProForm.Group>
            </ModalForm>
        );
    }

    const modalResetPassword = (user: IUserResponse) => {
        return (
            <Tooltip title='Đặt lại mật khẩu'>
                <Popconfirm
                    title="Đặt lại mật khẩu"
                    description="Bạn có muốn đặt lại mật khẩu ?"
                    okText="Đồng ý"
                    cancelText="Hủy"
                    onConfirm={() => {
                        resetPassword(user.userId)
                            .then(() => {
                                successNotification({
                                    message: 'Thông báo',
                                    description: 'Đặt lại mật khẩu thành công'
                                });
                            })
                            .catch(err => {
                                errorNotification({
                                    message: 'Thông báo',
                                    description: err.response.data.message
                                });
                            });
                    }}
                >
                    <Button type='dashed' danger>
                        <RetweetOutlined/>
                    </Button>
                </Popconfirm>
            </Tooltip>
        );
    }

    return (
        <Layout.Content
            style={{
                padding: 12,
                borderRadius: 8,
                // backgroundColor: '#f5f5f5'
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
                    // onChange(value) {
                    //   console.log('value: ', value);
                    // },
                }}
                request={async params => {
                    const { search, statuses, types } = params;
                    const searchCriteria: IUserSearchCriteria = {
                        search: search,
                        statuses: statuses,
                        types: types
                    }
                    return getUsers(searchCriteria);
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
                // form={{
                //     syncToUrl: (values, type) => {
                //         if (type === 'get') {
                //             return {
                //                 ...values,
                //                 created_at: [values.startTime, values.endTime],
                //             };
                //         }
                //         return values;
                //     },
                // }}
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
                    // onChange={(pagination, filters, sorter) => {
                    //   setSorter([sorter]);
                    // }}
                }}
                rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                dateFormatter="string"
                // headerTitle="Đơn đặt phòng"
                toolBarRender={() => [
                    // <Button
                    //     key="button"
                    //     icon={<PlusOutlined />}
                    //     onClick={() => {
                    //         actionRef.current?.reload();
                    //         // setIsOpenCreate(true);
                    //     }}
                    //     type="primary"
                    // >
                    //     Thêm mới
                    // </Button>
                    modalCreate(),
                ]}
            />

            <Modal open={isOpenModalGroup}
                   onCancel={() => setIsOpenModalGroup(false)}
                   onOk={() => onOkModalPermission()}
                   closable={false}
                   width={800}
                   title='Chỉnh sửa nhóm tài khoản'
            >
                <Transfer<IGroupResponse>
                    dataSource={transferGroup.map(item => ({ ...item, key: numberToString(item.groupId)}))}
                    showSearch
                    // style={{display: 'flex'}}
                    // titles={['Source', 'Target']}
                    listStyle={{
                        width: 800,
                        height: 500,
                    }}
                    targetKeys={transferTarget?.groupIds.map(numberToString)}
                    selectedKeys={transferSelected}
                    onChange={onChangeTransfer}
                    onSelectChange={onSelectChangeTransfer}
                    onScroll={onScroll}
                    render={(item)=> (
                        // <Row>
                        //     <Col span={4}>{item.groupId}</Col>
                        //     <Col span={8}>{item.groupCode}</Col>
                        //     <Col span={12}>{item.groupName}</Col>
                        // </Row>
                        item.groupName
                    )}
                    // render={(item) => `${item.groupCode}-${item.groupName}`}
                    rowKey={item => numberToString(item.groupId)}
                />
            </Modal>
        </Layout.Content>
    )
}

export default UserPage;
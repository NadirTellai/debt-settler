import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import {Table, Tooltip, Space, Button, Modal, Avatar} from 'antd';
import type {ColumnsType, TablePaginationConfig} from 'antd/es/table';
import type {FilterValue, SorterResult} from 'antd/es/table/interface';
import {participant} from "../../types";
import { deleteParticipant, PaginateParticipants} from "../../services/participants";
import {DeleteFilled, ExclamationCircleFilled, EditFilled} from "@ant-design/icons"
import useCallApi from "../../services/useCallApi";

const { confirm } = Modal;
interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
}



const ParticipantsTable: React.FC<any> = forwardRef((props, ref) => {
    const [data, setData] = useState<participant[]>();
    const [participantToDelete, setParticipantToDelete] = useState<number| null>();
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const {editParticipant, filters} = props
    const [removeParticipant] = useCallApi({
        fetch: deleteParticipant,
        params: participantToDelete,
        callback: (results: [participant[], number]) => {
            fetchData()
        }
    });

    useEffect(()=>{
        if(participantToDelete) {
            removeParticipant()
            setParticipantToDelete(null)
        }
    }, [participantToDelete, removeParticipant])

    const [fetchData, loading] = useCallApi({
        fetch: PaginateParticipants,
        params:{
            limit: Number(tableParams.pagination?.pageSize),
            page: Number(tableParams.pagination?.current),
            order: tableParams.sortOrder,
            field: tableParams.sortField,
            keyword: filters.keyword
        },
        callback: (results: [participant[], number]) => {
            setData(results[0]);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: results[1],
                },
            });
        }
    });

    const refreshTable = () => {
        fetchData()
    };
    useImperativeHandle(ref, () => ({
        refreshTable
    }));


    const columns: ColumnsType<participant> = useMemo(()=>[
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
            responsive: ['xxl','xl','lg']
        },
        {
            title: 'Picture',
            dataIndex: 'avatar',
            align: 'center',
            render: (name, participant) => (
                <Avatar src={participant.avatar} />
            ),
            responsive: ['xxl','xl','lg']
        },
        {
            title: 'Name',
            dataIndex: 'name',
            align: 'center',
            ellipsis: {showTitle: false},
            render: (name, participant) => (
                <Tooltip style={{marginLeft: 5}} placement="topLeft" title={name}>
                    {name}
                </Tooltip>
            ),
            responsive: ['xxl','xl','lg']
        },
        {
            title: 'Participant',
            dataIndex: 'name',
            align: 'center',
            ellipsis: {showTitle: false},
            render: (name, participant) => (
                <div>
                    <Avatar src={participant.avatar} />
                    <div>
                        <Tooltip style={{marginLeft: 5}} placement="topLeft" title={name}>
                            {name}
                        </Tooltip>
                    </div>

                </div>
            ),
            responsive: [ 'xs']
        },
        {
            title: "Settlements number",
            dataIndex: 'settlementsCount',
            align: 'center',
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            key: 'operation',
            align: "center",
            render: (id, participant) => (
                <Space>
                    <Tooltip title="Edit Participant">
                        <Button
                            type="link"
                            shape="circle"
                            icon={<EditFilled style={{color: "gray"}} />}
                            onClick={()=>editParticipant(participant)}
                        />
                    </Tooltip>
                    <Tooltip title="delete">
                        <Button
                            type="link"
                            shape="circle"
                            danger
                            icon={<DeleteFilled />}
                            onClick={() => {
                                confirm({
                                    title: `Delete settlement`,
                                    icon: <ExclamationCircleFilled style={{color: "red"}} />,
                                    content: <div>Are you sure you want to delete the participant <b>{participant.name}</b></div>,
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    async onOk() {
                                        setParticipantToDelete(id)
                                    }
                                });
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ], [editParticipant])

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams), filters]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue>,
        sorter: SorterResult<participant>
    ) => {
        setTableParams({
            pagination,
            sortField: sorter.order ? sorter.column?.dataIndex as string : undefined,
            sortOrder: sorter.order ? sorter.order : undefined
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            // @ts-ignore
            onChange={handleTableChange}
        />
    );
});

export default ParticipantsTable;
import React, {useEffect, useMemo, useState} from 'react';
import {Table, Tooltip, Row, Space, Button, Modal} from 'antd';
import type {ColumnsType, TablePaginationConfig} from 'antd/es/table';
import type {FilterValue, SorterResult} from 'antd/es/table/interface';
import {settlementsListItem, settlementsTableFilters} from "../../types";
import {getSettlementsList, deleteSettlement} from "../../services/settlements";
import {Link} from "react-router-dom";
import {currency} from "../../utils/formatters";
import {UsersIcon, SettlementIcon, TransactionIcon, MoneyIcon} from '../../assests/icons'
import ParticipantsAvatar from './ParticipantsAvatar'
import {DeleteFilled, EditFilled, ExclamationCircleFilled} from "@ant-design/icons"
import useCallApi from "../../services/useCallApi";

const { confirm } = Modal;
interface TableParams {
    pagination?: TablePaginationConfig;
    sort?: string;
    order?: string;
}



const SettlementsTable: React.FC<{ filters: settlementsTableFilters }> = (props) => {
    const [data, setData] = useState<settlementsListItem[]>();
    const [settlementToDelete, setSettlementToDelete] = useState<number | null>();
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });


    const [fetchData, loading] = useCallApi({
        fetch:  getSettlementsList,
        params: {
            pageSize: tableParams.pagination?.pageSize,
            page: tableParams.pagination?.current,
            order: tableParams.order,
            sort: tableParams.sort,
            ...props.filters
        },
        callback(results: any) {
            setData(results[0]);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: results[1],
                },
            });
        }
    })
    const [removeSettlement] = useCallApi({
        fetch:  deleteSettlement,
        params: settlementToDelete,
        callback() {
            fetchData()
        }
    })

    const columns: ColumnsType<settlementsListItem> = useMemo(()=>[
        {
            title: 'ID',
            dataIndex: 'settlement_id',
            align: 'center',
            render: (id) => (
                <Link to={`/settlements/${id}`}>
                    {id}
                </Link>
            ),
            responsive: ['xxl','xl','lg']
        },
        {
            title: () => <Row justify={'center'} align={'middle'}>
                <SettlementIcon size={16}/>
                <div style={{marginLeft: 5}}>Settlement</div>
            </Row>,
            dataIndex: 'title',
            sorter: true,
            align: 'center',
            ellipsis: {showTitle: false},
            render: (name) => (
                <Tooltip placement="topLeft" title={name}>
                    {name}
                </Tooltip>
            )
        },
        {
            title: () => <Row justify={'center'} align={'middle'}>
                <TransactionIcon/>
                <div style={{marginLeft: 5}}>Transactions</div>
            </Row>,
            dataIndex: 'transactions',
            align: 'center',
            sorter: true,
            responsive: ['xxl','xl','lg']
        },
        {
            title: () => <Row justify={'center'} align={'middle'}>
                <MoneyIcon/>
                <div style={{marginLeft: 5}}>Amount</div>
            </Row>,
            dataIndex: 'total',
            align: 'center',
            sorter: true,
            render: (amount) => (
                <div>{currency(amount)}</div>
            ),
            responsive: ['xxl','xl','lg']
        },
        {

            title: () => <Row justify={'center'} align={'middle'}>
                <UsersIcon/>
                <div style={{marginLeft: 5}}>Participants</div>
            </Row>,
            dataIndex: 'participants',
            render: (participants) => <ParticipantsAvatar participants={participants}/>,
            align: 'center',
            responsive: ['xxl','xl','lg']
        },
        {
            title: 'Actions',
            dataIndex: 'settlement_id',
            key: 'operation',
            align: "center",
            render: (id, settlement) => (
                <Space>
                    <Tooltip title="view">
                        <Link to={`/settlements/${id}`}>
                            <Button
                                type="link"
                                shape="circle"
                                icon={<EditFilled style={{color: "gray"}}
                                />}
                            />
                        </Link>
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
                                    content: <div>Are you sure you want to delete <b>{settlement.name}</b> settlement</div>,
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    async onOk() {
                                        setSettlementToDelete(id)
                                    }
                                });
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ], [setSettlementToDelete])

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams), props.filters]);

    useEffect(()=>{
        if(settlementToDelete){
            removeSettlement()
            setSettlementToDelete(null)
        }
    }, [settlementToDelete, removeSettlement])

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue>,
        sorter: SorterResult<settlementsListItem>
    ) => {
        setTableParams({
            pagination,
            sort: sorter.order ? sorter.column?.dataIndex as string : undefined,
            order: sorter.order ? (sorter.order === 'descend'? 'DESC': 'ASC') : undefined
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <Table
            columns={columns}
            rowKey={(record) => record.settlement_id}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            // @ts-ignore
            onChange={handleTableChange}
        />
    );
};

export default SettlementsTable;
import React, {useCallback, useEffect, useState} from 'react';
import Graph from "graphvisor"
import {Button, Col, Divider, Input, InputNumber, message, Row, Spin, Switch, Tabs, Tooltip} from "antd";
import "./styles.css"
import {getParticipants} from "../../services/participants";
import {getSettlement, saveSettlement} from "../../services/settlements";
import ParticipantsSelect from "../../components/ParticipantSelect";
import {currency} from "../../utils/formatters";
import {participant} from "../../types"
import {CloseOutlined, SaveFilled} from "@ant-design/icons";
import {useMessages} from "../../providers/MessagesProvider";
import { useParams } from 'react-router-dom';
import useCallApi from "../../services/useCallApi";
import optimize from "../../utils/transactionsOptimization";
const { TabPane } = Tabs;


function Index(): JSX.Element{

    const [simulation, setSimulation] = useState<any>({nodes: [], links: []})
    const [participantIds, setParticipantIds] = useState<number[]>([]);
    const [participants, setParticipants] = useState<{[key:string]: participant}>({});
    const [debtorId, setDebtorId] = useState<number>(0)
    const [creditorId, setCreditor] = useState<number>(0)
    const [amount, setAmount] = useState<number>(0)
    const [canAddTransaction, setCanAddTransaction] = useState<boolean>(false)
    const [borderedInput, setBorderedInput] = useState<boolean>(false)
    const [activateOptimization, setActivateOptimization] = useState<boolean>(false)
    const [settlement, setSettlement] = useState<any>({
        title: 'Untitled Settlement'
    })
    const { id } = useParams();
    const messageApi = useMessages()
    const addTransaction = ()=>{
        setSimulation({
            nodes: simulation.nodes,
            links: [
                ...simulation.links,
                { source: creditorId, target: debtorId,amount: amount, label: currency(amount)}
            ]
        })
        setDebtorId(0)
        setCreditor(0)
        setAmount(0)
    }
    const removeTransaction = (index: number) =>{
        let newLinks = [...simulation.links]
        newLinks.splice(index, 1)
        setSimulation({nodes: simulation.nodes, links: newLinks})
    }
    function getRemovedParticipants(oldList: any, newList:any) {
        let removedIds: number[] = []
        const newIds = new Set(newList.map((obj:any) => obj.id));
        oldList.forEach((obj:any) => {
            if(!newIds.has(obj.id)) removedIds.push(obj.id)
        })
        return removedIds
    }

    useEffect(()=>{
        if(participantIds.length === 0)
            setParticipants({})
        else getParticipants({ids: participantIds})
            .then(participants=>{
                setParticipants(participants.reduce((acc:{[key:string]: participant}, curr: participant)=>{
                    acc[curr.id] = curr
                    return acc
                }, {}))
            })
    }, [participantIds])
    useEffect(()=>{
        let newNodes = Object.values(participants).map(participant=>({
            id: participant.id,
            label: participant.name,
            image: participant.avatar
        }));
        let removedParticipants = getRemovedParticipants(simulation.nodes, newNodes)

        setSimulation({
            links: simulation.links.filter((link: any)=>{
                return !removedParticipants.includes(link.source) && !removedParticipants.includes(link.target)
            }),
            nodes: newNodes
        })
    }, [participants])
    useEffect(()=>{
        setCanAddTransaction(debtorId !== 0 && creditorId !== 0 && amount!== 0)
    }, [debtorId, creditorId, amount])
    useEffect(()=>{
        if(id !== 'create') getData()
    }, [id])

    const filterParticipantsByKeyword = async (keyword: string, participantId: number) =>{
        let result = [
            ...Object.values(participants).map(p=>{
                p.disabled = p.id === participantId
                return p
            })
        ]
        if(!keyword) return result
        return [...result.filter(participant=>participant.name.includes(keyword))]
    }

    const [save] = useCallApi({
        fetch: saveSettlement,
        params: {
            ...settlement,
            nodes: simulation.nodes.map((node:any)=>node.id),
            links: simulation.links
        },
        callback(id: number){
            setSettlement({...settlement, id })
            showMessage("Settlement saved")
        }
    })
    const [getData] = useCallApi({
        fetch: getSettlement,
        params: id,
        callback({nodes, links, ...settlement}: any){
            setSettlement(settlement)
            setParticipantIds(nodes)
            getParticipants({ids: nodes})
                .then(participants=>{
                    setSimulation({
                        nodes: participants,
                        links: links.map((link: any)=>({...link, label: currency(link.amount)}))
                    })
                })
        },
    })
    const getSimulation = useCallback(()=>{
        let optimizedSimulation = optimize(simulation, activateOptimization)
        optimizedSimulation.links = optimizedSimulation.links.map((link:any)=>{
            link.label = currency(link.amount)
            return link
        })
        return optimizedSimulation
    }, [simulation, activateOptimization])

    const showMessage = (message: string, type: 'success'| 'error'= 'success') => {
        messageApi.open({
            type: type,
            content: message,
        });
    };
    const ListItem: React.FC<any> = ({link, index, ...props}) => {
        return <div
            key={index}
            {...props}
            style={{ color: "#2d3748", fontSize: "0.75rem", lineHeight: "1rem", marginTop: 10}}
        >
            <Row align="middle">
                <Col span={20}>
                    <div><b>{participants[link.target].name}</b> owes <b>{participants[link.source].name} </b>{link.label}</div>
                </Col>
                <Col span={4} style={{textAlign: "center"}}>
                    <Tooltip title="remove transaction">
                        <CloseOutlined style={{color: 'red', cursor: 'pointer'}} onClick={()=>removeTransaction(index)}/>
                    </Tooltip>
                </Col>
            </Row>
            <Divider style={{margin: "15px 0px"}}/>
        </div>
    }

    return (
        <>
            <div className="show-on-mobile">
                <Row align="middle" justify="center" style={{marginTop: 30, color: "#818080"}}>
                    <h1>Mobile version will be available soon </h1>
                </Row>
            </div>
            <div style={{height: "100%"}} className="hide-on-mobile">
                <Row align="middle" style={{height: "10%"}}>
                    <Col>
                        <Tooltip title='Save'>
                            <Button
                                disabled={false}
                                type="text"
                                onClick={()=>save()}
                                icon={<SaveFilled style={{color:"#1677FF"}} />}
                            />
                        </Tooltip>
                    </Col>
                    <Col span={12} style={{padding: 5}}>
                        <Input
                            value={settlement.title}
                            onChange={e=>setSettlement({...settlement, title: e.target.value})}
                            bordered={borderedInput}
                            onMouseEnter={()=>setBorderedInput(true)}
                            onMouseLeave={()=>setBorderedInput(false)}
                            style={borderedInput?{}:{
                                fontWeight: 700, color: "#4e4e4f", fontSize: "1rem"
                            }}
                        />
                    </Col>
                    <Col flex="auto">
                        <Row justify="end" align="middle">
                            <div style={{fontWeight: 500, color: "#69696d", marginRight: 5}} >Optimization</div>
                            <Switch
                                checked={activateOptimization}
                                onChange={(v)=>setActivateOptimization(v)}
                                checkedChildren="On"
                                unCheckedChildren="Off"
                            />
                        </Row>
                    </Col>

                </Row>
                <Row style={{height: '90%'}} align={'middle'}  >
                    <Col span={8} style={{height: "100%"}}>
                        <Tabs
                            defaultActiveKey="1"
                            style={{ overflow: 'auto', width: '100%', backgroundColor: 'white', height: "100%", padding: 5 }}
                            centered
                        >
                            <TabPane style={{padding: 15}} tab="Participants"  key="1">
                                <Title>Select participants</Title>
                                <ParticipantsSelect
                                    onChange={(ids: number| number[])=>setParticipantIds(ids as number[])}
                                    fetch={(keyword: string)=>getParticipants({keyword})}
                                    mode="multiple"
                                    value={participantIds}
                                    style={{ width: "100%"}}
                                />
                                <div style={{marginTop: 15}}>
                                    <a href="/participants" target="_blank" style={{
                                        textDecoration: 'underline',
                                        color: "#02028d",
                                    }}>manage participants</a>
                                </div>

                            </TabPane>
                            <TabPane
                                style={{ padding: 15, overflow: 'scroll', height: "100%"}}
                                tab="Transactions"
                                key="2"
                            >
                                <div>
                                    <Title>Creditor:</Title>
                                    <ParticipantsSelect
                                        value={participants[creditorId]?.name}
                                        onChange={(id:number | number[])=>setCreditor(id as number)}
                                        fetch={(keyword: string)=>filterParticipantsByKeyword(keyword, debtorId)}
                                        style={{ width: "100%", marginBottom: 15}}
                                        allowClear
                                    />
                                    <Title>Debtor:</Title>
                                    <ParticipantsSelect
                                        value={participants[debtorId]?.name}
                                        onChange={(id:number | number[])=>setDebtorId(id as number)}
                                        fetch={(keyword: string)=>filterParticipantsByKeyword(keyword, creditorId)}
                                        style={{ width: "100%", marginBottom: 15}}
                                        allowClear
                                    />
                                    <Title>Amount:</Title>
                                    <InputNumber
                                        value={String(amount)}
                                        min={"0"}
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                        onChange={(v)=> setAmount(Number(v))}
                                        style={{width: '100%'}}
                                    />
                                    <Row justify={"end"} style={{marginTop: 15}}>
                                        <Button
                                            disabled={!canAddTransaction}
                                            type="primary"
                                            onClick={addTransaction}
                                        >Add </Button>
                                    </Row>
                                </div>
                                <div>
                                    {simulation.links.map((link: any, index: number)=>{
                                        return <ListItem link={link} index={index} key={index}/>
                                    })}
                                </div>
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col span={16} style={{height: "100%"}}>
                        <Graph
                            data={getSimulation()}
                            nodeSize={35}
                            nodeType="image"
                            distance={200}
                            linkClassName="link"
                            nodeClassName="node"
                            color='#25274d'
                            className="graph"
                            style={{height: "100%", width: "100%"}}
                        />
                    </Col>
                </Row>
            </div>
        </>
    );
}

const Title: React.FC<any> = (props) => {
    return <div
        style={{fontWeight: 700, color: "#4e4e4f", fontSize: "1rem"}}
        {...props}
    >
        {props.children}
    </div>
}

export default Index;


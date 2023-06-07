import React, {useEffect, useMemo, useState} from 'react';
import {Avatar, Select, Space, Spin} from 'antd';
import debounce from "lodash/debounce";

const { Option } = Select;

interface participants {
    id: number;
    avatar: string
    name: string,
    disabled?: boolean
}
interface Props {
    onChange: (ids: number | number[])=>void | ((id: number)=>void),
    fetch: (keyword: string)=> Promise<participants[]>,
    [key: string]: any
}
const ParticipantSelect:  React.FC<Props> =
    ({onChange, fetch, ...props})=>{
    const [fetching, setFetching] = useState(false);

    const handleChange = (value: number) => {
        onChange(value)
    };

    const debounceFetcher = useMemo(() => {
        const search = (value: string) => {
            setOptions([])
            setFetching(true)
            fetch(value)
                .then(participants=>{
                    setOptions(participants)
                    setFetching(false)
                })
        };
        return debounce(search, 800);
    }, [fetch]);
    useEffect(()=>{
        debounceFetcher('')
    }, [fetch])

    const [options, setOptions] = useState<participants[]>([])
    return <Select
        optionLabelProp="label"
        onChange={handleChange}
        showSearch
        onSearch={debounceFetcher}
        filterOption={false}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
    >
        {options.map(option=>
            <Option disabled={option.disabled} key={option.id} value={option.id} label={option.name}>
                <Space>
                    <Avatar src={option.avatar} />
                    {option.name}
                </Space>
            </Option>)}

    </Select>
}




export default ParticipantSelect
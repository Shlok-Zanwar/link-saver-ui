import { Button, message, Popconfirm, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import TableSearch from '../Components/TableSearch';

export default function MachineLoadDashboard({
    permissions={},
}) {
    const [masterState, setMasterState] = useState([]);

    // The below state is after the search is done
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);

        await axios.get('/')
            .then(res => {
                const data = res.data.data;

                setMasterState(data);
                setData(data);
            })
            .catch(err => {
                console.log(err);
                err.handleGlobally && err.handleGlobally();
                message.error('Error while fetching data');
            })
        setLoading(false);
    }

    useEffect(() => {
        getData();
    } , []);

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div className='actions-outer-div'>
                    <Button type="primary" className='actions-button' >
                        Edit    
                    </Button>
                    {/* <Popconfirm 
                        overlayClassName='delete-popconfirm' 
                        title={<>{record.severity_group_name} <br /> {severityDeleteMessage}</>} 
                        onConfirm={() => handleDelete(record.severity_group_id)} 
                        okText="Yes" cancelText="No" 
                        disabled={!permissions.delete}
                    >
                        <Button danger type={deleteButtonType} disabled={!permissions.delete} className='actions-button' title={`Delete Severity | ${record.severity_group_name}`}>
                            {deleteButtonTitle}
                        </Button>
                    </Popconfirm> */}
                </div>

            ),
			width: '150px',
        },

    ].filter(column => !column.hidden);




    return (
        <div className='my-form-outer'>
            <div className='my-form-header'>
                <span className='my-form-title'>Title</span>
                <Button type="primary">
                    Add Button
                </Button>
            </div>
            <div className='my-table-filter-row'>
                <div>
                    {/* Other filters can come here */}
                </div>
                <TableSearch
                    masterState={masterState}
                    state={data}
                    setState={setData}
                    searchOptions={[
                        // {keyName: 'keyName', label: 'label'},
                        {keyName: 'severity_group_name', label: 'Name'},
                        {keyName: 'severity_name', label: 'Severity'},
                        {keyName: 'description', label: 'Description'},
                        {keyName: 'comments', label: 'Comments'},
                    ]}
                    // defaultSearchKeys={['zone_group_name']}
                />
            </div>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                size="small"
                pagination={{
                    position: ['bottomRight'],
                    // position: ['topRight'],
                    showSizeChanger: true,
                }}
            />
        </div>

    )
}

import React from 'react'

const TableHeader = ({ headerContent }) => {
    return (
        <thead className='bg-table_header_grey rounded-full'>
            <tr className='rounded-full'>
                {
                    headerContent.map((header, index) => (
                        <th key={index} className={`py-3 border-b text-left pl-6 text-sm ${index === headerContent.length - 1 && ""} `}>{header}</th>
                    ))
                }
            </tr>
        </thead>
    )
}

export default TableHeader

import React from "react";

import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface DataItem {
    id: number;
    battery_power: number;
    px_height: number;
    ram: number;
}

interface DataProps {
    data: DataItem[];
}

const TableGrid: React.FC<DataProps> = ({ data }) => {
    const columnDefs: ColDef<DataItem>[] = [
        { headerName: 'ID', field: 'id', filter: true },
        { headerName: 'Battery Power', field: 'battery_power', filter: true },
        { headerName: 'Px Height', field: 'px_height', filter: true },
        { headerName: 'Ram', field: 'ram', filter: true },
    ];

    return (
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
          />
        </div>
    );
}

export default TableGrid;
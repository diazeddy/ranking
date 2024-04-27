import React, { useState } from "react";

import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import useDebounce from "./hook/useDebounce";

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

    const [gridApi, setGridApi] = useState<any>();
    const [gridColumnApi, setGridColumnApi] = useState<any>();
    const [searchText, setSearchText] = useState<string>('');

    const debouncedSearchText = useDebounce(searchText, 500);

    const onGridReady = (params: any) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    }

    const onSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const applyFilter = () => {
        gridApi?.setQuickFilter(searchText);
    };

    const columnDefs: ColDef<DataItem>[] = [
        { headerName: 'ID', field: 'id', filter: true },
        { headerName: 'Battery Power', field: 'battery_power', filter: true },
        { headerName: 'Px Height', field: 'px_height', filter: true },
        { headerName: 'Ram', field: 'ram', filter: true },
    ];

    return (
        <div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={onSearchTextChange}
                />
                <button onClick={applyFilter}>Search</button>
            </div>
            <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
            <AgGridReact
                rowData={data}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
            />
            </div>
        </div>
    );
}

export default TableGrid;
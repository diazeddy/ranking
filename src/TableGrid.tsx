import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
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
    const [searchText, setSearchText] = useState<string>('');
    const [rowCount, setRowCount] = useState<number>(0);

    

    const debouncedSearchText = useDebounce(searchText, 500);

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
        updateRowCount();
    }

    const onSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const applyFilter = () => {
        gridApi?.setQuickFilter(debouncedSearchText);
        updateRowCount();
    };

    const updateRowCount = () => {
        if (gridApi) {
            setRowCount(gridApi.getDisplayedRowCount());
        }
    };

    useEffect(() => {
        updateRowCount();
    }, [data, debouncedSearchText]);

    const columnDefs: ColDef<DataItem>[] = [
        { headerName: 'ID', field: 'id', filter: true },
        { headerName: 'Battery Power', field: 'battery_power', filter: true },
        { headerName: 'Px Height', field: 'px_height', filter: true },
        { headerName: 'Ram', field: 'ram', filter: true },
    ];

    

    console.log("@@@Rowcount", rowCount);

    return (
        <div style={{ marginTop: '10px' }}>
            <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    rowData={data}
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                />
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={onSearchTextChange}
                />
                <button onClick={applyFilter}>Search</button>
            </div>
            <p>Total Rows: 1000 &nbsp; <span>Current Rows: {rowCount}</span> </p>
        </div>
    );
}

export default TableGrid;
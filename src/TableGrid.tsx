import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import useDebounce from "./hook/useDebounce";
import { DataItem, DataProps } from "./App";

const TableGrid: React.FC<DataProps> = ({ data }) => {

    const [gridApi, setGridApi] = useState<any>();
    const [searchText, setSearchText] = useState<string>('');
    const [rowCount, setRowCount] = useState<number>(0);
    const [searchTime, setSearchTime] = useState<number>(0);

    const debouncedSearchText = useDebounce(searchText, 500);

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
        updateRowCount();
    }

    const onSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const applyFilter = () => {
        const startTime = performance.now();
        gridApi?.setQuickFilter(debouncedSearchText);
        const endTime = performance.now();
        setSearchTime(endTime - startTime);
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
                <button onClick={applyFilter} style={{ marginTop: '10px' }}>Search</button>
            </div>
            {
                data.length !== 0 &&
                <>
                    <p>Total Rows: 1000 &nbsp; <span>Current Rows: {rowCount}</span> </p>
                    <p>Search Query Time: {searchTime.toFixed(2)} milliseconds</p>
                </>
            }
        </div>
    );
}

export default TableGrid;
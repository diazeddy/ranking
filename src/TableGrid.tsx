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
    const [selectedColumn, setSelectedColumn] = useState<string>("battery_power");
    const [operation, setOperation] = useState<string>("bigger");
    const [columnSearchValue, setColumnSearchValue] = useState<number>(0);
    const [searchData, setSearchData] = useState<DataItem[]>(data);


    const debouncedSearchText = useDebounce(searchText, 500);

    const handleSelectedColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedColumn(e.target.value);
    }
    
    const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOperation(e.target.value);
    }

    const handleColumnSearchValueChange = (e: any) => {
        setColumnSearchValue(e.target.value);
    }

    const handleColumnSearch = () => {
        const startTime = performance.now();
        if (selectedColumn === "battery_power") {
            if (operation === "bigger") {
                setSearchData(data.filter((obj) => obj.battery_power > columnSearchValue));
            } else if (operation === "smaller") {
                setSearchData(data.filter((obj) => obj.battery_power < columnSearchValue));
            } else if (operation === "equal") {
                setSearchData(data.filter((obj) => obj.battery_power = columnSearchValue));
            }
        }
    
        if (selectedColumn === "px_height") {
            if (operation === "bigger") {
                setSearchData(data.filter((obj) => obj.px_height > columnSearchValue));
            } else if (operation === "smaller") {
                setSearchData(data.filter((obj) => obj.px_height < columnSearchValue));
            } else if (operation === "equal") {
                setSearchData(data.filter((obj) => obj.px_height = columnSearchValue));
            }
        }
    
        if (selectedColumn === "ram") {
            if (operation === "bigger") {
                setSearchData(data.filter((obj) => obj.ram > columnSearchValue));
            } else if (operation === "smaller") {
                setSearchData(data.filter((obj) => obj.ram < columnSearchValue));
            } else if (operation === "equal") {
                setSearchData(data.filter((obj) => obj.ram = columnSearchValue));
            }
        }

        const endTime = performance.now();
        setSearchTime(endTime - startTime);
        if (gridApi) {
            setRowCount(gridApi.getDisplayedRowCount());
        }
    }

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
        handleColumnSearch();
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
                    rowData={searchData}
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
                <span>&nbsp;</span>
                <button onClick={applyFilter} style={{ marginTop: '10px' }}>Search</button>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <select value={selectedColumn} onChange={handleSelectedColumnChange}>
                    <option value="battery_power">Battery Power</option>
                    <option value="px_height">Px Height</option>
                    <option value="ram">Ram</option>
                </select>
                <select value={operation} onChange={handleOperationChange}>
                    <option value="bigger">{">"}</option>
                    <option value="smaller">{"<"}</option>
                    <option value="equal">=</option>
                </select>
                <span>&nbsp;</span>
                -
                <span>&nbsp;</span>
                <input type='number' value={columnSearchValue} onChange={handleColumnSearchValueChange} />
                <span>&nbsp;</span>
                <button onClick={handleColumnSearch}>Column Search</button>
            </div>
            {/* <p>{filteredRows}</p> */}
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
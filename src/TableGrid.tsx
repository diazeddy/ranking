import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import useDebounce from "./hook/useDebounce";
import { DataItem, DataProps } from "./App";

enum ColumnType {
    BATTERYPOWER = "battery_power",
    PXHEIGHT = "px_height",
    RAM = "ram",
}

const TableGrid: React.FC<DataProps> = ({ data }) => {

    const [gridApi, setGridApi] = useState<any>();
    const [searchText, setSearchText] = useState<string>('');
    const [rowCount, setRowCount] = useState<number>(0);
    const [searchTime, setSearchTime] = useState<number>(0);
    const [selectedColumn, setSelectedColumn] = useState<string>(ColumnType.BATTERYPOWER);
    const [operation, setOperation] = useState<string>("bigger");
    const [columnSearchValue, setColumnSearchValue] = useState<number>(0);
    const [searchData, setSearchData] = useState<DataItem[]>(data);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const gridDivRef = useRef<HTMLDivElement>(null);

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
        if (selectedColumn === ColumnType.BATTERYPOWER) {
            if (operation === "bigger") {
                setSearchData(data.filter((obj) => obj.battery_power > columnSearchValue));
            } else if (operation === "smaller") {
                setSearchData(data.filter((obj) => obj.battery_power < columnSearchValue));
            } else if (operation === "equal") {
                setSearchData(data.filter((obj) => obj.battery_power = columnSearchValue));
            }
        }
    
        if (selectedColumn === ColumnType.PXHEIGHT) {
            if (operation === "bigger") {
                setSearchData(data.filter((obj) => obj.px_height > columnSearchValue));
            } else if (operation === "smaller") {
                setSearchData(data.filter((obj) => obj.px_height < columnSearchValue));
            } else if (operation === "equal") {
                setSearchData(data.filter((obj) => obj.px_height = columnSearchValue));
            }
        }
    
        if (selectedColumn === ColumnType.RAM) {
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
        { headerName: 'Battery Power', field: ColumnType.BATTERYPOWER, filter: true },
        { headerName: 'Px Height', field: ColumnType.PXHEIGHT, filter: true },
        { headerName: 'Ram', field: ColumnType.RAM, filter: true },
    ];

    const handleScroll = () => {
        if (gridDivRef.current) {
            const scrollTop = gridDivRef.current.scrollTop;
            const scrollHeight = gridDivRef.current.scrollHeight;
            const clientHeight = gridDivRef.current.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        }
    };

    return (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={onSearchTextChange}
                    style={{ width: "100px" }}
                />
                <span>&nbsp;</span>
                <button onClick={applyFilter} style={{ marginTop: '10px' }}>Search</button>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <select value={selectedColumn} onChange={handleSelectedColumnChange}>
                    <option value={ColumnType.BATTERYPOWER}>Battery Power</option>
                    <option value={ColumnType.PXHEIGHT}>Px Height</option>
                    <option value={ColumnType.RAM}>Ram</option>
                </select>
                <select value={operation} onChange={handleOperationChange}>
                    <option value="bigger">{">"}</option>
                    <option value="smaller">{"<"}</option>
                    <option value="equal">=</option>
                </select>
                <span>&nbsp;</span>
                -
                <span>&nbsp;</span>
                <input type='number' value={columnSearchValue} onChange={handleColumnSearchValueChange} style={{ width: "100px" }} />
                <span>&nbsp;</span>
                <button onClick={handleColumnSearch}>Column Search</button>
            </div>
            {
                data.length !== 0 &&
                <>
                    <p>Total Rows: 1000 &nbsp; <span>Current Rows: {rowCount}</span> </p>
                    <p>Search Query Time: {searchTime.toFixed(2)} milliseconds</p>
                </>
            }
            <div className="ag-theme-alpine" style={{ flex: 1, overflow: 'hidden' }} ref={gridDivRef} onScroll={handleScroll}>
                <AgGridReact
                    rowData={searchData}
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    // domLayout='autoHeight'
                />
            </div>
        </div>
    );
}

export default TableGrid;
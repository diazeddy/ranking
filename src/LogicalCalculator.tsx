import React, { useState } from 'react';
import { DataProps } from './App';

enum ColumnType {
    BATTERYPOWER = "battery_power",
    PXHEIGHT = "px_height",
    RAM = "ram",
}

enum OperationType {
    MAX = "MAX",
    MIN = "MIN",
    RANK = "RANK",
    SUM = "SUM",
    AVG = "AVG",
}

const LogicalCalculator:React.FC<DataProps> = ({ data }) => {
    const [operation, setOperation] = useState<string>("MIN");
    const [startColumnType, setStartColumnType] = useState<string>(ColumnType.BATTERYPOWER);
    const [startIndex, setStartIndex] = useState<number>(1);
    const [endColumnType, setEndColumnType] = useState<string>(ColumnType.BATTERYPOWER);
    const [endIndex, setEndIndex] = useState<number>(1);
    const [rankPointType, setRankPointType] = useState<string>(ColumnType.BATTERYPOWER);
    const [rankPointIndex, setRankPointIndex] = useState<number>(1);
    const [result, setResult] = useState<number | undefined>(undefined);

    let rangeArray: number[] = [];

    const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOperation(e.target.value);
    };

    const handleStartColumnTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStartColumnType(e.target.value);
    }

    const handleStartIndexChange = (e: any) => {
        setStartIndex(e.target.value);
    }

    const handleEndColumnTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEndColumnType(e.target.value);
    }

    const handleEndIndexChange = (e: any) => {
        setEndIndex(e.target.value);
    }

    const handleRankPointTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRankPointType(e.target.value);
    }

    const handleRankPointIndexChange = (e: any) => {
        setRankPointIndex(e.target.value);
    }

    const minValue = Math.min(startIndex, endIndex);
    const maxValue = Math.max(startIndex, endIndex);

    if ((startColumnType === ColumnType.BATTERYPOWER && endColumnType === ColumnType.RAM) || (startColumnType === ColumnType.RAM && endColumnType === ColumnType.BATTERYPOWER)) {

        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].battery_power);
            rangeArray.push(data[i].px_height);
            rangeArray.push(data[i].ram);
        }
    }

    if ((startColumnType === ColumnType.BATTERYPOWER && endColumnType === ColumnType.PXHEIGHT) || (endColumnType === ColumnType.BATTERYPOWER && startColumnType === "px_height")) {
        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].battery_power);
            rangeArray.push(data[i].px_height);
        }
    }

    if ((startColumnType === ColumnType.PXHEIGHT && endColumnType === ColumnType.RAM) || (endColumnType === ColumnType.PXHEIGHT && startColumnType === ColumnType.RAM)) {
        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].px_height);
            rangeArray.push(data[i].ram);
        }
    }

    if (startColumnType === ColumnType.BATTERYPOWER && endColumnType === ColumnType.BATTERYPOWER) {
        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].battery_power);
        }
    }

    if (startColumnType === ColumnType.PXHEIGHT && endColumnType === ColumnType.PXHEIGHT) {
        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].px_height);
        }
    }

    if (startColumnType === ColumnType.RAM && endColumnType === ColumnType.RAM) {
        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].ram);
        }
    }

    const calculateSum = (array: number[]) => {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum;
    }

    let rankPointedValue: number;
    
    if (rankPointType === ColumnType.BATTERYPOWER) {
        rankPointedValue = data[rankPointIndex - 1].battery_power;
    } else if (rankPointType === ColumnType.PXHEIGHT) {
        rankPointedValue = data[rankPointIndex - 1].px_height;
    } else if (rankPointType === ColumnType.RAM) {
        rankPointedValue = data[rankPointIndex - 1].ram;
    }

    const calculateAvg = (array: number[]) => {
        let length = array.length;
        return Number((calculateSum(array) / length).toFixed(2));
    }

    const ranking = (arr: number[], compFn: (a: number, b: number) => boolean) => arr.map(a => arr.filter(b => compFn(a, b)).length + 1);

    const calculateRank = (array: number[]) => {
        const filteredArray: number[] = ranking(array, (a, b) => a < b);
        const index = rangeArray.indexOf(rankPointedValue);
        return filteredArray[index];
    }

    const calculate = () => {
        switch (operation) {
            case OperationType.MIN:
                setResult(Math.min(...rangeArray));
                break;
            case OperationType.MAX:
                setResult(Math.max(...rangeArray));
                break;
            case OperationType.RANK:
                setResult(calculateRank(rangeArray));
                break;
            case OperationType.SUM:
                setResult(calculateSum(rangeArray));
                break;
            case OperationType.AVG:
                setResult(calculateAvg(rangeArray));
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <label>
                <h2>Select Operation</h2>
                <select value={operation} onChange={handleOperationChange}>
                    <option value={OperationType.MIN}>MIN</option>
                    <option value={OperationType.MAX}>MAX</option>
                    <option value={OperationType.RANK}>RANK</option>
                    <option value={OperationType.SUM}>SUM</option>
                    <option value={OperationType.AVG}>AVG</option>
                </select>
            </label>
            <label>
                <h2>Range Indicator</h2>
                <select value={startColumnType} onChange={handleStartColumnTypeChange}>
                    <option value={ColumnType.BATTERYPOWER}>Battery Power</option>
                    <option value={ColumnType.PXHEIGHT}>Px Height</option>
                    <option value={ColumnType.RAM}>Ram</option>
                </select>
                <span>&nbsp;</span>
                -
                <span>&nbsp;</span>
                <input type='number' value={startIndex} onChange={handleStartIndexChange} style={{ width: "100px" }} />
                <span>&nbsp;</span>
                :
                <span>&nbsp;</span>
                <select value={endColumnType} onChange={handleEndColumnTypeChange}>
                    <option value={ColumnType.BATTERYPOWER}>Battery Power</option>
                    <option value={ColumnType.PXHEIGHT}>Px Height</option>
                    <option value={ColumnType.RAM}>Ram</option>
                </select>
                <span>&nbsp;</span>
                -
                <span>&nbsp;</span>
                <input type='number' value={endIndex} onChange={handleEndIndexChange} style={{ width: "100px" }} />
                {
                    (operation === "RANK") &&
                    <div style={{ marginTop: '5px' }}>
                        <span>&nbsp;&nbsp;&nbsp;Rank Point:&nbsp;</span>
                        <select value={rankPointType} onChange={handleRankPointTypeChange}>
                            <option value={ColumnType.BATTERYPOWER}>Battery Power</option>
                            <option value={ColumnType.PXHEIGHT}>Px Height</option>
                            <option value={ColumnType.RAM}>Ram</option>
                        </select>
                        <input type='number' value={rankPointIndex} onChange={handleRankPointIndexChange} style={{ width: "100px" }} />
                    </div>
                }
            </label>
            <label>
                <div style={{ marginTop: '10px' }}>
                    <button onClick={calculate}>Calculate</button>
                    {result !== undefined && (
                        <p>Result: {result}</p>
                    )}
                </div>
            </label>
        </div>
    );
}

export default LogicalCalculator;
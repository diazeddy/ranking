import React, { useState } from 'react';
import { DataProps } from './App';


const LogicalCalculator:React.FC<DataProps> = ({ data }) => {
    const [operation, setOperation] = useState<string>("MIN");
    const [startColumnType, setStartColumnType] = useState<string>("battery_power");
    const [startIndex, setStartIndex] = useState<number>(1);
    const [endColumnType, setEndColumnType] = useState<string>("battery_power");
    const [endIndex, setEndIndex] = useState<number>(1);
    const [rankPointType, setRankPointType] = useState<string>("battery_power");
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

    if ((startColumnType === "battery_power" && endColumnType === "ram") || (startColumnType === "ram" && endColumnType === "battery_power")) {

        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].battery_power);
            rangeArray.push(data[i].px_height);
            rangeArray.push(data[i].ram);
        }
    }

    if ((startColumnType === "battery_power" && endColumnType === "px_height") || (endColumnType === "battery_power" && startColumnType === "px_height")) {
        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].battery_power);
            rangeArray.push(data[i].px_height);
        }
    }

    if ((startColumnType === "px_height" && endColumnType === "ram") || (endColumnType === "px_height" && startColumnType === "ram")) {
        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].px_height);
            rangeArray.push(data[i].ram);
        }
    }

    if (startColumnType === "battery_power" && endColumnType === "battery_power") {
        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].battery_power);
        }
    }

    if (startColumnType === "px_height" && endColumnType === "px_height") {
        for (let i = minValue - 1; i < maxValue; i++) {
            rangeArray.push(data[i].px_height);
        }
    }

    if (startColumnType === "ram" && endColumnType === "ram") {
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
    
    if (rankPointType === "battery_power") {
        rankPointedValue = data[rankPointIndex - 1].battery_power;
    } else if (rankPointType === "px_height") {
        rankPointedValue = data[rankPointIndex - 1].px_height;
    } else if (rankPointType === "ram") {
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
            case "MIN":
                setResult(Math.min(...rangeArray));
                break;
            case "MAX":
                setResult(Math.max(...rangeArray));
                break;
            case "RANK":
                setResult(calculateRank(rangeArray));
                break;
            case "SUM":
                setResult(calculateSum(rangeArray));
                break;
            case "AVG":
                setResult(calculateAvg(rangeArray));
                break;
            default:
                break;
        }
    };



    console.log("@@@@XX", startColumnType);

    return (
        <div>
            <label>
                <h4>Select Operation</h4>
                <select value={operation} onChange={handleOperationChange}>
                    <option value="MIN">MIN</option>
                    <option value="MAX">MAX</option>
                    <option value="RANK">RANK</option>
                    <option value="SUM">SUM</option>
                    <option value="AVG">AVG</option>
                </select>
            </label>
            <label>
                <h4>Range Indicator</h4>
                <select value={startColumnType} onChange={handleStartColumnTypeChange}>
                    <option value="battery_power">Battery Power</option>
                    <option value="px_height">Px Height</option>
                    <option value="ram">Ram</option>
                </select>
                <span>&nbsp;</span>
                -
                <span>&nbsp;</span>
                <input type='number' value={startIndex} onChange={handleStartIndexChange} />
                <span>&nbsp;</span>
                :
                <span>&nbsp;</span>
                <select value={endColumnType} onChange={handleEndColumnTypeChange}>
                    <option value="battery_power">Battery Power</option>
                    <option value="px_height">Px Height</option>
                    <option value="ram">Ram</option>
                </select>
                <span>&nbsp;</span>
                -
                <span>&nbsp;</span>
                <input type='number' value={endIndex} onChange={handleEndIndexChange} />
                {
                    (operation === "RANK") &&
                    <div style={{ marginTop: '5px' }}>
                        <span>&nbsp;&nbsp;&nbsp;Rank Point:&nbsp;</span>
                        <select value={rankPointType} onChange={handleRankPointTypeChange}>
                            <option value="battery_power">Battery Power</option>
                            <option value="px_height">Px Height</option>
                            <option value="ram">Ram</option>
                        </select>
                        <input type='number' value={rankPointIndex} onChange={handleRankPointIndexChange} />
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
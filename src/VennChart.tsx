import React, { useState, useEffect } from 'react';
import { DataItem, DataProps } from "./App";
import { VennDiagramChart } from 'chartjs-chart-venn';

const VennChart: React.FC<DataProps> = ({ data }) => {
    
    const [searchFirstData, setSearchFirstData] = useState<DataItem[]>(data);
    const [searchSecondData, setSearchSecondData] = useState<DataItem[]>(data);
    const [searchThirdData, setSearchThirdData] = useState<DataItem[]>(data);

    const [firstoperation, setFirstOperation] = useState<string>("bigger");
    const [secondoperation, setSecondOperation] = useState<string>("bigger");
    const [thirdoperation, setThirdOperation] = useState<string>("bigger");

    const [firstcolumnSearchValue, setFirstColumnSearchValue] = useState<number>(0);
    const [secondcolumnSearchValue, setSecondColumnSearchValue] = useState<number>(0);
    const [thirdcolumnSearchValue, setThirdColumnSearchValue] = useState<number>(0);
    
    const handleFirstOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFirstOperation(e.target.value);
    }

    const handleFirstColumnSearchValueChange = (e: any) => {
        setFirstColumnSearchValue(e.target.value);
    }

    const handleSecondOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSecondOperation(e.target.value);
    }

    const handleSecondColumnSearchValueChange = (e: any) => {
        setSecondColumnSearchValue(e.target.value);
    }

    const handleThirdOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setThirdOperation(e.target.value);
    }

    const handleThirdColumnSearchValueChange = (e: any) => {
        setThirdColumnSearchValue(e.target.value);
    }

    const handleFirstClick = () => {
        if (firstoperation === "bigger") {
            setSearchFirstData(data.filter((obj) => obj.battery_power > firstcolumnSearchValue));
        } else if (firstoperation === "smaller") {
            setSearchFirstData(data.filter((obj) => obj.battery_power < firstcolumnSearchValue));
        } else if (firstoperation === "equal") {
            setSearchFirstData(data.filter((obj) => obj.battery_power = firstcolumnSearchValue));
        }
    }

    const handleSecondClick = () => {
        if (secondoperation === "bigger") {
            setSearchSecondData(data.filter((obj) => obj.px_height > secondcolumnSearchValue));
        } else if (secondoperation === "smaller") {
            setSearchSecondData(data.filter((obj) => obj.px_height < secondcolumnSearchValue));
        } else if (secondoperation === "equal") {
            setSearchSecondData(data.filter((obj) => obj.px_height = secondcolumnSearchValue));
        }
    }

    const handleThirdClick = () => {
        if (thirdoperation === "bigger") {
            setSearchThirdData(data.filter((obj) => obj.ram > thirdcolumnSearchValue));
        } else if (thirdoperation === "smaller") {
            setSearchThirdData(data.filter((obj) => obj.ram < thirdcolumnSearchValue));
        } else if (thirdoperation === "equal") {
            setSearchThirdData(data.filter((obj) => obj.ram = thirdcolumnSearchValue));
        }
    }

    const countCommonElements = (arr1: number[], arr2: number[], arr3?: number[]) => {
        const commonElements = arr1.filter(element => arr2.includes(element));
        if (arr3) {
            const trigleElements = commonElements.filter(el => arr3.includes(el));
            return trigleElements.length;
        } else {
            return commonElements.length;
        }
    }

    const extractIds = (arrayofObjects: DataItem[]) => {
        return arrayofObjects.map(obj => obj.id);
    }

    let searchFirstIdData = extractIds(searchFirstData);
    let searchSecondIdData = extractIds(searchSecondData);
    let searchThirdIdData = extractIds(searchThirdData);

    let Battery = searchFirstIdData.length;
    let Px = searchSecondIdData.length;
    let Ram = searchThirdIdData.length;
    let Battery_Px = countCommonElements(searchFirstIdData, searchSecondIdData);
    let Px_Ram = countCommonElements(searchSecondIdData, searchThirdIdData);
    let Battery_Ram = countCommonElements(searchFirstIdData, searchThirdIdData);
    let Battery_Px_Ram = countCommonElements(searchFirstIdData, searchSecondIdData, searchThirdIdData);

    const config: any = {
        type: "euler",
        data: {
            labels: [
                "Battery Power",
                "Px Height",
                "Ram",
                "Battery Power ∩ Px Height",
                "Battery Power ∩ Ram",
                "Px Height ∩ Ram",
                "Battery Power ∩ Px Height ∩ Ram"
            ],
            datasets: [
            {
                label: "Cell Phone",
                data: [
                { sets: ["Battery Power"], value: Battery },
                { sets: ["Px Height"], value: Px },
                { sets: ["Ram"], value: Ram },
                { sets: ["Battery Power", "Px Height"], value: Battery_Px },
                { sets: ["Battery Power", "Ram"], value: Battery_Ram },
                { sets: ["Px Height", "Ram"], value: Px_Ram },
                { sets: ["Battery Power", "Px Height", "Ram"], value: Battery_Px_Ram }
                ]
            }
            ]
        },
        options: {
            title: {
            display: true,
            text: "Chart.js Venn Diagram Chart"
            }
        }
    };

    useEffect(() => {
        if (searchFirstData.length > 0 && searchSecondData.length > 0 && searchThirdData.length > 0) {
            const ctx: any = document.getElementById("canvas");
            const d = new VennDiagramChart(ctx, config);
        }
    }, [searchFirstData, searchSecondData, searchThirdData]);

    return (
        <div>
            <div>
                <label>
                    <span>Battery Power</span>
                    <select value={firstoperation} onChange={handleFirstOperationChange}>
                        <option value="bigger">{">"}</option>
                        <option value="smaller">{"<"}</option>
                        <option value="equal">=</option>
                    </select>
                    <span>&nbsp;</span>
                    -
                    <span>&nbsp;</span>
                    <input type='number' value={firstcolumnSearchValue} onChange={handleFirstColumnSearchValueChange} style={{ width: "100px" }} />
                </label>
                <button onClick={handleFirstClick}>Get Filtered Data(1)</button>
            </div>
            <div>
                <label>
                    <span>Px Height</span>
                    <select value={secondoperation} onChange={handleSecondOperationChange}>
                        <option value="bigger">{">"}</option>
                        <option value="smaller">{"<"}</option>
                        <option value="equal">=</option>
                    </select>
                    <span>&nbsp;</span>
                    -
                    <span>&nbsp;</span>
                    <input type='number' value={secondcolumnSearchValue} onChange={handleSecondColumnSearchValueChange} style={{ width: "100px" }} />
                </label>
                <button onClick={handleSecondClick}>Get Filtered Data(2)</button>
            </div>
            <div>
                <label>
                    <span>Ram</span>
                    <select value={thirdoperation} onChange={handleThirdOperationChange}>
                        <option value="bigger">{">"}</option>
                        <option value="smaller">{"<"}</option>
                        <option value="equal">=</option>
                    </select>
                    <span>&nbsp;</span>
                    -
                    <span>&nbsp;</span>
                    <input type='number' value={thirdcolumnSearchValue} onChange={handleThirdColumnSearchValueChange} style={{ width: "100px" }} />
                </label>
                <button onClick={handleThirdClick}>Get Filtered Data(3)</button>
            </div>
            <div style={{ marginTop: "20px" }}>
                <canvas id="canvas"></canvas>
            </div>
        </div>
    );
}

export default VennChart;
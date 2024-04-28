import { useState } from 'react'

import CsvFileInput from './CsvFileInput'
import TableGrid from './TableGrid';
import LogicalCalculator from './LogicalCalculator';
import VennChart from './VennChart';

import './App.css'

export interface DataItem {
  id: number;
  battery_power: number;
  px_height: number;
  ram: number;
}

export interface DataProps {
  data: DataItem[];
}

function App() {
  const [data, setData] = useState<DataItem[]>([]);
  const handleFileLoad = (csvData: any) => {
    setData(csvData);
  };

  console.log("@@@", data);
  // for (let i = 0; i < 10; i++) {
  //   console.log("@@@@Samll Data", data[i].battery_power);
  // }
  return (
    <>
      <h1>CSV Import in React.js</h1>
      <CsvFileInput onFileLoad={handleFileLoad} />
      {/* <ul>
        {data.map((row, index) => (
          <li key={index}>{JSON.stringify(row)}</li>
        ))}
      </ul> */}
      <TableGrid data={data} />
      {
        (data.length !== 0) && 
        <LogicalCalculator data={data} />
      }
      <VennChart data={data} />
    </>
  )
}

export default App

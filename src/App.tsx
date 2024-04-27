import { useState } from 'react'

import CsvFileInput from './CsvFileInput'
import TableGrid from './TableGrid';

import './App.css'

interface DataItem {
  id: number;
  battery_power: number;
  px_height: number;
  ram: number;
}

function App() {
  const [data, setData] = useState<DataItem[]>([]);
  const handleFileLoad = (csvData: any) => {
    setData(csvData);
  };

  console.log("@@@", data);
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
    </>
  )
}

export default App

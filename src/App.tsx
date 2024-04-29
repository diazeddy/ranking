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

  return (
    <div className="app" style={{ display: 'flex' }}>
      <div className='left-panel'>
        <h1>CSV Import in React.js</h1>
        <CsvFileInput onFileLoad={handleFileLoad} />
        <TableGrid data={data} />
      </div>
      <div className='right panel' style={{ display:'flex', flexDirection:'column', marginLeft: '100px' }}>
        {
          (data.length !== 0) && 
          <div className='first half' style={{ flex: 1 }}>
            <LogicalCalculator data={data}/>
          </div>
        }
        <div className='second half' style={{ flex: 1 }}>
          <VennChart data={data} />
        </div>
      </div>
    </div>
  )
}

export default App

import { useState } from 'react'
import './App.css'

import CsvFileInput from './CsvFileInput'

function App() {
  const [data, setData] = useState([]);
  const handleFileLoad = (csvData: any) => {
    setData(csvData);
  };



  return (
    <>
      <h1>CSV Import in React.js</h1>
      <CsvFileInput onFileLoad={handleFileLoad} />
      <ul>
        {data.map((row, index) => (
          <li key={index}>{JSON.stringify(row)}</li>
        ))}
      </ul>
    </>
  )
}

export default App

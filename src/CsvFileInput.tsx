import React from 'react';
import Papa from 'papaparse';

interface CsvData {
    data: any[];
}

interface CsvFileInputProps {
    onFileLoad: (data: any[]) => void;
}

const CsvFileInput = ({ onFileLoad }: CsvFileInputProps) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (file) {
        Papa.parse(file, {
            complete: (result: CsvData) => {
            onFileLoad(result.data);
            },
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
        });
        }
    };
    return (
        <div>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
};
export default CsvFileInput;
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { CSVLink } from "react-csv";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("edited_data.csv");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split("\n").map((row) => row.split(","));
        setHeaders(rows[0]);
        setCsvData(rows.slice(1));
      };
      reader.readAsText(file);
    }
  };

  const handleAddRow = () => {
    setCsvData([...csvData, Array(headers.length).fill("")]);
  };

  const handleRemoveRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleCellChange = (rowIndex, cellIndex, value) => {
    const newData = csvData.map((row, i) =>
      i === rowIndex ? row.map((cell, j) => (j === cellIndex ? value : cell)) : row
    );
    setCsvData(newData);
  };

  const handleDownload = () => {
    toast("CSV file downloaded successfully.");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">CSV Upload, Edit, and Download Tool</h1>
      <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      {csvData.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleAddRow} className="mt-4">
            Add Row
          </Button>
          <CSVLink data={[headers, ...csvData]} filename={fileName}>
            <Button onClick={handleDownload} className="mt-4 ml-4">
              Download CSV
            </Button>
          </CSVLink>
        </>
      )}
    </div>
  );
};

export default Index;
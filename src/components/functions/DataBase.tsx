import React, { useEffect, useState } from "react";
import styles from "../../styles.module.css";

interface MapData {
  mapname: string;
  mapnum: string;
  type: string;
  date: string;
  map_size: string;
  note: string;
}

const DataBase: React.FC = () => {
  const [data, setData] = useState<MapData[]>([]);

  useEffect(() => {
    fetch("/assets/sampleData.json")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("데이터 로드 실패:", error));
  }, []);

  const handleRowClick = (item: MapData) => {
    console.log("클릭된 데이터:", item);
  };

  return (
    <div className={styles.content}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Map Name</th>
            <th>Map Num</th>
            <th>Type</th>
            <th>Date</th>
            <th>Map Size</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} onClick={() => handleRowClick(item)} className={styles.tableRow}>
              <td>{item.mapname}</td>
              <td>{item.mapnum}</td>
              <td>{item.type}</td>
              <td>{item.date}</td>
              <td>{item.map_size}</td>
              <td>{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataBase;

import React, { useEffect, useState } from "react";
import styles from "../../styles.module.css";

import { useSetRecoilState } from "recoil";
import { selectedMapState, MapData } from "../../recoil/mapAtom";

const DataBase: React.FC = () => {
  const [data, setData] = useState<MapData[]>([]);
  const setSelectedMap = useSetRecoilState(selectedMapState);

  // 페이징 상태들
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;  // 한 페이지에 보여줄 아이템 개수

  useEffect(() => {
    fetch("http://192.168.0.15:8005/api/maps")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("데이터 로드 실패:", error));
  }, []);

  const handleRowClick = (item: MapData) => {
    setSelectedMap(item); // Recoil 상태에 클릭한 데이터 저장
    console.log("클릭된 데이터:", item);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // 현재 페이지에 맞는 데이터 슬라이스
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pagedData = data.slice(startIndex, startIndex + itemsPerPage);

  // 페이지 변경 함수
  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
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
          {pagedData.map((item, index) => (
            <tr
              key={startIndex + index}
              onClick={() => handleRowClick(item)}
              className={styles.tableRow}
            >
              <td>{item.map_name}</td>
              <td>{item.map_num}</td>
              <td>{item.map_type}</td>
              <td>{item.map_date}</td>
              <td>{item.map_size}</td>
              <td>{item.note}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6} style={{ textAlign: "center", padding: "10px" }}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: 10 }}
              >
                이전
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    disabled={page === currentPage}
                    style={{
                      fontWeight: page === currentPage ? "bold" : "normal",
                      margin: "0 5px",
                    }}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ marginLeft: 10 }}
              >
                다음
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DataBase;

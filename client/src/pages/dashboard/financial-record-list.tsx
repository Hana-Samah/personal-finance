// استيراد الأدوات اللازمة من React
import { useMemo, useState } from "react";

// استيراد النوع والسياق (context) الخاص بالسجلات المالية
import { FinancialRecord, useFinancialRecords } from "../../contexts/financial-record-context";

// استيراد الدوال والنوعيات من مكتبة react-table
import { useTable, Column, CellProps, Row } from "react-table";

// تعريف نوع الخصائص (props) التي يستقبلها مكون الخلية القابلة للتعديل
interface EditableCellProps extends CellProps<FinancialRecord> {
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean; // لتحديد هل يمكن تعديل الخلية أم لا
}

// مكون الخلية القابلة للتعديل
const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false); // حالة هل الخلية في وضع التعديل؟
  const [value, setValue] = useState(initialValue); // القيمة الحالية في الخلية

  // عند الخروج من حقل الإدخال، يحدث تحديث للسجل
  const onBlur = () => {
    setIsEditing(false);
    updateRecord(row.index, column.id, value); // تحديث القيمة في السجل
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)} // إذا كانت الخلية قابلة للتعديل، فعل التعديل عند الضغط
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        // إذا كانت الخلية في وضع التعديل، أظهر input
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          style={{ width: "100%" }}
        />
      ) : typeof value === "string" ? (
        value // عرض القيمة إذا كانت نص
      ) : (
        value.toString() // تحويل القيمة لنص إذا لم تكن نصًا
      )}
    </div>
  );
};

// مكون يعرض جدول السجلات المالية
export const FinancialRecordList = () => {
  // استخدام السياق للحصول على السجلات ودوال التحديث والحذف
  const { records, updateRecord, deleteRecord } = useFinancialRecords();

  // دالة مخصصة لتحديث خلية معينة في السجل
  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id;
    updateRecord(id ?? "", { ...records[rowIndex], [columnId]: value });
  };

  // تعريف الأعمدة في الجدول باستخدام useMemo لتحسين الأداء
  const columns: Array<Column<FinancialRecord>> = useMemo(
    () => [
      {
        Header: "Description", // عنوان العمود
        accessor: "description", // خاصية السجل التي يعرضها العمود
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true} // هذا العمود قابل للتعديل
          />
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />
        ),
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable={false} />
          // هذا العمود غير قابل للتعديل
        ),
      },
      {
        Header: "Delete",
        id: "delete", // لا يعتمد على accessor لأننا لا نعرض قيمة بل زر
        Cell: ({ row }) => (
          <button
            onClick={() => deleteRecord(row.original._id ?? "")}
            className="button"
          >
            Delete
          </button>
        ),
      },
    ],
    [records] // يعاد إنشاؤه فقط إذا تغيرت السجلات
  );

  // استخدام useTable لإنشاء الجدول بناءً على البيانات والأعمدة
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: records,
    });

  return (
    <div className="table-container">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((hg) => (
            <tr {...hg.getHeaderGroupProps()}>
              {hg.headers.map((column) => (
                <th {...column.getHeaderProps()}> {column.render("Header")} </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row); // تجهيز الصف لعرضه
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  const unidadesDetalle = record.unidadesDetalle || [];

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const margin = 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Detalles de la Asignatura", margin, margin + 10);

    doc.setFontSize(12);
    const generalInfo = [
      [
        {
          content: "Asignatura: " + record.materia.toUpperCase(),
          colSpan: 2,
          styles: { fontStyle: "bold" },
        },
      ],
      [
        "Unidades: " + record.unidades + " Unidad(es)",
        "Duración: " + record.horas + " horas",
      ],
      [{ content: "Competencia: " + record.competencia, colSpan: 2 }],
      [{ content: "Objetivo General: " + record.objetivoGeneral, colSpan: 2 }],
      [
        "Profesor: " + record.profesor,
        "Familia: " + record.familia.toUpperCase(),
      ],
    ];

    autoTable(doc, {
      startY: margin + 20,
      body: generalInfo,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: { cellPadding: 2, fontSize: 11 },
    });

    let totalSaber = 0;
    let totalHacerSer = 0;
    let totalSemanas = 0;

    const unidadesData = unidadesDetalle.map((unidad: any, index: number) => {
      totalSaber += Number(unidad.saber);
      totalHacerSer += Number(unidad.hacerSer);
      totalSemanas += Number(unidad.semanas);

      return [
        `Unidad ${index + 1}`,
        unidad.competenciaEspecifica,
        unidad.semanas,
        unidad.resultadoAprendizaje,
        `${unidad.saber}%`,
        `${unidad.hacerSer}%`,
      ];
    });

    unidadesData.push([
      "Total",
      "",
      totalSemanas,
      "",
      `${totalSaber}%`,
      `${totalHacerSer}%`,
    ]);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [
        [
          "Unidad",
          "Competencia Específica",
          "Semanas",
          "Resultado de Aprendizaje",
          "Saber (%)",
          "Hacer-Ser (%)",
        ],
      ],
      body: unidadesData,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: { cellPadding: 2, fontSize: 11 },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, 

    });

    doc.save("detalle_asignatura.pdf");
  };

  return (
    <div className="flex fixed inset-0 items-center justify-center bg-gray-800 shadow-md">
      <div className="bg-white p-6 rounded-md shadow-md w-full h-full md:w-11/12 md:h-5/6 lg:w-4/5 lg:h-3.5/4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Detalles de la Asignatura
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="border p-2 rounded col-span-2">
            <strong>Asignatura:</strong> {record.materia.toUpperCase()}
          </p>
          <p className="border p-2 rounded">
            <strong>Unidades:</strong> {record.unidades} Unidad(es)
          </p>
          <p className="border p-2 rounded">
            <strong>Duración:</strong> {record.horas} horas
          </p>
          <p className="border p-2 rounded col-span-2">
            <strong>Competencia:</strong> {record.competencia}
          </p>
          <p className="border p-2 rounded col-span-2">
            <strong>Objetivo General:</strong> {record.objetivoGeneral}
          </p>
          <p className="border p-2 rounded">
            <strong>Profesor:</strong> {record.profesor}
          </p>
          <p className="border p-2 rounded">
            <strong>Familia:</strong> {record.familia.toUpperCase()}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold">Unidades de Aprendizaje</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unidadesDetalle.map((unidad: any, index: number) => (
              <div key={index} className="p-4 border rounded">
                <p>
                  <strong>Unidad {index + 1}:</strong>{" "}
                  {unidad.competenciaEspecifica}
                </p>
                <p>
                  <strong>Semanas:</strong> {unidad.semanas}
                </p>
                <p>
                  <strong>Resultado de Aprendizaje:</strong>{" "}
                  {unidad.resultadoAprendizaje}
                </p>
                <p>
                  <strong>Saber:</strong> {unidad.saber}%
                </p>
                <p>
                  <strong>Hacer-Ser:</strong> {unidad.hacerSer}%
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mr-4 flex justify-evenly w-1/6 mt-5">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 cursor-pointer px-4 rounded "
          >
            Cerrar
          </button>
          <button
            onClick={generatePDF}
            className="bg-blue-500 text-white py-2 px-4 cursor-pointer rounded"
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

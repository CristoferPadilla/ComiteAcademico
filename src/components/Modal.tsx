import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: any | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, record }) => {
    if (!isOpen || !record) return null;

    const unidadesDetalle = record.unidadesDetalle || [];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full h-full md:w-11/12 md:h-5/6 lg:w-4/5 lg:h-3/4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Detalles de la Asignatura</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="border p-2  w-1/2 rounded"><strong>Asignatura:</strong> {record.materia}</p>
                <p className="border p-2   w-1/2 rounded"><strong>Unidades:</strong> {record.unidades} Unidad(es)</p>
                <p className="border p-2   rounded"><strong>Competencia:</strong> {record.competencia}</p>
                <p className="border p-2   rounded"><strong>Objetivo General:</strong> {record.objetivoGeneral}</p>
                <p className="border p-2  w-1/2 rounded"><strong>Profesor:</strong> {record.profesor}</p>
                <p className="border p-2  w-1/2 rounded"><strong>Familia:</strong> {record.familia}</p>
                <p className="border p-2  w-1/2 rounded"><strong>Duración:</strong> {record.horas} horas</p>
                </div>

                <div className="mt-4">
                    <h3 className="font-bold">Unidades de Aprendizaje</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unidadesDetalle.map((unidad: any, index: number) => (
                            <div key={index} className="p-4 border rounded">
                                <p><strong>Unidad {index + 1}:</strong> {unidad.competenciaEspecifica}</p>
                                <p><strong>Semanas:</strong> {unidad.semanas}</p>
                                <p><strong>Resultado de Aprendizaje:</strong> {unidad.resultadoAprendizaje}</p>
                                <p><strong>Saber:</strong> {unidad.saber}%</p>
                                <p><strong>Hacer-Ser:</strong> {unidad.hacerSer}%</p>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={onClose} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default Modal;
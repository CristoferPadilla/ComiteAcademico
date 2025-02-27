import { useEffect, useState } from "react";
import { api } from "../api/db";
import { asignaturas, cuatrimestres } from "../data/data";
import Modal from './Modal';

const RecordList = () => {
    const [registros, setRegistros] = useState<any[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        const data = await api.getItems("registros");
        setRegistros(data);
    };

    const handleRowClick = (record: any) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    return (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Registros</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Cuatrimestre</th>
                        <th className="border p-2 text-left">Asignatura</th>
                        <th className="border p-2 text-left">Unidades</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.map((record, index) => (
                        <tr 
                            key={index} 
                            className="text-center odd:bg-white even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleRowClick(record)}
                        >
                            <td className="border p-2">{cuatrimestres.find(c => c.value === record.cuatrimestre)?.label}</td>
                            <td className="border p-2">{asignaturas.find(a => a.value === record.materia)?.label}</td>
                            <td className="border p-2">{record.unidades} Unidad(es)</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                record={selectedRecord} 
            />
        </div>
    );
};

export default RecordList;
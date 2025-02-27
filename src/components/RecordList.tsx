import { useEffect, useState } from "react";
import { api } from "../api/db";
import { asignaturas, cuatrimestres } from "../data/data";
import Modal from './Modal';
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";


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
        console.log(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.deleteItem("registros", id);
            setRegistros(registros.filter(record => record.id !== id));  
        } catch (error) {
            console.error("Error al eliminar el registro:", error);
        }
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
                        <th className="border p-2 text-left">Acciones</th> 
                    </tr>
                </thead>
                <tbody>
                    {registros.map((record, index) => (
                        <tr 
                            className="text-center odd:bg-white even:bg-gray-50 hover:bg-gray-100 "
                    
                        >
                            <td className="border p-2">{cuatrimestres.find(c => c.value === record.cuatrimestre)?.label}</td>
                            <td className="border p-2">{asignaturas.find(a => a.value === record.materia)?.label}</td>
                            <td className="border p-2">{record.unidades} Unidad(es)</td>
                            <td className="border p-0.5">
                                <button
                                                            key={index} 

                                        onClick={() => handleRowClick(record)}
                                    className="text-gray cursor-pointer mr-15 hover:text-blue-700"
                                >
                                    <EyeIcon className="h-5 w-5" cursor-pointer /> 
                                    </button>
                                    <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }} 
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon className="h-5 w-5 cursor-pointer" /> 
                                    </button>
                            </td>
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

import { useState } from "react";
import { api } from "../api/db";
import { asignaturas, familiaCarreras, cuatrimestres, unidadesAprendizaje } from "../data/data";

const Form = ({ onAddRecord }: { onAddRecord: () => void }) => {
    const initialFormData = {
        id: Date.now().toString(),
        materia: asignaturas[0].value,
        familia: familiaCarreras[0].value,
        cuatrimestre: cuatrimestres[0].value,
        unidades: 1, 
        profesor: asignaturas[0].profesor,
        horas: asignaturas[0].horas,
        competencia: "",
        objetivoGeneral: "",
        unidadesDetalle: Array.from({ length: 1 }, () => ({
            competenciaEspecifica: "",
            semanas: '',
            resultadoAprendizaje: "",
            saber: '',
            hacerSer: '',
            horas: ''
        }))
    };

    const [numUnidades, setNumUnidades] = useState<number>(1);
    const [formData, setFormData] = useState<any>(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index?: number) => {
        const { name, value } = e.target;
    
        if (index !== undefined) {
            const field = name.split('-')[1];
            const updatedUnidadesDetalle = formData.unidadesDetalle.map((unidad: any, i: number) => {
                if (i === index) {
                    return { ...unidad, [field]: value };
                }
                return unidad;
            });
    
            //Vemos que no se pase de 100 sino petamos
            const totalSaber = updatedUnidadesDetalle.reduce((acc: number, unidad: any) => acc + (parseFloat(unidad.saber) || 0), 0);
            const totalHacerSer = updatedUnidadesDetalle.reduce((acc: number, unidad: any) => acc + (parseFloat(unidad.hacerSer) || 0), 0);
    
            if (totalSaber > 100 || totalHacerSer > 100) {
                alert(`La suma total de Saber (${totalSaber}%) o Hacer-Ser (${totalHacerSer}%) no puede superar el 100%.`);
                return;
            }
    
            //Vemos que no se pase de las horas de la asignatura sino petamos
            const totalHoras = updatedUnidadesDetalle.reduce((acc: number, unidad: any) => acc + parseInt(unidad.horas || '0', 10), 0);
            if (totalHoras <= formData.horas) {
                setFormData({ ...formData, unidadesDetalle: updatedUnidadesDetalle });
            } else {
                alert(`El total de horas asignadas a las unidades no puede exceder ${formData.horas} horas. Está asignando ${totalHoras} horas.`);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleNumUnidadesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newNumUnidades = parseInt(e.target.value, 10);
        setNumUnidades(newNumUnidades);
        const updatedUnidadesDetalle = Array.from({ length: newNumUnidades }, (_, i) => 
            formData.unidadesDetalle[i] || {
                competenciaEspecifica: "",
                semanas: '',
                resultadoAprendizaje: "",
                saber: '',
                hacerSer: '',
                horas: ''
            }
        );
        setFormData({ ...formData, unidades: newNumUnidades, unidadesDetalle: updatedUnidadesDetalle });
    };
    //Si o sí, deben de llenarse todos los datos, sino petamos
    const validateForm = () => {
        if (!formData.competencia || !formData.objetivoGeneral) {
            alert("Los campos 'Competencia' y 'Objetivo General' no pueden estar vacíos.");
            return false;
        }

        for (const unidad of formData.unidadesDetalle) {
            if (
                !unidad.competenciaEspecifica ||
                !unidad.semanas ||
                !unidad.resultadoAprendizaje ||
                !unidad.saber ||
                !unidad.hacerSer ||
                !unidad.horas
            ) {
                alert("Todos los campos dentro de cada unidad deben estar completos.");
                return false;
            }
            if (parseFloat(unidad.saber) < 0 || parseFloat(unidad.hacerSer) < 0 || parseFloat(unidad.saber) > 100 || parseFloat(unidad.hacerSer) > 100) {
                alert("Los valores de los porcentajes de 'Saber' y 'Hacer-Ser' deben estar entre 0 y 100.");
                return false;
            }
        }
        return true;
    };

    
    const handleAddRecord = async () => {
        if (!validateForm()) {
            return;
        }

        await api.saveItem("registros", formData);
        onAddRecord();
        setFormData(initialFormData);
        setNumUnidades(1);
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Formulario</h2>

            <div className="grid grid-cols-2 gap-4">
                <select name="materia" value={formData.materia} onChange={handleChange} className="border p-2 rounded">
                    {asignaturas.map((asignatura) => (
                        <option key={asignatura.value} value={asignatura.value}>
                            {asignatura.label}
                        </option>
                    ))}
                </select>

                {asignaturas
                    .filter((asignatura) => asignatura.value === formData.materia)
                    .map((asignatura) => (
                        <div className="border p-2 rounded">
                            <label className="block text-sm font-medium text-gray-700">Total de horas de la asignatura</label>
                            <p key={asignatura.value} className="mt-1 text-sm text-gray-900">{asignatura.horas}</p>
                        </div>
                    ))}

                <select name="familia" value={formData.familia} onChange={handleChange} className="border p-2 rounded">
                    {familiaCarreras.map((familia) => (
                        <option key={familia.value} value={familia.value}>
                            {familia.label}
                        </option>
                    ))}
                </select>

                <select name="cuatrimestre" value={formData.cuatrimestre} onChange={handleChange} className="border p-2 rounded">
                    {cuatrimestres.map((cuatri) => (
                        <option key={cuatri.value} value={cuatri.value}>
                            {cuatri.label}
                        </option>
                    ))}
                </select>

                <select
                    id="numUnidades"
                    name="numUnidades"
                    value={numUnidades}
                    onChange={handleNumUnidadesChange}
                    className="border p-2 rounded w-full"
                >
                    {unidadesAprendizaje.map((unidad) => (
                        <option key={unidad.value} value={unidad.value}>
                            {unidad.label}
                        </option>
                    ))}
                </select>

                <textarea
                    name="competencia"
                    value={formData.competencia}
                    onChange={handleChange}
                    placeholder="Nivel de competencia"
                    className="border p-2 rounded col-span-2"
                />

                <textarea
                    name="objetivoGeneral"
                    value={formData.objetivoGeneral}
                    onChange={handleChange}
                    placeholder="Objetivo general de la asignatura"
                    className="border p-2 rounded col-span-2"
                />
            </div>

            <div className="mt-4">
                {formData.unidadesDetalle.map((unidad: any, index: number) => (
                    <div key={index} className="mt-4 p-4 border rounded">
                        <h3 className="font-bold">Unidad {index + 1}</h3>
                        <textarea
                            name={`unidad-competenciaEspecifica-${index}`}
                            value={unidad.competenciaEspecifica}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Competencia específica"
                            className="border p-2 w-full rounded mt-2"
                        />
                        <input
                            type="number"
                            name={`unidad-semanas-${index}`}
                            value={unidad.semanas}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Número de semanas"
                            className="border p-2 w-1/3 rounded mt-2 mr-2"
                        />
                        <input
                            type="number"
                            name={`unidad-horas-${index}`}
                            value={unidad.horas}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Horas de la unidad"
                            className="border p-2 w-1/3 rounded mt-2"
                        />
                        <textarea
                            name={`unidad-resultadoAprendizaje-${index}`}
                            value={unidad.resultadoAprendizaje}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Resultado de aprendizaje"
                            className="border p-2 w-full rounded mt-2"
                        />
                        <input
                            type="number"
                            name={`unidad-saber-${index}`}
                            value={unidad.saber}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Porcentaje Saber"
                            className="border p-2 w-1/3 mr-2 rounded mt-2"
                        />
                        <input
                            type="number"
                            name={`unidad-hacerSer-${index}`}
                            value={unidad.hacerSer}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Porcentaje Hacer-Ser"
                            className="border p-2 w-1/3 rounded mt-2"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleAddRecord}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Guardar Registro
            </button>
        </div>
    );
};

export default Form;
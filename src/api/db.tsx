interface Registro {
    id: string;
    [key: string]: unknown;
}

export const api = {
    async getItems<T extends Registro>(key: string): Promise<T[]> {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error obteniendo ${key}:`, error);
            return [];
        }
    },

    async saveItem<T extends Registro>(key: string, item: T): Promise<T> {
        try {
            const items = await this.getItems<T>(key);
            const newItems = [...items, item];
            localStorage.setItem(key, JSON.stringify(newItems));
            return item;
        } catch (error) {
            console.error(`Error guardando en ${key}:`, error);
            throw error;
        }
    },

    async deleteItem(key: string, id: string): Promise<void> {
        try {
            const items = await this.getItems<Registro>(key);
            const newItems = items.filter(item => item.id !== id);
            localStorage.setItem(key, JSON.stringify(newItems));
        } catch (error) {
            console.error(`Error eliminando en ${key}:`, error);
            throw error;
        }
    }
};
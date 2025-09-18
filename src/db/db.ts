import { MongoClient, Db} from "mongodb";  

let db: Db | null = null;

export const connectDB = async (): Promise<Db> => {
    if (db) return db; // Si ya está conectado, retorna la instancia existente
    
    try {
        const uri = process.env.MONGO_URL!;
        const client = new MongoClient(uri); //        db = client.db(process.env.MONGO_DB_NAME);
        console.log("Conectado a la base de datos MongoDB");
        db = client.db(process.env.MONGO_DB_NAME);
        return db;
    } catch (error) {
        console.error("Error al conectar a la base de datos MongoDB:", error);
        // process.exit(1); // Salir del proceso en caso de error
        throw error; // Lanzar el error para que pueda ser manejado por el llamador
    }
};

export const getDB = (): Db => {
    if (!db) {
        throw new Error("La base de datos no está conectada. Llama a connectDB primero.");
    }   
    return db;
};